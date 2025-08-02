import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Comprehensive content moderation service with progressive banning system
 */
class ModerationService {
  constructor() {
    // Define offensive content patterns
    this.offensivePatterns = [
      // Profanity and swear words
      /\b(damn|hell|crap|shit|fuck|bitch|ass|bastard|piss|bloody)\b/gi,

      // Hate speech and discrimination
      /\b(hate|stupid|idiot|loser|ugly|fat|dumb|retard|gay|lesbian|negro|nigger)\b/gi,

      // Violence and harm
      /\b(kill|murder|suicide|hurt|harm|die|death|blood|violence|fight|beat|punch|hit)\b/gi,

      // Bullying terms
      /\b(bully|threat|scare|intimidate|harassment|abuse)\b/gi,

      // Sexual content (age-appropriate filtering)
      /\b(sex|porn|naked|nude|breast|penis|vagina|sexual)\b/gi,

      // Drug references
      /\b(drug|cocaine|weed|marijuana|alcohol|beer|drunk|high)\b/gi,

      // Threats and dangerous behavior
      /\b(bomb|gun|weapon|terrorist|attack|destroy|revenge)\b/gi,
    ];

    // Contextual harmful phrases
    this.harmfulPhrases = [
      /i want to (die|kill myself|hurt myself)/gi,
      /you should (die|kill yourself|hurt yourself)/gi,
      /nobody likes you/gi,
      /kill yourself/gi,
      /go die/gi,
      /i hate you/gi,
      /you're worthless/gi,
      /you're stupid/gi,
      /i'm going to hurt/gi,
      /meet me after school/gi,
      /bring a weapon/gi,
      /plan to attack/gi,
    ];

    // Ban durations in minutes
    this.banDurations = {
      first: 20, // 20 minutes
      second: 60, // 1 hour
      third: 240, // 4 hours
      fourth: 720, // 12 hours
      fifth: 1440, // 24 hours
      max: 2880, // 48 hours (maximum)
    };
  }

  /**
   * Analyze content for offensive material
   * @param {string} content - The content to analyze
   * @returns {Object} Analysis result with flagged content and severity
   */
  analyzeContent(content) {
    if (!content || typeof content !== "string") {
      return { isOffensive: false, flags: [], severity: 0 };
    }

    const flags = [];
    let severity = 0;

    // Check for basic offensive patterns
    this.offensivePatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        flags.push({
          type: "offensive_language",
          matches: matches,
          pattern: index,
          severity: 1,
        });
        severity += matches.length;
      }
    });

    // Check for harmful phrases (higher severity)
    this.harmfulPhrases.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        flags.push({
          type: "harmful_content",
          matches: matches,
          pattern: index,
          severity: 3,
        });
        severity += matches.length * 3;
      }
    });

    // Check for excessive caps (potential yelling/aggression)
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capsRatio > 0.7 && content.length > 10) {
      flags.push({
        type: "aggressive_tone",
        matches: ["EXCESSIVE CAPS"],
        severity: 1,
      });
      severity += 1;
    }

    // Check for repeated characters (spam-like behavior)
    if (/(.)\1{4,}/.test(content)) {
      flags.push({
        type: "spam_like",
        matches: content.match(/(.)\1{4,}/g),
        severity: 1,
      });
      severity += 1;
    }

    return {
      isOffensive: flags.length > 0,
      flags: flags,
      severity: severity,
      riskLevel: this.calculateRiskLevel(severity),
    };
  }

  /**
   * Calculate risk level based on severity score
   * @param {number} severity - Severity score
   * @returns {string} Risk level
   */
  calculateRiskLevel(severity) {
    if (severity >= 5) return "high";
    if (severity >= 3) return "medium";
    if (severity >= 1) return "low";
    return "none";
  }

  /**
   * Check if user is currently banned
   * @param {string} userId - User ID to check
   * @returns {Promise<Object>} Ban status information
   */
  async checkUserBanStatus(userId) {
    try {
      const banDoc = await getDoc(doc(db, "user_bans", userId));

      if (!banDoc.exists()) {
        return { isBanned: false, banInfo: null };
      }

      const banData = banDoc.data();
      const now = new Date();
      const banExpiry = banData.banExpiresAt.toDate();

      if (now < banExpiry) {
        return {
          isBanned: true,
          banInfo: {
            ...banData,
            timeRemaining: banExpiry - now,
            expiresAt: banExpiry,
          },
        };
      } else {
        // Ban has expired, remove it
        await deleteDoc(doc(db, "user_bans", userId));
        return { isBanned: false, banInfo: null };
      }
    } catch (error) {
      console.error("Error checking ban status:", error);
      return { isBanned: false, banInfo: null };
    }
  }

  /**
   * Get user's violation history
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of violations
   */
  async getUserViolations(userId) {
    try {
      const violationsQuery = query(
        collection(db, "user_violations"),
        where("userId", "==", userId)
      );

      const snapshot = await getDocs(violationsQuery);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching user violations:", error);
      return [];
    }
  }

  /**
   * Calculate ban duration based on violation history
   * @param {Array} violations - Previous violations
   * @returns {number} Ban duration in minutes
   */
  calculateBanDuration(violations) {
    const violationCount = violations.length;

    switch (violationCount) {
      case 0:
        return this.banDurations.first;
      case 1:
        return this.banDurations.second;
      case 2:
        return this.banDurations.third;
      case 3:
        return this.banDurations.fourth;
      case 4:
        return this.banDurations.fifth;
      default:
        return this.banDurations.max;
    }
  }

  /**
   * Apply ban to user
   * @param {string} userId - User ID to ban
   * @param {Object} violation - Violation details
   * @returns {Promise<Object>} Ban information
   */
  async applyUserBan(userId, violation) {
    try {
      // Get user's violation history
      const violations = await this.getUserViolations(userId);

      // Calculate ban duration
      const banDurationMinutes = this.calculateBanDuration(violations);
      const banExpiresAt = new Date(
        Date.now() + banDurationMinutes * 60 * 1000
      );

      // Record the violation
      await addDoc(collection(db, "user_violations"), {
        userId: userId,
        content: violation.content,
        flags: violation.flags,
        severity: violation.severity,
        riskLevel: violation.riskLevel,
        contentType: violation.contentType, // 'report' or 'solution'
        createdAt: serverTimestamp(),
        violationNumber: violations.length + 1,
      });

      // Apply the ban
      const banData = {
        userId: userId,
        banReason: "Inappropriate content detected",
        violationDetails: violation,
        banDurationMinutes: banDurationMinutes,
        banCreatedAt: serverTimestamp(),
        banExpiresAt: banExpiresAt,
        violationCount: violations.length + 1,
        isActive: true,
      };

      await setDoc(doc(db, "user_bans", userId), banData);

      return {
        banned: true,
        banDurationMinutes: banDurationMinutes,
        expiresAt: banExpiresAt,
        violationCount: violations.length + 1,
        banData: banData,
      };
    } catch (error) {
      console.error("Error applying user ban:", error);
      throw new Error("Failed to apply ban: " + error.message);
    }
  }

  /**
   * Moderate content before submission
   * @param {string} content - Content to moderate
   * @param {string} userId - User ID
   * @param {string} contentType - Type of content ('report' or 'solution')
   * @returns {Promise<Object>} Moderation result
   */
  async moderateContent(content, userId, contentType = "report") {
    try {
      // First check if user is already banned
      const banStatus = await this.checkUserBanStatus(userId);
      if (banStatus.isBanned) {
        return {
          allowed: false,
          reason: "user_banned",
          banInfo: banStatus.banInfo,
          message: `You are currently banned until ${banStatus.banInfo.expiresAt.toLocaleString()}. Reason: ${
            banStatus.banInfo.banReason
          }`,
        };
      }

      // Analyze the content
      const analysis = this.analyzeContent(content);

      if (!analysis.isOffensive) {
        return {
          allowed: true,
          analysis: analysis,
          message: "Content approved",
        };
      }

      // Content is offensive - apply ban
      const violation = {
        content: content,
        flags: analysis.flags,
        severity: analysis.severity,
        riskLevel: analysis.riskLevel,
        contentType: contentType,
      };

      const banResult = await this.applyUserBan(userId, violation);

      return {
        allowed: false,
        reason: "content_violation",
        analysis: analysis,
        banResult: banResult,
        message: `Your content contains inappropriate material and has been blocked. You have been temporarily banned for ${banResult.banDurationMinutes} minutes. This is violation #${banResult.violationCount}.`,
      };
    } catch (error) {
      console.error("Error in content moderation:", error);
      return {
        allowed: false,
        reason: "moderation_error",
        message: "Unable to process content at this time. Please try again.",
      };
    }
  }

  /**
   * Get user's current ban information for display
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Ban display information
   */
  async getBanDisplayInfo(userId) {
    const banStatus = await this.checkUserBanStatus(userId);

    if (!banStatus.isBanned) {
      return null;
    }

    const timeRemaining = banStatus.banInfo.timeRemaining;
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    return {
      isBanned: true,
      reason: banStatus.banInfo.banReason,
      expiresAt: banStatus.banInfo.expiresAt,
      timeRemainingText: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      violationCount: banStatus.banInfo.violationCount,
    };
  }

  /**
   * Remove expired bans (cleanup function)
   * @returns {Promise<number>} Number of bans removed
   */
  async cleanupExpiredBans() {
    try {
      const bansQuery = query(collection(db, "user_bans"));
      const snapshot = await getDocs(bansQuery);
      const now = new Date();
      let removedCount = 0;

      for (const banDoc of snapshot.docs) {
        const banData = banDoc.data();
        const banExpiry = banData.banExpiresAt.toDate();

        if (now >= banExpiry) {
          await deleteDoc(doc(db, "user_bans", banDoc.id));
          removedCount++;
        }
      }

      return removedCount;
    } catch (error) {
      console.error("Error cleaning up expired bans:", error);
      return 0;
    }
  }
}

// Create singleton instance
const moderationService = new ModerationService();

export default moderationService;
