import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Brain,
  Plus,
  Play,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function Quizzes() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [questionCount, setQuestionCount] = useState("10");
  const [loading, setLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  const { user } = useAuth();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${backendURL}/api/transcribe/getNotes`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.notes) {
        setNotes(data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to load notes");
    }
  };

  const generateQuiz = async () => {
    if (!selectedSource) {
      toast.error("Please select a source note");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/transcribe/getQuiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: selectedSource,
        }),
      });

      const data = await response.json();

      if (data.quiz) {
        try {
          const quizData = JSON.parse(data.quiz);
          setGeneratedQuiz({
            title: `Quiz: ${selectedSource}`,
            questions: quizData.map((q, index) => ({
              id: index + 1,
              type: "multiple-choice",
              question: q.question,
              options: [q.option1, q.option2, q.option3, q.option4],
              correct: q.correctOption - 1,
            })),
          });
          toast.success("Quiz generated successfully!");
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
      setLoading(false);
    }
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestion < activeQuiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    activeQuiz.questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (q.type === "multiple-choice" && userAnswer === q.correct) correct++;
      if (q.type === "true-false" && userAnswer === q.correct) correct++;
      if (q.type === "short-answer" && userAnswer?.trim()) correct++;
    });
    return Math.round((correct / activeQuiz.questions.length) * 100);
  };

  const saveQuizScore = async (score) => {
    try {
      const response = await fetch(`${port}/api/transcribe/score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          quizTitle: activeQuiz.title,
          score: score,
          totalQuestions: activeQuiz.questions.length,
          correctAnswers: Math.round(
            (score / 100) * activeQuiz.questions.length
          ),
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Quiz score saved successfully");
      }
    } catch (error) {
      console.error("Error saving quiz score:", error);
    }
  };

  useEffect(() => {
    if (showResults && activeQuiz) {
      const score = calculateScore();
      saveQuizScore(score);
    }
  }, [showResults, activeQuiz]);

  if (activeQuiz && !showResults) {
    const question = activeQuiz.questions[currentQuestion];
    const progress =
      ((currentQuestion + 1) / activeQuiz.questions.length) * 100;

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{activeQuiz.title}</h1>
            <Badge variant="outline">
              Question {currentQuestion + 1} of {activeQuiz.questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            Progress: {Math.round(progress)}%
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.type === "multiple-choice" && (
              <RadioGroup
                value={answers[question.id]?.toString()}
                onValueChange={(value) =>
                  handleAnswer(question.id, Number.parseInt(value))
                }
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setActiveQuiz(null)}>
                Exit Quiz
              </Button>
              <Button onClick={nextQuestion}>
                {currentQuestion === activeQuiz.questions.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Quiz Complete!</CardTitle>
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <CardDescription>
              You scored{" "}
              {Math.round((score / 100) * activeQuiz.questions.length)} out of{" "}
              {activeQuiz.questions.length} questions correctly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {activeQuiz.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correct;

                return (
                  <Card key={question.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium mb-2">
                            {question.question}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Correct answer: {question.options[question.correct]}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => startQuiz(activeQuiz)} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Retake Quiz
              </Button>
              <Button variant="outline" onClick={() => setActiveQuiz(null)}>
                Back to Quizzes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quiz Generation</h1>
            <p className="text-muted-foreground">
              Create and take quizzes from your notes and transcripts
            </p>
          </div>
        </div>

        {/* Quiz Generator */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Generate New Quiz
            </CardTitle>
            <CardDescription>
              Create a quiz from your existing notes or transcripts using AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source..." />
                </SelectTrigger>
                <SelectContent>
                  {notes.map((note) => (
                    <SelectItem key={note._id} value={note.title}>
                      {note.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger>
                  <SelectValue placeholder="Question count..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="15">15 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={generateQuiz}
                disabled={loading}
                className="gap-2 text-white cursor-pointer"
              >
                <Brain className="h-4 w-4" />
                {loading ? "Generating..." : "Generate Quiz"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Quiz */}
      {generatedQuiz && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {generatedQuiz.title}
            </CardTitle>
            <CardDescription>AI-generated quiz ready to take</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {generatedQuiz.questions.length} questions
                </p>
                <p className="text-sm text-muted-foreground">
                  Estimated time:{" "}
                  {Math.ceil(generatedQuiz.questions.length * 1.5)} minutes
                </p>
              </div>
              <Button
                onClick={() => startQuiz(generatedQuiz)}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {notes.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No notes available</h3>
          <p className="text-muted-foreground mb-4">
            Create some notes or transcripts first to generate quizzes
          </p>
        </div>
      )}
    </div>
  );
}
