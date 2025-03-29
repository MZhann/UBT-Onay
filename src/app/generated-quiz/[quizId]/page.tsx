"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { backendApiInstance } from "@/api/index";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

interface QuestionOption {
  label: string;
  option_text: string;
}

interface Question {
  id: string;
  type: "single_choice" | "multiple_choice";
  question_text: string;
  options: QuestionOption[];
}

interface QuizData {
  _id: string;
  title: string;
  subject: string;
  questions: Question[];
}

export default function GeneratedQuizPage({
  params,
}: {
  params: { quizId: string };
}) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [submittingAnswers, setSubmittingAnswers] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await backendApiInstance.get<QuizData>(
          `/generated-quiz/${params.quizId}`
        );
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.quizId]);

  const startQuiz = async () => {
    if (!quiz) return;
    try {
      const response = await backendApiInstance.post(
        `/generated-quiz/${quiz._id}/start`
      );
      setAttemptId(response.data._id);
      setIsQuizStarted(true);
      setTimer(0); // Reset the timer
      setIsRunning(true); // Start the timer
    } catch (error) {
      console.error("Failed to start quiz", error);
    }
  };

  const submitAnswer = async (
    questionId: string,
    selectedOptions: string[]
  ) => {
    if (!attemptId) return;

    setSubmittingAnswers((prev) => ({ ...prev, [questionId]: true })); // Start loading
    try {
      await backendApiInstance.post(`/generated-quiz/${attemptId}/answer`, {
        question_id: questionId,
        selected_options: selectedOptions,
      });
      setAnswers((prev) => ({ ...prev, [questionId]: selectedOptions }));
    } catch (error) {
      console.error("Failed to submit answer", error);
    } finally {
      setSubmittingAnswers((prev) => ({ ...prev, [questionId]: false })); // Stop loading
    }
  };
  const completeQuiz = async () => {
    if (!attemptId) return;
    try {
      await backendApiInstance.post(`/generated-quiz/${attemptId}/submit`);
      setIsRunning(false); // Stop the timer
      router.push(`/result/${attemptId}`);
    } catch (error) {
      console.error("Failed to complete quiz", error);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-myindigo">Loading quiz...</p>;
  if (!quiz)
    return <p className="text-center mt-10 text-red-500">Quiz not found</p>;

  return (
    <div className="min-h-screen flex flex-col items-center p-6 text-gray-700">
      <h1 className="text-3xl font-bold">{quiz.title}</h1>
      <p className="text-lg text-gray-400">Subject: {quiz.subject}</p>
      <div className="text-lg text-myindigo flex gap-2 font-bold">
        <p className="text-gray-400">Time: </p> {timer} sec
      </div>
      <div className="w-full flex">
        <div className="mt-6 w-full space-y-6 px-20">
          {quiz.questions.map((question) => (
            <div key={question.id} className="p-4 bg- rounded-lg">
              <p className="text-lg font-medium">{question.question_text}</p>
              {question.type === "single_choice" ? (
                <RadioGroup
                  disabled={!isQuizStarted}
                  onValueChange={(value) => submitAnswer(question.id, [value])}
                >
                  {question.options.map((option) => (
                    <div
                      key={option.label}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem id={option.label} value={option.label} />
                      <label htmlFor={option.label} className="text-gray-800">
                        {option.option_text}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div>
                  {question.options.map((option) => (
                    <div key={option.label} className="flex items-center">
                      <Checkbox
                        id={option.label}
                        disabled={!isQuizStarted}
                        checked={
                          answers[question.id]?.includes(option.label) || false
                        }
                        onCheckedChange={(checked) => {
                          const updatedOptions = checked
                            ? [...(answers[question.id] || []), option.label]
                            : answers[question.id]?.filter(
                                (o) => o !== option.label
                              ) || [];
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: updatedOptions,
                          }));
                        }}
                      />
                      <label htmlFor={option.label} className="ml-2">
                        {option.option_text}
                      </label>
                    </div>
                  ))}
                  <Button
                    variant={"indigo"}
                    size={"lg"}
                    onClick={() =>
                      submitAnswer(question.id, answers[question.id] || [])
                    }
                    className="mt-2"
                    disabled={submittingAnswers[question.id]} // Disable while submitting
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
          ))}
        </div>
      </div>
      {!isQuizStarted ? (
        <Button
          onClick={startQuiz}
          variant="indigo"
          size="lg"
          className="fixed right-10 bottom-10"
        >
          Start
        </Button>
      ) : (
        <Button
          onClick={completeQuiz}
          variant="indigo"
          size="lg"
          className="fixed right-10 bottom-10"
        >
          Complete
        </Button>
      )}
    </div>
  );
}
