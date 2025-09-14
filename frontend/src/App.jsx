import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Transcribe from "./pages/Transcribe";
import Notes from "./pages/Notes";
import Quizzes from "./pages/Quizzes";
import Footer from "./components/footer";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/transcribe" element={<Transcribe />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/quizzes" element={<Quizzes />} />
        </Routes>
        <Footer></Footer>
      </ThemeProvider>
    </Router>
  );
}

export default App;
