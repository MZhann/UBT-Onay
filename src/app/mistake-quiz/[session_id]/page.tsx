"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getMistakeQuestions,
  answerMistakeQuestion,
  completeMistakeQuizSession,
} from "@/api/mistake-bank";
import { MistakeQuestion } from "@/types/mistakeBankTypes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

export default function MistakeQuizPage() {
  const router = useRouter();
  const { session_id } = useParams() as { session_id: string };

  const [questions, setQuestions] = useState<MistakeQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submittingAnswers, setSubmittingAnswers] = useState<Record<string, boolean>>({});
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      localStorage.setItem("mistake_session_id", session_id);
    }
  }, [session_id]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getMistakeQuestions();
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const submitAnswer = async (questionId: string, selectedOptions: string[]) => {
    if (!session_id) return;

    setSubmittingAnswers((prev) => ({ ...prev, [questionId]: true }));
    try {
      await answerMistakeQuestion(session_id, {
        question_id: questionId,
        selected_options: selectedOptions,
      });
      setAnswers((prev) => ({ ...prev, [questionId]: selectedOptions }));
    } catch (error) {
      console.error("Failed to submit answer", error);
    } finally {
      setSubmittingAnswers((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const completeQuiz = async () => {
    if (!session_id) return;
    try {
      await completeMistakeQuizSession(session_id);
      setIsRunning(false);
      router.push(`/mistake-bank-results/${session_id}`);
    } catch (error) {
      console.error("Failed to complete quiz", error);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-myindigo">Loading questions...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center p-6 text-gray-700">
      <h1 className="text-3xl font-bold mb-2">Mistake Quiz</h1>
      <div className="text-lg text-myindigo flex gap-2 font-bold">
        <p className="text-gray-400">Time:</p> {timer} sec
      </div>
      <div className="w-full flex">
        <div className="mt-6 w-full space-y-6 px-20">
          {questions.map((question) => {
            const isMultipleChoice = question.options.length > 4;

            return (
              <div key={question.question_id} className="p-4 border rounded-lg">
                <p className="text-lg font-medium mb-2">{question.question_text}</p>

                {isMultipleChoice ? (
                  <>
                    {question.options.map((option) => (
                      <div key={option.label} className="flex items-center mb-2">
                        <Checkbox
                          id={`${question.question_id}_${option.label}`}
                          checked={
                            answers[question.question_id]?.includes(option.label) || false
                          }
                          onCheckedChange={(checked) => {
                            const current = answers[question.question_id] || [];
                            const updated = checked
                              ? [...current, option.label]
                              : current.filter((o) => o !== option.label);

                            setAnswers((prev) => ({
                              ...prev,
                              [question.question_id]: updated,
                            }));
                          }}
                        />
                        <label
                          htmlFor={`${question.question_id}_${option.label}`}
                          className="ml-2"
                        >
                          {option.option_text}
                        </label>
                      </div>
                    ))}
                    <Button
                      variant="indigo"
                      size="lg"
                      onClick={() =>
                        submitAnswer(
                          question.question_id,
                          answers[question.question_id] || []
                        )
                      }
                      className="mt-2"
                      disabled={submittingAnswers[question.question_id]}
                    >
                      {submittingAnswers[question.question_id] ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </>
                ) : (
                  <RadioGroup
                    value={answers[question.question_id]?.[0] || ""}
                    onValueChange={(value) => {
                      submitAnswer(question.question_id, [value]);
                    }}
                  >
                    {question.options.map((option) => (
                      <div key={option.label} className="flex items-center mb-2">
                        <RadioGroupItem
                          id={`${question.question_id}_${option.label}`}
                          value={option.label}
                        />
                        <label
                          htmlFor={`${question.question_id}_${option.label}`}
                          className="ml-2"
                        >
                          {option.option_text}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Button
        onClick={completeQuiz}
        variant="indigo"
        size="lg"
        className="fixed right-10 bottom-10"
      >
        Complete
      </Button>
    </div>
  );
}
