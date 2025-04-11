"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyGeneratedQuizzes } from "@/api/generated-quiz";
import { GeneratedQuiz } from "@/types/generatedQuizTypes";
import Skeleton from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 5;

const GeneratedTestsHistory = () => {
  const [quizzes, setQuizzes] = useState<GeneratedQuiz[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMyGeneratedQuizzes();
        console.log("Fetched quizzes:", data);

        if (Array.isArray(data)) {
          setQuizzes(data);
        } else if (data && typeof data === "object") {
          setQuizzes([data]);
        } else {
          setQuizzes([]);
        }
      } catch (error) {
        console.error("Failed to load generated quizzes", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const paginated = quizzes.slice(0, page * ITEMS_PER_PAGE);
  const canLoadMore = quizzes.length > paginated.length;

  return (
    <div className="w-full flex flex-col items-center mt-10 mb-20">
      <h2 className="font-bold text-2xl mb-6">Generated tests</h2>

      {isLoading && (
        <div className="w-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={`skeleton-${i}`}
              className="mt-4 w-full h-24 rounded-xl border-4 bg-[#F2EBD6] px-20"
            />
          ))}
        </div>
      )}

      {!isLoading && paginated.length === 0 && (
        <div className="text-gray-500 w-full flex justify-center">
          <p>No generated tests found.</p>
        </div>
      )}

      {paginated.map((quiz) => (
        <div
          key={quiz._id}
          className="flex mt-4 items-center justify-between relative w-full h-24 rounded-xl border-4 z-0 border-[#D37C26] bg-[#F2EBD6] overflow-hidden px-20 hover:w-[100.5%] duration-200"
        >
          <Image
            src="/assets/images/decoration/history-decor-tree.svg"
            className="absolute -z-10 right-0 top-0 h-24"
            width={370}
            height={200}
            alt="decoration tree image"
          />
          <p className="text-[#D37C26] font-bold text-xl">{quiz.title}</p>
          <p className="text-[#D37C26] font-medium text-xl">
            {quiz.questions.length} questions
          </p>
          <button

            onClick={() => router.push(`/generated-quiz/${quiz._id}`)}
            className="flex items-center p-1 px-4 font-bold text-[#D37C26] bg-white rounded-lg border-4 border-[#D37C26] hover:text-white hover:bg-[#D37C26] hover:border-[#F2EBD6] duration-300"
          >
            Start <ArrowRight className="ml-2" />
          </button>
        </div>
      ))}

      {canLoadMore && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="mt-6 text-[#D37C26] font-bold border border-[#D37C26] rounded-lg px-6 py-2 hover:bg-[#d37c260f]"
        >
          Load more
        </button>
      )}
    </div>
  );
};

export default GeneratedTestsHistory;
