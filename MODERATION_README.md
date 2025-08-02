# Content Moderation System

## Overview

This is a comprehensive content moderation system with progressive banning that automatically detects and handles inappropriate content, offensive language, and harmful material in user submissions.

## Features

### 🛡️ Content Analysis

- **Profanity Detection**: Identifies swear words and inappropriate language
- **Hate Speech Detection**: Catches discriminatory and hateful content
- **Violence & Harm Detection**: Identifies content promoting violence or self-harm
- **Bullying Detection**: Recognizes bullying and threatening behavior
- **Spam Detection**: Catches spam-like patterns and excessive caps

### ⚖️ Progressive Banning System

- **1st Violation**: 20 minutes ban
- **2nd Violation**: 1 hour ban
- **3rd Violation**: 4 hours ban
- **4th Violation**: 12 hours ban
- **5th Violation**: 24 hours ban
- **6+ Violations**: 48 hours ban (maximum)

### 📊 Risk Assessment

- **Low Risk**: Minor violations (1-2 severity points)
- **Medium Risk**: Moderate violations (3-4 severity points)
- **High Risk**: Severe violations (5+ severity points)

## Implementation

### Files Structure

```
src/
├── services/
│   └── moderationService.js      # Core moderation logic
├── hooks/
│   └── useModeration.js          # React hook for moderation
├── components/
│   ├── BanNotification.jsx       # Ban notification modal
│   ├── BanNotification.css       # Ban notification styles
│   └── ModerationWrapper.jsx     # HOC for page protection
├── pages/
│   ├── ModerationDashboard.jsx   # Admin dashboard
│   └── ModerationDashboard.css   # Dashboard styles
└── utils/
    └── moderationTester.js       # Testing utilities
```

### Database Collections

#### `user_violations`

```javascript
{
  userId: string,           // User ID who violated
  content: string,          // The violating content
  flags: array,            // Array of violation flags
  severity: number,        // Severity score
  riskLevel: string,       // 'low', 'medium', 'high'
  contentType: string,     // 'report' or 'solution'
  createdAt: timestamp,    // When violation occurred
  violationNumber: number  // Sequential violation count
}
```

#### `user_bans`

```javascript
{
  userId: string,              // Banned user ID
  banReason: string,           // Reason for ban
  violationDetails: object,    // Details of the violation
  banDurationMinutes: number,  // Ban duration in minutes
  banCreatedAt: timestamp,     // When ban was created
  banExpiresAt: timestamp,     // When ban expires
  violationCount: number,      // Total violations for this user
  isActive: boolean           // Whether ban is currently active
}
```

## Usage

### 1. Basic Content Moderation

```javascript
import { useModeration } from "../hooks/useModeration";

const MyComponent = () => {
  const { moderateContent, isBanned } = useModeration();

  const handleSubmit = async (content) => {
    // Check if user is banned
    if (isBanned()) {
      alert("You are currently banned");
      return;
    }

    // Moderate content
    const result = await moderateContent(content, "report");

    if (!result.allowed) {
      alert(result.message);
      return;
    }

    // Content passed moderation, proceed with submission
    // ... submit content
  };
};
```

### 2. Adding Ban Notifications

```javascript
import BanNotification from "../components/BanNotification";
import { useModeration } from "../hooks/useModeration";

const MyPage = () => {
  const { getBanInfo } = useModeration();
  const [showBan, setShowBan] = useState(false);

  return (
    <div>
      {showBan && (
        <BanNotification
          banInfo={getBanInfo()}
          onClose={() => setShowBan(false)}
        />
      )}
      {/* Your page content */}
    </div>
  );
};
```

### 3. Using Moderation Wrapper

```javascript
import ModerationWrapper from "../components/ModerationWrapper";

const ContentSubmissionPage = () => {
  return (
    <ModerationWrapper requiresContentSubmission={true}>
      {/* Your content submission form */}
    </ModerationWrapper>
  );
};
```

## Testing

### Run Content Tests

```javascript
import { ModerationTester } from "../utils/moderationTester";

// Run all tests
ModerationTester.runAllTests();

// Run specific tests
ModerationTester.runContentTests();
ModerationTester.testBanDurations();
ModerationTester.testRiskLevels();
```

### Test Cases Covered

- Safe content (help requests, friendly messages)
- Mild profanity and offensive language
- Hate speech and discrimination
- Violence and self-harm content
- Bullying and threatening behavior
- Spam-like patterns

## Admin Dashboard

Access the moderation dashboard at `/admin/moderation` to:

- View violation statistics
- Monitor active bans
- Review recent violations
- Manually remove bans
- Cleanup expired bans

## Customization

### Adding New Offensive Patterns

```javascript
// In moderationService.js
this.offensivePatterns.push(/\b(new|bad|words)\b/gi);
```

### Adjusting Ban Durations

```javascript
// In moderationService.js
this.banDurations = {
  first: 30, // 30 minutes instead of 20
  second: 120, // 2 hours instead of 1
  // ... etc
};
```

### Modifying Risk Levels

```javascript
// In moderationService.js
calculateRiskLevel(severity) {
    if (severity >= 8) return 'critical';  // Add new level
    if (severity >= 5) return 'high';
    if (severity >= 3) return 'medium';
    if (severity >= 1) return 'low';
    return 'none';
}
```

## Security Notes

- All content is analyzed client-side before submission
- Violations are logged with timestamps and user IDs
- Bans are automatically managed with expiration
- Progressive system prevents abuse escalation
- Anonymous reporting maintains user privacy

## Performance Considerations

- Content analysis runs in milliseconds
- Firestore queries are optimized with indexes
- Ban status is cached and refreshed periodically
- Expired bans are cleaned up automatically

## Future Enhancements

- [ ] Machine learning integration for better detection
- [ ] Appeal system for false positives
- [ ] Whitelist for approved users
- [ ] Integration with external moderation APIs
- [ ] Real-time content monitoring
- [ ] Automated report generation
