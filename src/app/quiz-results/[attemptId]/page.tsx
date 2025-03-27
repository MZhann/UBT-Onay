"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getQuizAttemptDetails, getQuizQuestions } from "@/api/quiz";
import { GetQuizAttemptDetailsResponse, GetQuizQuestionsResponse } from "@/types/quizTypes";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function QuizResultsPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [attempt, setAttempt] = useState<GetQuizAttemptDetailsResponse | null>(null);
  const [questions, setQuestions] = useState<GetQuizQuestionsResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!attemptId) return;
        const attemptData = await getQuizAttemptDetails(attemptId);
        const questionsData = await getQuizQuestions(attemptData.quiz_id);
        setAttempt(attemptData);
        setQuestions(questionsData);
      } catch (error) {
        console.error("Failed to fetch quiz attempt details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [attemptId]);

  if (loading) return <p className="text-center mt-10 text-myindigo">Loading...</p>;
  if (!attempt) return <p className="text-center mt-10 text-red-500">Attempt not found</p>;

  const started = new Date(attempt.started_at);
  const finished = new Date(attempt.finished_at);
  const timeTakenSec = Math.floor((finished.getTime() - started.getTime()) / 1000);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="p-6 text-gray-800 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-2">{attempt.quiz_title}</h1>
      <p className="text-gray-500 mb-1">
        Total score: <span className="font-bold text-lg text-gray-700">{attempt.score} / {questions.length}</span>
      </p>
      <p className="text-gray-500 mb-1">
        Time taken: <span className="font-bold text-lg text-gray-700">{formatTime(timeTakenSec)}</span>
      </p>

      <div className="space-y-6 mt-6">
        {questions.map((question, index) => {
          const userAnswer = attempt.answers.find((a) => a.question_id === question.id);
          const selected = userAnswer?.selected_option || [];
          const correctLabels = question.options.filter(opt => opt.is_correct).map(opt => opt.label);
          const isCorrect =
            selected.length > 0 &&
            selected.every((sel) => correctLabels.includes(sel)) &&
            correctLabels.length === selected.length;

          return (
            <div key={question.id} className="p-4 border rounded-lg bg-white shadow">
              <p className="font-medium text-lg mb-2">
                {index + 1}. {question.question_text}
              </p>
              <ul className="space-y-1">
                {question.options.map((opt) => {
                  const isUserSelected = selected.includes(opt.label);
                  const isCorrectOption = opt.is_correct;

                  return (
                    <li
                      key={opt.label}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm",
                        isCorrectOption
                          ? "bg-green-100 text-green-800"
                          : isUserSelected
                          ? "bg-red-100 text-red-800"
                          : "text-gray-700"
                      )}
                    >
                      <span className="font-semibold">{opt.label}.</span> {opt.option_text} {" "}
                      {isUserSelected && <Badge variant="outline">Your choice</Badge>}
                      {isCorrectOption && <Badge className="ml-2">Correct</Badge>}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 font-semibold text-sm">
                Result: {" "}
                <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                  {isCorrect ? "Correct" : "Incorrect"}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
