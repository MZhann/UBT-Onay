"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import {
  startQuizAttempt,
  getQuizQuestions,
  submitAnswer,
  finishQuizAttempt,
} from "@/api/quiz";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import QuizIdProvider from "@/components/page-components/test-page/quiz-id-provider";

interface QuestionOption {
  label: string;
  option_text: string;
}

interface Question {
  id: string;
  subject: string;
  question_text: string;
  type: "single_choice" | "multiple_choice";
  options: QuestionOption[];
}

export default function UbtTestPage() {
  const quizId = QuizIdProvider();
  const router = useRouter();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [submittingAnswers, setSubmittingAnswers] = useState<
    Record<string, boolean>
  >({});
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!quizId) return;

      try {
        const questionsData = await getQuizQuestions(quizId);
        setQuestions(questionsData);
      } catch (error) {
        console.error("Failed to load questions", error);
        router.push("/ubt-tests");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  const startQuiz = async () => {
    if (!quizId) return;
    try {
      const response = await startQuizAttempt(quizId);
      setAttemptId(response._id);
      setIsQuizStarted(true);
      setTimer(0);
      setIsRunning(true);
    } catch (error) {
      console.error("Failed to start quiz", error);
    }
  };

  const handleSubmitAnswer = async (
    questionId: string,
    selectedOptions: string[]
  ) => {
    if (!attemptId) return;
    setSubmittingAnswers((prev) => ({ ...prev, [questionId]: true }));

    try {
      await submitAnswer(attemptId, {
        question_id: questionId,
        option_labels: selectedOptions,
      });
      setAnswers((prev) => ({ ...prev, [questionId]: selectedOptions }));
    } catch (error) {
      console.error("Error submitting answer", error);
    } finally {
      setSubmittingAnswers((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const completeQuiz = async () => {
    if (!attemptId) return;
    try {
      await finishQuizAttempt(attemptId);
      setIsRunning(false);
      router.push(`/quiz-results/${attemptId}`);
    } catch (error) {
      console.error("Failed to complete quiz", error);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;

  const formatTime = (totalSeconds: number) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  if (loading)
    return <p className="text-center mt-10 text-myindigo">Loading quiz...</p>;

  return (
    <div className="min-h-screen flex flex-col-reverse md:flex-row p-6 text-gray-800">
      {/* Questions Area */}
      <div className="flex-1 px-10">
        <h1 className="text-3xl font-bold mb-4">UNT Test</h1>

        {!isQuizStarted ? (
          <Button className="w-full h-16 text-lg" onClick={startQuiz}>
            Start Test
          </Button>
        ) : (
          <div className="space-y-6">
            {Array.from(new Set(questions.map((q) => q.subject))).map(
              (subject) => {
                const subjectQuestions = questions.filter(
                  (q) => q.subject === subject
                );
                return (
                  <div key={subject}>
                    <h2 className="text-xl font-semibold text-indigo-600">
                      {subject}
                    </h2>
                    <div className="space-y-4 mt-2">
                      {subjectQuestions.map((question, idx) => {
                        const questionNumber = idx + 1;

                        return (
                          <div
                            key={question.id}
                            className="p-4 border rounded-lg"
                          >
                            <p className="text-base font-medium mb-2">
                              {questionNumber}. {question.question_text}
                            </p>

                            {question.type === "single_choice" ? (
                              <RadioGroup
                                disabled={!isQuizStarted}
                                onValueChange={(value) =>
                                  handleSubmitAnswer(question.id, [value])
                                }
                              >
                                {question.options.map((option) => (
                                  <div
                                    key={option.label}
                                    className="flex items-center space-x-2"
                                  >
                                    <RadioGroupItem
                                      id={`${question.id}-${option.label}`}
                                      value={option.label}
                                    />
                                    <label
                                      htmlFor={`${question.id}-${option.label}`}
                                    >
                                      {option.option_text}
                                    </label>
                                  </div>
                                ))}
                              </RadioGroup>
                            ) : (
                              <div>
                                {question.options.map((option) => (
                                  <div
                                    key={option.label}
                                    className="flex items-center"
                                  >
                                    <Checkbox
                                      id={`${question.id}-${option.label}`}
                                      disabled={!isQuizStarted}
                                      checked={
                                        answers[question.id]?.includes(
                                          option.label
                                        ) || false
                                      }
                                      onCheckedChange={(checked) => {
                                        const updated = checked
                                          ? [
                                              ...(answers[question.id] || []),
                                              option.label,
                                            ]
                                          : answers[question.id]?.filter(
                                              (l) => l !== option.label
                                            ) || [];

                                        setAnswers((prev) => ({
                                          ...prev,
                                          [question.id]: updated,
                                        }));
                                      }}
                                    />
                                    <label
                                      htmlFor={`${question.id}-${option.label}`}
                                      className="ml-2"
                                    >
                                      {option.option_text}
                                    </label>
                                  </div>
                                ))}
                                <Button
                                  variant="indigo"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() =>
                                    handleSubmitAnswer(
                                      question.id,
                                      answers[question.id] || []
                                    )
                                  }
                                  disabled={submittingAnswers[question.id]}
                                >
                                  {submittingAnswers[question.id] ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                  ) : (
                                    "Submit"
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      <div className="w-64 hidden md:flex"></div>
      {/* Right Sidebar */}
      <div className="w-full md:w-64 h-fit md:border-none pl-10 md:pl-6 border-l flex gap-6 md:flex-col md:fixed md:top-16 md:right-0 md:h-full bg-white p-4 md:shadow-lg">
        <div className="text-xl font-bold text-myindigo mb-4">Test Info</div>
        <div className="text-gray-700 mb-2">
          <strong>Time:</strong> {formatTime(timer)}
        </div>
        <div className="text-gray-700 mb-2">
          <strong>Answered:</strong> {answeredCount} / {totalCount}
        </div>

        {isQuizStarted && (
          <Button
            className=""
            variant="indigo"
            size="lg"
            onClick={completeQuiz}
          >
            Complete Test
          </Button>
        )}
      </div>
    </div>
  );
}
