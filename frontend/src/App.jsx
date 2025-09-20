import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Transcribe from "./pages/Transcribe";
import Notes from "./pages/Notes";
import Enhance from "./pages/Enhance";
import Quizzes from "./pages/Quizzes";
import Footer from "./components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/transcribe"
            element={
              <ProtectedRoute>
                <Transcribe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enhance"
            element={
              
                <Enhance />
            
            }
          />
          <Route
            path="/quizzes"
            element={
              <ProtectedRoute>
                <Quizzes />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer></Footer>
        <Toaster />
      </ThemeProvider>
    </Router>
  );
}

export default App;
