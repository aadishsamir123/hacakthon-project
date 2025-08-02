import moderationService from "../services/moderationService";

/**
 * Moderation Tester Utility
 *
 * Provides tools to test and validate the moderation service.
 * Features:
 * - Simulate moderation scenarios with sample data
 * - Validate responses from moderation APIs
 * - Debug and log moderation results for analysis
 */

/**
 * Utility functions for testing the moderation system
 */
export class ModerationTester {
  /**
   * Test various content examples
   */
  static async runContentTests() {
    const testCases = [
      // Safe content
      {
        content: "I'm feeling sad today and need some advice",
        expected: false,
      },
      { content: "I love playing with my friends at school", expected: false },
      { content: "Can someone help me with my homework?", expected: false },

      // Mild offensive content
      { content: "This is so damn hard", expected: true },
      { content: "You're an idiot", expected: true },
      { content: "I hate this stupid game", expected: true },

      // Harmful content
      { content: "I want to hurt myself", expected: true },
      { content: "You should kill yourself", expected: true },
      { content: "I'm going to bring a weapon to school", expected: true },

      // Mixed content
      {
        content: "I'm having a really bad day and everything sucks",
        expected: true,
      },
      { content: "HELP ME PLEASE I'M REALLY SCARED", expected: true },
    ];

    console.log("🧪 Running Moderation Content Tests...\n");

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const result = moderationService.analyzeContent(testCase.content);

      const passed = result.isOffensive === testCase.expected;
      const status = passed ? "✅ PASS" : "❌ FAIL";

      console.log(`Test ${i + 1}: ${status}`);
      console.log(`Content: "${testCase.content}"`);
      console.log(`Expected: ${testCase.expected ? "Offensive" : "Safe"}`);
      console.log(`Got: ${result.isOffensive ? "Offensive" : "Safe"}`);
      console.log(`Risk Level: ${result.riskLevel}`);
      console.log(`Severity: ${result.severity}`);

      if (result.flags.length > 0) {
        console.log(`Flags: ${result.flags.map((f) => f.type).join(", ")}`);
      }

      console.log("---");
    }
  }

  /**
   * Test ban duration calculation
   */
  static testBanDurations() {
    console.log("⏰ Testing Ban Duration Calculations...\n");

    const violationCounts = [0, 1, 2, 3, 4, 5, 10];

    violationCounts.forEach((count) => {
      const mockViolations = new Array(count).fill({});
      const duration = moderationService.calculateBanDuration(mockViolations);

      console.log(
        `Violation #${count + 1}: ${duration} minutes (${Math.floor(
          duration / 60
        )}h ${duration % 60}m)`
      );
    });
  }

  /**
   * Test risk level calculations
   */
  static testRiskLevels() {
    console.log("🎯 Testing Risk Level Calculations...\n");

    const severityScores = [0, 1, 2, 3, 4, 5, 8, 10];

    severityScores.forEach((severity) => {
      const riskLevel = moderationService.calculateRiskLevel(severity);
      console.log(`Severity ${severity}: ${riskLevel} risk`);
    });
  }

  /**
   * Run all tests
   */
  static async runAllTests() {
    console.log("🚀 Starting Moderation System Tests...\n");

    await this.runContentTests();
    console.log("\n");
    this.testBanDurations();
    console.log("\n");
    this.testRiskLevels();

    console.log("\n✨ All tests completed!");
  }
}

// Example usage in browser console:
// import { ModerationTester } from './path/to/moderationTester';
// ModerationTester.runAllTests();

export default ModerationTester;
