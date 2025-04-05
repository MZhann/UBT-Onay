"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMistakeQuizSessionResults } from "@/api/mistake-bank";
import { CompletedMistakeResult } from "@/types/mistakeBankTypes";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function MistakeBankResultsPage() {
  const { session_id } = useParams() as { session_id: string };
  const [results, setResults] = useState<CompletedMistakeResult[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getMistakeQuizSessionResults(session_id);
        setResults(data.mistakes);
      } catch (error) {
        console.error("Ошибка при загрузке результатов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [session_id]);

  if (loading)
    return <p className="text-center mt-10 text-myindigo">Loading results...</p>;

  if (!results)
    return <p className="text-center mt-10 text-red-500">Results not found</p>;

  const totalScore = results.filter((r) => r.is_correct).length;

  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Mistake Bank Quiz Results</h1>
      <p className="text-gray-600 mb-2">
        Session ID:{" "}
        <span className="text-gray-800 font-semibold">{session_id}</span>
      </p>
      <p className="text-gray-600 mb-6">
        Total Score:{" "}
        <span className="text-lg font-semibold text-gray-900">
          {totalScore} / {results.length}
        </span>
      </p>

      <div className="space-y-6">
        {results.map((res, index) => {
          const correctLabels = res.options
            .filter((opt) => opt.is_correct)
            .map((opt) => opt.label);

          const isCorrect =
            res.selected_options.length === correctLabels.length &&
            res.selected_options.every((sel) => correctLabels.includes(sel));

          return (
            <div
              key={res.question_id}
              className={cn(
                "p-4 border rounded-lg shadow",
                isCorrect ? "bg-green-50 border-green-300" : "bg-white"
              )}
            >
              <p className="font-medium text-lg mb-2">
                {index + 1}. {res.question_text}
              </p>
              <ul className="space-y-1">
                {res.options.map((opt) => {
                  const isUserSelected = res.selected_options.includes(opt.label);
                  const isCorrectOption = opt.is_correct;

                  const optionClass = cn(
                    "px-3 py-2 rounded-md text-sm",
                    {
                      // Верный ответ, если пользователь ошибся — показываем зелёным
                      "bg-green-100 text-green-800":
                        (isCorrect && isUserSelected) || (!isCorrect && isCorrectOption),
                      // Выбор пользователя, если он был неверным — красным
                      "bg-red-100 text-red-800":
                        !isCorrect && isUserSelected && !isCorrectOption,
                      // Иначе обычный стиль
                    }
                  );

                  return (
                    <li key={opt.label} className={optionClass}>
                      <span className="font-semibold">{opt.label}.</span>{" "}
                      {opt.option_text}{" "}
                      {isUserSelected && (
                        <Badge variant="outline">Your choice</Badge>
                      )}
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
