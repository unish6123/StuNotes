# StuNotes - AI-Powered Study Platform

StuNotes is a modern web application designed to make studying more effective and accessible for students. It helps organize lecture materials, transcribe audio, generate notes, and create AI-powered quizzes — all in one place.

---

## Live Application

**Access the live application here:** [https://stunotes.caldwellwebservices.com](https://stunotes.caldwellwebservices.com)

---

## Demo Video

Watch our comprehensive demo showcasing all features of StuNotes:

[📹 Watch Demo Video](./demo-video.mp4)

*Click the link above to watch the full demonstration of StuNotes in action.*

---

## Introduction

Many students struggle to keep up with lectures, organize notes, and retain key concepts effectively. StuNotes tackles this challenge by combining audio transcription, smart note-taking, and AI-powered quiz generation into a single, intuitive platform.

With StuNotes, students can:

- **Record or upload lecture audio**
- **Automatically transcribe speech to text**
- **Convert transcriptions into structured notes**
- **Generate AI-powered quizzes to reinforce learning**
- **Track performance with detailed analytics**
- **Securely manage all study materials in one place**

---

## Features

### Core Features

- **Speech-to-Text Transcription** — Convert lectures or audio input into text instantly using Web Speech API
- **Smart Note Management** — Create, edit, and organize notes with a clean, intuitive interface
- **AI-Powered Quiz Generation** — Automatically generate quizzes from notes or custom content using Google Gemini AI
- **Advanced Analytics** — Track quiz performance with detailed visualizations and course-specific insights
- **Secure Authentication** — Email verification and secure user authentication system
- **Responsive Design** — Works seamlessly across desktop, tablet, and mobile devices

---

## Tech Stack

### Frontend

- **React.js** — Modern UI framework with hooks and context
- **Vite** — Fast build tool and development server
- **Tailwind CSS** — Utility-first CSS framework
- **shadcn/ui** — Elegant, accessible UI components built on Radix UI
- **Recharts** — Interactive charts for analytics visualization
- **React Router** — Client-side routing
- **Web Speech API** — Browser-based speech recognition for live transcription
- **Lucide React** — Beautiful icon library

### Backend

- **Node.js** — Server-side JavaScript runtime
- **Express.js** — Minimal and flexible web application framework
- **MongoDB** — NoSQL database for storing users, notes, and transcripts
- **Mongoose** — Elegant MongoDB object modeling
- **Nodemailer** — Email sending for verification and notifications
- **bcrypt** — Password hashing and security
- **JWT** — JSON Web Tokens for authentication
- **Google Gemini API 2.5 Flash** — Powers AI-driven features like quiz generation and content analysis

---

## Team

| Role | Name |
|------|------|
| **Project Manager, Back-End Developer** | Unish Aryal |
| **Full Stack Developer, Technical Writer** | Narayan Khanal |
| **Front-End Developer, Technical Writer** | Pavel Annor |
| **Front-End Developer, UI/UX Developer** | Matthew Delgado |

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or cloud instance like MongoDB Atlas)
- Google Gemini API Key (for AI features)

### Installation

#### Clone the Repository
```bash
git clone https://github.com/yourusername/StuNotes.git
cd StuNotes
```

#### Install Frontend Dependencies
```bash
cd frontend
npm install
```

#### Install Backend Dependencies
```bash
cd ../backend
npm install
```

### Environment Configuration

#### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:
```env
VITE_BACKEND_URL=http://localhost:4000
```

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:
```env
PORT=4000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/stunotes

JWT_SECRET=your_super_secret_jwt_key_here

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

GEMINI_API_KEY=your_gemini_api_key_here

FRONTEND_URL=http://localhost:5173
```

### Running the Application

#### Start the Backend Server
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:4000`

#### Start the Frontend Development Server
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

#### Access the Application

Open your browser and navigate to `http://localhost:5173`

---

## User Documentation

### Getting Started

**Sign Up**

1. Visit the application homepage
2. Click "Sign Up" and enter your email, username, and password
3. Verify your email using the 6-digit code sent to your inbox
4. You'll be automatically logged in after verification

**Create Your First Note**

1. Navigate to the "Notes" page
2. Click "Create Note" button
3. Enter a title and description
4. Optionally add a course name for organization
5. Click "Create" to save

**Transcribe a Lecture**

1. Go to the "Transcribe" page
2. Click the microphone icon to start recording
3. Speak clearly into your microphone
4. The transcription appears in real-time
5. Click "Stop" when finished
6. Click "Save Transcript" to store it

**Generate a Quiz**

1. Navigate to the "Quizzes" page
2. Choose between two options:
   - Generate from Note: Select an existing note to create a quiz
   - Generate from Content: Enter custom content or topic
3. Set the number of questions (1-10)
4. Click "Generate Quiz" and wait for AI to create your quiz
5. Answer the questions by selecting options
6. Click "Submit Quiz" to see your results

**Track Your Progress**

1. Visit the "Analytics" page
2. View overall performance or select a specific course
3. See detailed metrics including:
   - Total quizzes taken
   - Average score
   - Improvement trend with visual indicators
   - Score progression over time
   - Individual quiz results with timestamps
   - Color-coded performance bars

### Tips for Best Experience

**For Transcription:**
- Use a good quality microphone in a quiet environment
- Speak clearly and at a moderate pace
- The app requires HTTPS in production for microphone access

**For Quizzes:**
- Provide detailed notes or content for better AI-generated questions
- Take your time to read each question carefully
- Review incorrect answers to learn from mistakes

**For Analytics:**
- Take multiple quizzes to see meaningful trend data
- Click on individual course cards to see course-specific analytics
- Use the search bar to quickly find courses

**Browser Compatibility:**
- Use Chrome or Edge for best Web Speech API support
- Firefox does not fully support Web Speech Recognition

---

## Developer Documentation

### Architecture Overview

StuNotes follows a modern full-stack architecture with a React frontend and Node.js/Express backend, connected via RESTful APIs. The application uses MongoDB for data persistence and integrates with Google Gemini AI for quiz generation.

### Project Structure
```
StuNotes/
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # shadcn/ui base components
│   │   │   ├── Navbar.jsx
│   │   │   ├── NoteCard.jsx
│   │   │   └── ...
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Notes.jsx
│   │   │   ├── Quizzes.jsx
│   │   │   └── Analytics.jsx
│   │   ├── contexts/        # React context providers
│   │   │   └── AuthContext.jsx
│   │   └── main.jsx         # App entry point
│   └── package.json
│
├── backend/
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Note.js
│   │   ├── TranscribedNote.js
│   │   └── QuizResult.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── notesRoutes.js
│   │   └── quizRoutes.js
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   └── server.js            # Express server entry
│
└── README.md
```
---

**Built with ❤️ by the StuNotes Team**
