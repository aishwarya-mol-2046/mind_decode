import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, CheckCircle2, XCircle, Award, RotateCcw, TrendingUp } from "lucide-react";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

const mockQuestions: Question[] = [
  {
    id: 1,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: "O(log n)",
    explanation: "Binary search divides the search space in half with each iteration, resulting in logarithmic time complexity.",
  },
  {
    id: 2,
    question: "Which principle is NOT part of OOP?",
    options: ["Encapsulation", "Inheritance", "Compilation", "Polymorphism"],
    correctAnswer: "Compilation",
    explanation: "Compilation is a process, not an OOP principle. The four pillars of OOP are Encapsulation, Inheritance, Polymorphism, and Abstraction.",
  },
  {
    id: 3,
    question: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Simple Question Language",
      "System Query List",
      "Standard Quality Logic",
    ],
    correctAnswer: "Structured Query Language",
    explanation: "SQL (Structured Query Language) is the standard language for managing relational databases.",
  },
  {
    id: 4,
    question: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Stack", "Array", "Tree"],
    correctAnswer: "Stack",
    explanation: "Stack follows the LIFO principle where the last element added is the first one to be removed, like a stack of plates.",
  },
  {
    id: 5,
    question: "What is the primary purpose of a constructor in OOP?",
    options: [
      "To destroy objects",
      "To initialize objects",
      "To copy objects",
      "To compare objects",
    ],
    correctAnswer: "To initialize objects",
    explanation: "Constructors are special methods that initialize new objects with default or provided values when they are created.",
  },
];

export default function MockTest() {
  const [testGenerated, setTestGenerated] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleGenerateTest = () => {
    setTestGenerated(true);
    setAnswers({});
    setSubmitted(false);
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const allAnswered = Object.keys(answers).length === mockQuestions.length;

  const score = mockQuestions.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correctAnswer ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / mockQuestions.length) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getPerformanceMessage = () => {
    if (percentage >= 80) return "Excellent! You're well prepared!";
    if (percentage >= 60) return "Good job! Keep studying to improve.";
    return "Keep practicing! Review the explanations below.";
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 dark:from-gray-900 dark:via-amber-900 dark:to-yellow-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Mock Test Generator
          </h1>
          <p className="text-muted-foreground">
            Practice with AI-generated questions based on your materials
          </p>
        </div>

        {!testGenerated ? (
          <Card className="p-12 text-center shadow-lg border-amber-200/50 dark:border-amber-800/50">
            <FileText className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-4">Ready to test yourself?</h2>
            <p className="text-muted-foreground mb-8">
              Generate a mock test with questions tailored to your study materials
            </p>
            <Button
              size="lg"
              onClick={handleGenerateTest}
              data-testid="button-generate-test"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md"
            >
              Generate Mock Test
            </Button>
          </Card>
        ) : submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 mb-8 shadow-lg border-amber-200/50 dark:border-amber-800/50">
              <div className="text-center mb-8">
                <Award className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-2">Test Complete!</h2>
                <p className="text-lg text-muted-foreground mb-6">{getPerformanceMessage()}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
                  <div className="p-4 rounded-lg bg-muted/50 shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Score</p>
                    <p className={`text-4xl font-bold ${getScoreColor()}`} data-testid="text-score">
                      {percentage}%
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Correct</p>
                    <p className="text-4xl font-bold text-green-600 dark:text-green-400" data-testid="text-correct">
                      {score}/{mockQuestions.length}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Incorrect</p>
                    <p className="text-4xl font-bold text-red-600 dark:text-red-400" data-testid="text-incorrect">
                      {mockQuestions.length - score}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={handleRetake}
                    data-testid="button-retake"
                    variant="outline"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake Test
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleGenerateTest}
                    data-testid="button-new-test"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    New Test
                  </Button>
                </div>
              </div>
            </Card>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Detailed Analysis
              </h2>
            </div>

            <div className="space-y-6">
              {mockQuestions.map((q, index) => {
                const isCorrect = answers[q.id] === q.correctAnswer;
                const userAnswer = answers[q.id];

                return (
                  <Card key={q.id} className="p-6 shadow-md border-amber-200/50 dark:border-amber-800/50" data-testid={`card-result-${q.id}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-muted-foreground">
                            Question {index + 1}
                          </span>
                          {isCorrect ? (
                            <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                              <CheckCircle2 className="w-4 h-4" />
                              Correct
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-sm font-medium text-red-600 dark:text-red-400">
                              <XCircle className="w-4 h-4" />
                              Incorrect
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-4">{q.question}</h3>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {q.options.map((option, optIndex) => {
                        const isUserAnswer = userAnswer === option;
                        const isCorrectAnswer = option === q.correctAnswer;

                        return (
                          <div
                            key={optIndex}
                            className={`p-4 rounded-lg border shadow-sm ${
                              isCorrectAnswer
                                ? "border-green-500 bg-green-500/10"
                                : isUserAnswer && !isCorrect
                                ? "border-red-500 bg-red-500/10"
                                : "border-border"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {isCorrectAnswer && (
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                              )}
                              {isUserAnswer && !isCorrect && (
                                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 border-l-4 border-primary">
                      <p className="text-sm font-semibold mb-1">Explanation:</p>
                      <p className="text-sm text-muted-foreground">{q.explanation}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-6 mb-8">
              {mockQuestions.map((q, index) => (
                <Card key={q.id} className="p-6 shadow-md border-amber-200/50 dark:border-amber-800/50" data-testid={`card-question-${q.id}`}>
                  <div className="mb-4">
                    <span className="text-sm font-mono text-muted-foreground">
                      Question {index + 1} of {mockQuestions.length}
                    </span>
                    <h3 className="text-lg font-semibold mt-2">{q.question}</h3>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className={`flex items-center p-4 rounded-lg border cursor-pointer hover-elevate transition-all ${
                          answers[q.id] === option
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={option}
                          checked={answers[q.id] === option}
                          onChange={() => handleAnswerChange(q.id, option)}
                          className="mr-3"
                          data-testid={`input-q${q.id}-option${optIndex}`}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <Button
              size="lg"
              disabled={!allAnswered}
              onClick={handleSubmit}
              data-testid="button-submit-test"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Submit Test
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
