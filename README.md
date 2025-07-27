# [APP_NAME]

[APP_TAGLINE]

A React web application with Firebase authentication and Firestore integration, featuring user registration, login, and a protected dashboard.

## Features

- 🔐 **Authentication**: User registration and login with Firebase Auth
- 📊 **User Management**: Store user data in Firebase Firestore
- 🛡️ **Protected Routes**: Secure pages that require authentication
- 📱 **Responsive Design**: Mobile-friendly interface
- 🎨 **Modern UI**: Clean and intuitive user interface

## Pages

- **Welcome Page**: Landing page with login/signup options
- **Login Page**: User authentication
- **Sign Up Page**: New user registration
- **Home Page**: Protected dashboard showing user information

## Setup Instructions

### 1. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Get your Firebase configuration from Project Settings > General > Your apps
5. Replace the configuration in `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-actual-app-id",
};
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

```bash
npm run dev
```

### 4. Customize Your App

Replace all instances of `[APP_NAME]` and `[APP_TAGLINE]` with your actual app name and tagline:

- In `src/pages/Welcome.jsx`
- In `src/pages/Login.jsx`
- In `src/pages/SignUp.jsx`
- In `src/pages/Home.jsx`
- In this README file

## Project Structure

```
src/
├── components/
│   └── PrivateRoute.jsx      # Route protection component
├── contexts/
│   └── AuthContext.jsx       # Authentication context and hooks
├── firebase/
│   └── config.js            # Firebase configuration
├── pages/
│   ├── Welcome.jsx          # Landing page
│   ├── Welcome.css          # Welcome page styles
│   ├── Login.jsx            # Login page
│   ├── SignUp.jsx           # Registration page
│   ├── Auth.css             # Shared auth page styles
│   ├── Home.jsx             # Protected dashboard
│   └── Home.css             # Home page styles
├── App.jsx                  # Main app component with routing
├── App.css                  # Global app styles
├── index.css                # Base styles
└── main.jsx                 # App entry point
```

## Technologies Used

- **React 19** - Frontend framework
- **React Router DOM** - Client-side routing
- **Firebase Auth** - User authentication
- **Firebase Firestore** - NoSQL database
- **Vite** - Build tool and development server

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication Flow

1. **Unauthenticated users** are redirected to the Welcome page
2. **Login/Signup** pages handle user authentication
3. **Successful authentication** redirects to the Home page
4. **User data** is stored in Firestore during registration
5. **Protected routes** require authentication to access
6. **Logout** clears session and redirects to Welcome page

## Firestore Data Structure

User documents are stored in the `users` collection with the following structure:

```javascript
{
  name: "User Name",
  email: "user@example.com",
  uid: "firebase-user-id",
  createdAt: "2025-01-27T..."
}
```

## License

This project is open source and available under the [MIT License](LICENSE).+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
