"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMyQuizAttempts } from "@/api/generated-quiz";
import { QuizAttempt } from "@/types/generatedQuizTypes";
import { cn } from "@/lib/utils";

export default function QuizResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const attempts = await getMyQuizAttempts();
        const found = attempts.find((a) => a.id === attemptId);
        if (found) setAttempt(found);
      } catch (error) {
        console.error("Failed to load attempt", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [attemptId]);

  if (loading) return <p className="text-center mt-10 text-myindigo">Loading...</p>;
  if (!attempt) return <p className="text-center mt-10 text-red-500">Attempt not found</p>;

  const started = new Date(attempt.started_at);
  const finished = attempt.finished_at ? new Date(attempt.finished_at) : new Date();
  const timeTakenSec = Math.floor((finished.getTime() - started.getTime()) / 1000);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-2">{attempt.quiz_title}</h1>
      <p className="text-gray-500">
        Subject:{" "}
        <span className="font-bold text-lg text-gray-700">{attempt.quiz_subject}</span>
      </p>
      <p className="text-gray-500">
        Total score:{" "}
        <span className="font-bold text-lg text-gray-700">
          {attempt.score} / {attempt.answers.length}
        </span>
      </p>
      <p className="text-gray-500 mb-6">
        Time taken:{" "}
        <span className="font-bold text-lg text-gray-700">
          {formatTime(timeTakenSec)}
        </span>
      </p>

      <div className="space-y-6">
        {attempt.answers.map((answer, index) => {
          const correctLabels = answer.options
            .filter((opt) => opt.is_correct)
            .map((opt) => opt.label);

          const isCorrect =
            answer.selected_options.length === correctLabels.length &&
            answer.selected_options.every((sel) => correctLabels.includes(sel));

          return (
            <div
              key={answer.question_id}
              className={cn(
                "p-4 border rounded-lg shadow",
                isCorrect ? "bg-green-50 border-green-300" : "bg-white"
              )}
            >
              <p className="font-medium text-lg mb-2">
                {index + 1}. {answer.question_text}
              </p>
              <ul className="space-y-1">
                {answer.options.map((opt) => {
                  const isUserSelected = answer.selected_options.includes(opt.label);
                  const isCorrectOption = opt.is_correct;

                  const optionClass = cn(
                    "px-3 py-2 rounded-md text-sm",
                    {
                      "bg-green-100 text-green-800": (isCorrect && isUserSelected) || (!isCorrect && isCorrectOption),
                      "bg-red-100 text-red-800": !isCorrect && isUserSelected && !isCorrectOption,
                    }
                  );

                  return (
                    <li key={opt.label} className={optionClass}>
                      <span className="font-semibold">{opt.label}.</span> {opt.text}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 font-semibold text-sm">
                Result:{" "}
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
