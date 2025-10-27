# StuNotes

**StuNotes** is a modern web application designed to make studying more effective and accessible for students. It helps organize lecture materials, transcribe audio, generate notes, and create AI-powered quizzes — all in one place.

---

## Introduction

Many students struggle to keep up with lectures, organize notes, and retain key concepts effectively. **StuNotes** tackles this challenge by combining **audio transcription**, **smart note-taking**, and **AI-powered quiz generation** into a single, intuitive platform.

With StuNotes, students can:

- Record or upload lecture audio.
- Automatically transcribe speech to text.
- Convert transcriptions into structured notes.
- Generate quizzes using AI to reinforce learning.
- Access and manage all study materials in one place.

---

## 🧩 Tech Stack

### **Frontend**

- [React.js](https://react.dev/) — Modern UI framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) — Elegant, accessible UI components -[Speech Recognition Library](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) — For live transcription and voice input

### **Backend**

- [Node.js](https://nodejs.org/) — Server-side JavaScript runtime
- [MongoDB](https://www.mongodb.com/) — NoSQL database for storing users and notes
- [Nodemailer](https://nodemailer.com/) — Handles email sending and verification
- Email Verification Flow — Ensures secure and verified access

---

## ✨ Features

- **Speech-to-Text Transcription** — Convert lectures or audio input into text instantly.
- **Smart Note Organization** — Clean, structured notes with easy access.
- **AI-Powered Quiz Generation** — Automatically generate quizzes to reinforce understanding.
- **Email Verification** — Secure signup/login using email validation.
- **Modern UI** — Responsive and accessible design using TailwindCSS + shadcn/ui.
- MongoDB Integration\*\* — Store notes, user data, and transcriptions efficiently.

---

## ⚙️ Installation & Setup

### **Prerequisites**

Make sure you have the following installed:

- Node.js (v18+)
- npm or yarn
- MongoDB (local or cloud instance)

### **Clone the Repository**

```bash
git clone https://github.com/yourusername/StuNotes.git
cd StuNotes
```

### **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

The frontend should now be running at [http://localhost:5173](http://localhost:5173) (or the port configured by Vite/React).

### **Backend Setup**

```bash
cd backend
npm install
npm run dev
```

Backend will start on [http://localhost:4000](http://localhost:4000) (configurable in `.env`).

---

## Environment Variables

Create a `.env` file in the `server/` directory and include:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
CLIENT_URL=http://localhost:5173
```

For the frontend, if needed, create a `.env` file in `client/`:

```
VITE_API_URL=http://localhost:5000
```

---

## Future Enhancements

- 📚 Integration with cloud storage (Google Drive, OneDrive)
- 🧾 Export notes to PDF or Word
- 📈 Dashboard for tracking study progress
- 🎧 Multiple language support for transcription
- 🧩 Collaboration features for group study

---

## Contributing

We welcome contributions!
To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m "Add your feature"`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## Contact

**Team StuNotes**
📧 Email: [support@stunotes.com](mailto:support@stunotes.com)
🌐 Website: [www.stunotes.com](https://www.stunotes.com)
