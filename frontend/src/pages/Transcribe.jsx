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
import { Mic, Square, Play, Pause, Save, Trash2, MicOff } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function Transcribe() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [savedTranscripts, setSavedTranscripts] = useState([
    {
      id: 1,
      title: "Physics Lecture - Wave Motion",
      date: "2024-01-15",
      duration: "45:30",
      content: "Today we discussed wave motion and its properties...",
    },
    {
      id: 2,
      title: "History Class - World War II",
      date: "2024-01-14",
      duration: "38:15",
      content: "The causes and effects of World War II were complex...",
    },
  ]);

  const intervalRef = useRef();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.warn("Browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

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

  const saveTranscript = () => {
    if (transcript.trim()) {
      const newTranscript = {
        id: Date.now(),
        title: `Lecture - ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString().split("T")[0],
        duration: `${Math.floor(recordingTime / 60)}:${(recordingTime % 60)
          .toString()
          .padStart(2, "0")}`,
        content: transcript,
      };
      setSavedTranscripts((prev) => [newTranscript, ...prev]);
      resetTranscript();
      setRecordingTime(0);
    }
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
              <div className="flex gap-2">
                <Button onClick={saveTranscript} className="gap-2 text-white">
                  <Save className="h-4 w-4" />
                  Save Transcript
                </Button>
                <Button
                  onClick={resetTranscript}
                  variant="outline"
                  className="gap-2 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
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
              {savedTranscripts.map((transcript) => (
                <Card key={transcript.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{transcript.title}</h3>
                      <Badge variant="secondary">{transcript.duration}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {transcript.date}
                    </p>
                    <p className="text-sm line-clamp-2">{transcript.content}</p>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
