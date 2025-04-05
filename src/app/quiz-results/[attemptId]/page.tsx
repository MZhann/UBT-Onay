"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getQuizAttemptDetails } from "@/api/quiz";
import { GetQuizAttemptDetailsResponse } from "@/types/quizTypes";
import { cn } from "@/lib/utils";

export default function QuizResultsPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [attempt, setAttempt] = useState<GetQuizAttemptDetailsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!attemptId) return;
        const attemptData = await getQuizAttemptDetails(attemptId);
        setAttempt(attemptData);
      } catch (error) {
        console.error("Failed to fetch quiz attempt details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [attemptId]);

  if (loading)
    return <p className="text-center mt-10 text-myindigo">Loading...</p>;
  if (!attempt)
    return <p className="text-center mt-10 text-red-500">Attempt not found</p>;

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="p-6 text-gray-800 w-full mx-auto px-20">
      <h1 className="text-3xl font-bold mb-4">{attempt.quiz_title}</h1>

      <div className="text-lg mb-8 flex items-center justify-between flex-wrap gap-4">
        <p>
          <span className="text-gray-500">Score:</span>{" "}
          <span className="font-bold text-gray-700">
            {attempt.score} / {attempt.max_score}
          </span>
        </p>
        <p>
          <span className="text-gray-500">Questions:</span>{" "}
          <span className="font-bold text-gray-700">
            {attempt.questions_count}
          </span>
        </p>
        <p>
          <span className="text-gray-500">Time taken:</span>{" "}
          <span className="font-bold text-gray-700">
            {formatTime(Math.floor(attempt.time_taken))}
          </span>
        </p>
        <p>
          <span className="text-gray-500">Variant:</span>{" "}
          <span className="font-bold text-gray-700">
            {attempt.quiz_variant}
          </span>
        </p>
        <p>
          <span className="text-gray-500">Year:</span>{" "}
          <span className="font-bold text-gray-700">{attempt.quiz_year}</span>
        </p>
      </div>

      <div className="space-y-6">
        {attempt.answers.map((question, index) => {
          const correctLabels = question.options
            .filter((opt) => opt.is_correct)
            .map((opt) => opt.label);

          const isCorrect =
            question.selected_options.length === correctLabels.length &&
            question.selected_options.every((sel) =>
              correctLabels.includes(sel)
            );

          return (
            <div
              key={question.question_id}
              className={cn(
                "p-4 border rounded-lg shadow",
                isCorrect ? "bg-green-50 border-green-300" : "bg-white"
              )}
            >
              <p className="font-medium text-lg mb-2">
                {index + 1}. {question.question_text}
              </p>
              <ul className="space-y-1">
                {question.options.map((opt) => {
                  const isUserSelected = question.selected_options.includes(
                    opt.label
                  );
                  const isCorrectOption = opt.is_correct;

                  const optionClass = cn("px-3 py-2 rounded-md text-sm", {
                    "bg-green-100 text-green-800":
                      (isCorrect && isUserSelected) ||
                      (!isCorrect && isCorrectOption),
                    "bg-red-100 text-red-800":
                      !isCorrect && isUserSelected && !isCorrectOption,
                  });

                  return (
                    <li key={opt.label} className={optionClass}>
                      <span className="font-semibold">{opt.label}.</span>{" "}
                      {opt.option_text}
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
