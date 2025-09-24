import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export default function QuickQuizModal({ isOpen, onClose, content, title }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Generate quiz questions from content
  useEffect(() => {
    if (content && isOpen) {
      generateQuestions(content);
    }
  }, [content, isOpen]);

  const generateQuestions = (text) => {
    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 4);
    const uniqueWords = [...new Set(words)].slice(0, 20);

    const mockQuestions = [
      {
        id: 1,
        question: "Which keyword appears in this content?",
        options: [
          uniqueWords[0] || "emphasizing",
          uniqueWords[1] || "regression",
          "unrelated",
          "random",
        ],
        correct: 0,
      },
      {
        id: 2,
        question: "Which concept is discussed in this content?",
        options: [
          "irrelevant",
          uniqueWords[2] || "functional",
          "unrelated",
          "random",
        ],
        correct: 1,
      },
      {
        id: 3,
        question: "What topic is covered in this material?",
        options: [
          "unrelated",
          "random",
          uniqueWords[3] || "perspective",
          "irrelevant",
        ],
        correct: 2,
      },
    ];

    setQuestions(mockQuestions);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const handleClose = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    onClose();
  };

  if (!isOpen) return null;

  if (showResults) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-800 text-white">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Quiz Complete!</h2>
              <p className="text-gray-400">
                You scored {score} out of {questions.length} questions
                correctly.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold mb-4">
              {Math.round((score / questions.length) * 100)}%
            </div>
            <Button
              onClick={handleClose}
              className="bg-green-600 hover:bg-green-700"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-800 text-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Quick Quiz</h2>
            <p className="text-gray-400">
              Answer 3 questions correctly to earn tokens.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-8">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <h3 className="text-lg font-medium">
                Q{index + 1}. {question.question}
              </h3>

              <RadioGroup
                value={answers[question.id]?.toString()}
                onValueChange={(value) =>
                  handleAnswer(question.id, Number.parseInt(value))
                }
                className="grid grid-cols-2 gap-4"
              >
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex items-center space-x-3"
                  >
                    <RadioGroupItem
                      value={optionIndex.toString()}
                      id={`q${question.id}-option${optionIndex}`}
                      className="border-gray-600 text-white"
                    />
                    <Label
                      htmlFor={`q${question.id}-option${optionIndex}`}
                      className="text-white cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
            className="bg-green-600 hover:bg-green-700 px-8"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
