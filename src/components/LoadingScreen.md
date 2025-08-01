# LoadingScreen Component & useLoading Hook

Beautiful, reusable loading components for the hackathon project.

## LoadingScreen Component

### Basic Usage

```jsx
import LoadingScreen from '../components/LoadingScreen';

// Full screen loading
<LoadingScreen message="Loading your data..." />

// Overlay loading (appears over existing content)
<LoadingScreen message="Saving..." overlay={true} />

// Different sizes
<LoadingScreen size="small" />   // 40x40px spinner
<LoadingScreen size="medium" />  // 60x60px spinner
<LoadingScreen size="large" />   // 80x80px spinner (default)
```

### Props

- `message` (string): Loading message to display (default: "Loading...")
- `size` (string): Spinner size - "small", "medium", or "large" (default: "large")
- `overlay` (boolean): Whether to display as overlay (default: false)

## useLoading Hook

### Basic Usage

```jsx
import { useLoading } from "../hooks/useLoading";
import LoadingScreen from "../components/LoadingScreen";

function MyComponent() {
  const { isLoading, message, startLoading, stopLoading, withLoading } =
    useLoading();

  const handleSubmit = async () => {
    await withLoading(async () => {
      // Your async operation here
      await submitData();
    }, "Submitting your data...");
  };

  return (
    <div>
      {isLoading && <LoadingScreen message={message} overlay={true} />}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

### Hook Methods

- `isLoading` (boolean): Current loading state
- `message` (string): Current loading message
- `startLoading(message?)`: Start loading with optional custom message
- `stopLoading()`: Stop loading
- `withLoading(asyncFn, message?)`: Wrap async function with loading state
- `setMessage(message)`: Update loading message

## Styling Features

- Glassmorphism effect with backdrop blur
- Smooth animations and transitions
- Responsive design for mobile/desktop
- Consistent with app's blue color scheme (#2196f3)
- Multiple animation types (spinner + bouncing dots)
- Elegant shadow and glow effects

## Examples in Project

### Home Page

```jsx
if (loading) {
  return <LoadingScreen message="Loading your dashboard..." />;
}
```

### Report Submission

```jsx
{
  isSubmitting && (
    <LoadingScreen message="Submitting your report..." overlay={true} />
  );
}
```

### Authentication

```jsx
{
  loading && (
    <LoadingScreen message="Logging you in..." overlay={true} size="medium" />
  );
}
```
