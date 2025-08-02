import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import moderationService from "../services/moderationService";

/**
 * useModeration Hook
 *
 * Custom React hook to handle content moderation and user restrictions.
 * Features:
 * - Provides functions to moderate user-generated content
 * - Checks if a user is banned and retrieves ban information
 * - Integrates with moderation services for content analysis
 */

/**
 * React hook for handling content moderation and user bans
 */
export const useModeration = () => {
  const { currentUser } = useAuth();
  const [banInfo, setBanInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check ban status on mount and user change
  useEffect(() => {
    const checkBanStatus = async () => {
      if (!currentUser) {
        setBanInfo(null);
        setLoading(false);
        return;
      }

      try {
        const banDisplayInfo = await moderationService.getBanDisplayInfo(
          currentUser.uid
        );
        setBanInfo(banDisplayInfo);
      } catch (error) {
        console.error("Error checking ban status:", error);
        setBanInfo(null);
      } finally {
        setLoading(false);
      }
    };

    checkBanStatus();

    // Set up interval to refresh ban status every minute
    const interval = setInterval(checkBanStatus, 60000);

    return () => clearInterval(interval);
  }, [currentUser]);

  /**
   * Moderate content before submission
   * @param {string} content - Content to moderate
   * @param {string} contentType - Type of content ('report' or 'solution')
   * @returns {Promise<Object>} Moderation result
   */
  const moderateContent = async (content, contentType = "report") => {
    if (!currentUser) {
      return {
        allowed: false,
        reason: "not_authenticated",
        message: "You must be logged in to submit content.",
      };
    }

    try {
      const result = await moderationService.moderateContent(
        content,
        currentUser.uid,
        contentType
      );

      // If user was banned, update local ban info
      if (!result.allowed && result.reason === "content_violation") {
        const newBanInfo = await moderationService.getBanDisplayInfo(
          currentUser.uid
        );
        setBanInfo(newBanInfo);
      }

      return result;
    } catch (error) {
      console.error("Error in content moderation:", error);
      return {
        allowed: false,
        reason: "moderation_error",
        message: "Unable to process content at this time. Please try again.",
      };
    }
  };

  /**
   * Check if user is currently banned
   * @returns {boolean} True if user is banned
   */
  const isBanned = () => {
    return banInfo && banInfo.isBanned;
  };

  /**
   * Get ban information for display
   * @returns {Object|null} Ban information or null if not banned
   */
  const getBanInfo = () => {
    return banInfo;
  };

  /**
   * Refresh ban status manually
   */
  const refreshBanStatus = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const newBanInfo = await moderationService.getBanDisplayInfo(
        currentUser.uid
      );
      setBanInfo(newBanInfo);
    } catch (error) {
      console.error("Error refreshing ban status:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    banInfo,
    isBanned,
    getBanInfo,
    moderateContent,
    refreshBanStatus,
    loading,
  };
};
