"use client";

import { useEffect, useState } from "react";
import { getMistakeQuestions } from "@/api/mistake-bank";
import { MistakeQuestion } from "@/types/mistakeBankTypes";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { startMistakeQuizSession } from "@/api/mistake-bank";
import { Loader2 } from "lucide-react";
import { getAllMistakeQuizSessions } from "@/api/mistake-bank";

const MistakeBank = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mistakeQuestions, setMistakeQuestions] = useState<MistakeQuestion[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMistakes = async () => {
      try {
        const data = await getMistakeQuestions();
        setMistakeQuestions(data);
      } catch (error) {
        console.error("Failed to fetch mistake questions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMistakes();
  }, []);
  
  const handleStartQuiz = async () => {
    try {
      setIsLoading(true);
      const data = await startMistakeQuizSession();
      router.push(`/mistake-quiz/${data.session_id}`);
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка запуска сессии:", error);

      try {
        const sessions = await getAllMistakeQuizSessions();
        const activeSession = sessions.find((s) => s.status === "in_progress");

        if (activeSession) {
          router.push(`/mistake-quiz/${activeSession._id}`);
        } else {
          alert("Не удалось найти активную сессию.");
        }
      } catch (fetchError) {
        console.error("Ошибка получения списка сессий:", fetchError);
        alert("Произошла ошибка при проверке активных сессий.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col w-full items-center px-20 pt-10">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4">Mistake Bank</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p className="text-muted-foreground">
            Total questions with mistakes:{" "}
            <span className="font-semibold">{mistakeQuestions.length}</span>
          </p>
        )}
        <div
          className="w-full h-36 mt-4 rounded-lg text-white font-bold flex flex-col items-center justify-center relative"
          style={{
            backgroundImage: `url('/assets/images/decoration/bg-mistake.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2 className="text-2xl">Mistake Bank</h2>
          <p className="font-bold text-lg">
            Questions in mistake bank: {mistakeQuestions.length}
          </p>
        </div>
        <Button
          className="w-full mt-4 font-bold text-lg h-12"
          onClick={() => handleStartQuiz()}
          variant={"indigo"}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin size-8 text-white" />
          ) : (
            "Start Quiz"
          )}
        </Button>
      </div>
    </div>
  );
};

export default MistakeBank;
