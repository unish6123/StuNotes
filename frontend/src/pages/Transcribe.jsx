import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Mic, Square, Play, Pause, Save, Trash2, MicOff } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Transcribe() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [title, setTitle] = useState("");
  const [savedTranscripts, setSavedTranscripts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const intervalRef = useRef();
  const { user } = useAuth();
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (user) {
      fetchSavedTranscripts();
    }
  }, [user]);

  const fetchSavedTranscripts = async () => {
    try {
      const response = await fetch(`${backendURL}/api/transcribe/getNotes`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.notes) {
        setSavedTranscripts(data.notes);
      }
    } catch (error) {
      console.error("Error fetching transcripts:", error);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    resetTranscript();

    SpeechRecognition.startListening({ continuous: true, language: "en-US" });

    intervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const pauseRecording = () => {
    setIsPaused(true);
    SpeechRecognition.stopListening();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resumeRecording = () => {
    setIsPaused(false);
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    intervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    SpeechRecognition.stopListening();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const saveTranscript = async () => {
    if (!transcript.trim()) {
      toast.error("No transcript to save");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title for your transcript");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/transcribe/saveNotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          content: transcript,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Transcript saved successfully!");
        resetTranscript();
        setRecordingTime(0);
        setTitle("");
        fetchSavedTranscripts();
      } else {
        toast.error(data.message || "Failed to save transcript");
      }
    } catch (error) {
      console.error("Error saving transcript:", error);
      toast.error("Failed to save transcript");
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async (title) => {
    setQuizLoading(title);
    try {
      const response = await fetch(`${backendURL}/api/transcribe/getQuiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (data.quiz) {
        toast.success("Quiz generated successfully!");
        try {
          const quizData = JSON.parse(data.quiz);
          const formattedQuiz = {
            title: `Quiz: ${title}`,
            questions: quizData.map((q, index) => ({
              id: index + 1,
              type: "multiple-choice",
              question: q.question,
              options: [q.option1, q.option2, q.option3, q.option4],
              correct: q.correctOption - 1,
            })),
          };
          // Navigate to quizzes page with the generated quiz data
          navigate("/quizzes", { state: { generatedQuiz: formattedQuiz } });
        } catch (parseError) {
          console.error("Error parsing quiz data:", parseError);
          toast.error("Failed to parse quiz data");
        }
      } else {
        toast.error(data.message || "Failed to generate quiz");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz");
    } finally {
      setQuizLoading(null);
    }
  };

  const handleDeleteTranscript = async (transcriptId, transcriptTitle) => {
    setDeleteLoading(transcriptId);
    try {
      const response = await fetch(`${backendURL}/api/transcribe/deleteNote`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ noteId: transcriptId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`"${transcriptTitle}" deleted successfully!`);
        fetchSavedTranscripts();
      } else {
        toast.error(data.message || "Failed to delete transcript");
      }
    } catch (error) {
      console.error("Error deleting transcript:", error);
      toast.error("Failed to delete transcript");
    } finally {
      setDeleteLoading(null);
    }
  };

  const clearAll = () => {
    resetTranscript();
    setRecordingTime(0);
    setTitle("");
    // Stop recording if currently recording
    if (isRecording) {
      setIsRecording(false);
      setIsPaused(false);
      SpeechRecognition.stopListening();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    toast.success("Transcript and timer cleared");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MicOff className="h-5 w-5" />
              Speech Recognition Not Supported
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your browser doesn't support speech recognition. Please use
              Chrome, Edge, or Safari for the best experience.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Audio Transcription</h1>
        <p className="text-muted-foreground">
          Record and transcribe your lectures in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recording Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Live Recording
            </CardTitle>
            <CardDescription>
              Start recording to begin real-time transcription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recording Controls */}
            <div className="text-center space-y-4">
              <div className="text-4xl font-mono font-bold">
                {formatTime(recordingTime)}
              </div>

              <div className="flex justify-center gap-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="gap-2 text-white cursor-pointer"
                  >
                    <Mic className="h-5 w-5" />
                    Start Recording
                  </Button>
                ) : (
                  <>
                    {!isPaused ? (
                      <Button
                        onClick={pauseRecording}
                        variant="outline"
                        size="lg"
                        className="gap-2 bg-transparent cursor-pointer"
                      >
                        <Pause className="h-5 w-5" />
                        Pause
                      </Button>
                    ) : (
                      <Button
                        onClick={resumeRecording}
                        size="lg"
                        className="gap-2 cursor-pointer text-white"
                      >
                        <Play className="h-5 w-5" />
                        Resume
                      </Button>
                    )}
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      size="lg"
                      className="gap-2 cursor-pointer"
                    >
                      <Square className="h-5 w-5" />
                      Stop
                    </Button>
                  </>
                )}
              </div>

              {isRecording && (
                <Badge
                  variant={
                    isPaused
                      ? "secondary"
                      : listening
                      ? "default"
                      : "destructive"
                  }
                >
                  {isPaused
                    ? "Paused"
                    : listening
                    ? "Listening..."
                    : "Not Listening"}
                </Badge>
              )}
            </div>

            {/* Live Transcript */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Live Transcript</label>
              <Textarea
                value={transcript}
                readOnly
                placeholder="Transcription will appear here as you speak..."
                className="h-[200px] resize-none overflow-y-auto"
              />
            </div>

            {transcript && (
              <div className="space-y-4">
                {" "}
                {/* Changed to space-y-4 for better spacing */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for your transcript..."
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={saveTranscript}
                    className="gap-2 text-white"
                    disabled={loading} // Added loading state
                  >
                    <Save className="h-4 w-4" />
                    {loading ? "Saving..." : "Save Transcript"}
                  </Button>
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    className="gap-2 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Transcripts</CardTitle>
            <CardDescription>
              Your previously recorded and transcribed lectures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedTranscripts.length === 0 ? ( // Added empty state
                <p className="text-muted-foreground text-center py-8">
                  No saved transcripts yet. Start recording to create your first
                  transcript!
                </p>
              ) : (
                savedTranscripts.map((transcript) => (
                  <Card key={transcript._id} className="p-4">
                    {" "}
                    {/* Use _id from MongoDB */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{transcript.title}</h3>
                        <Badge variant="secondary">
                          {new Date(transcript.createdAt).toLocaleDateString()}{" "}
                          {/* Use createdAt from backend */}
                        </Badge>
                      </div>
                      <p className="text-sm line-clamp-3">
                        {transcript.content}
                      </p>{" "}
                      {/* Show more content */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateQuiz(transcript.title)}
                          disabled={quizLoading === transcript.title}
                        >
                          {quizLoading === transcript.title
                            ? "Generating..."
                            : "Generate Quiz"}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-destructive hover:text-white bg-transparent"
                              disabled={deleteLoading === transcript._id}
                            >
                              {deleteLoading === transcript._id ? (
                                "Deleting..."
                              ) : (
                                <>
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Transcript
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "
                                {transcript.title}"? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteTranscript(
                                    transcript._id,
                                    transcript.title
                                  )
                                }
                                className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
