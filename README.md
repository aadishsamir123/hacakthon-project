# Hackathon Project

A React web application with AI-powered support chat functionality for the GIIS hackathon.

## Features

- User authentication with Firebase
- Personal dashboard and reporting system
- Community features for sharing reports
- Interactive games
- **AI Support Chatbot** - Powered by Groq API with safety boundaries

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hacakthon-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   - Copy `.env.example` to `.env`
   - Get your Groq API key from [https://console.groq.com/keys](https://console.groq.com/keys)
   - Add your API key to the `.env` file:
     ```
     VITE_GROQ_API_KEY=your_actual_groq_api_key_here
     ```

4. **Firebase Configuration**

   - Set up your Firebase project
   - Configure authentication and firestore
   - Update `src/firebase/config.js` with your Firebase config

5. **Run the development server**
   ```bash
   npm run dev
   ```

## AI Chatbot Features

The AI support chatbot includes:

- **Safety Boundaries**: Cannot provide medical advice, crisis intervention, or harmful content
- **Crisis Detection**: Automatically detects crisis keywords and provides appropriate resources
- **Error Handling**: Robust error handling with user-friendly messages
- **Professional Limitations**: Clear boundaries about what the AI can and cannot do
- **Responsive Design**: Works on desktop and mobile devices

### Safety Features

- Detects mentions of self-harm, suicide, or crisis situations
- Provides immediate crisis resources (988, Crisis Text Line, etc.)
- Refuses to provide medical, legal, or financial advice
- Cannot roleplay as licensed professionals

## Technology Stack

- React 19
- React Router DOM
- Firebase (Auth & Firestore)
- Groq API (AI Chat)
- Vite (Build tool)
- CSS3 with modern features

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Important Notes

- The AI chatbot is designed for general emotional support only
- In crisis situations, users are directed to professional help
- API keys should never be committed to version control
- The app requires authentication to access most features
