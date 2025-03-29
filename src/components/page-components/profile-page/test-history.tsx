import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyQuizAttempts } from "@/api/quiz";
import { QuizAttemptShort } from "@/types/quizTypes";
// import { Loader } from "lucide-react";
import Skeleton from "@/components/ui/skeleton";
const TestHistory = () => {
  const [attempts, setAttempts] = useState<QuizAttemptShort[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setIsLoading(true);
        const data = await getMyQuizAttempts();

        if (!data || !Array.isArray(data)) {
          console.warn("Unexpected response format for quiz attempts");
          setAttempts([]);
          return;
        }

        const sorted = data
          .filter((a) => a.is_completed)
          .sort(
            (a, b) =>
              new Date(b.ended_at || "").getTime() -
              new Date(a.ended_at || "").getTime()
          )
          .slice(0, 3);

        setAttempts(sorted);
      } catch (err) {
        console.error("Failed to load quiz attempts", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col items-center mt-4">
        <h2 className="font-bold text-2xl mb-6">History</h2>
        {isLoading && (
          <div className="grid auto-rows-min gap-4 md:grid-cols-3 w-full text-white">
            <Skeleton className="aspect-video w-full flex flex-col items-center bg-indigo-50 justify-center rounded-xl" />
            <Skeleton className="aspect-video w-full flex flex-col items-center bg-indigo-50 justify-center rounded-xl" />
            <Skeleton className="aspect-video w-full flex flex-col items-center bg-indigo-50 justify-center rounded-xl" />
          </div>
        )}

        {attempts.length === 0 && !isLoading && (
          <div className="text-gray-500 w-full flex justify-center">
            <p>No attempts found.</p>
          </div>
        )}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 w-full text-white">
          {attempts.map((attempt) => (
            <div
              key={attempt._id}
              onClick={() => router.push(`/test?id=${attempt.quiz_id}`)}
              className="aspect-video w-full flex flex-col items-center justify-center rounded-xl bg-[url('/assets/images/decoration/history-bg.svg')] bg-cover bg-center cursor-pointer hover:opacity-90 transition hover:-mt-1 duration-200 transition-all"
            >
              <p className="text-xl underline font-bold">
                {attempt.quiz_title}
              </p>
              <p>
                variant: <strong>{attempt.quiz_variant}</strong>
              </p>
              <p className="text-sm">
                year: <strong>{attempt.quiz_year}</strong>
              </p>
              <p className="text-lg font-bold mt-20">result: {attempt.score}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TestHistory;
// const TestHistory = () => {
//   return (
//     <div className="w-full flex flex-col items-center mt-4">
//       <h2 className="font-bold text-2xl mb-6">History</h2>
//       <div className="grid auto-rows-min gap-4 md:grid-cols-3 w-full text-white">
//         <div className="aspect-video w-full flex flex-col items-center justify-center rounded-xl bg-[url('/assets/images/decoration/history-bg.svg')] bg-cover bg-center">
//           <p className="text-xl undeline font-bold">Mathematics / Physics</p>
//           <p className="">
//             variant: <strong>5343</strong>
//           </p>
//           <p className="text-lg font-bold mt-20">result: 120/140</p>
//         </div>
//         <div className="aspect-video w-full rounded-xl bg-[url('/assets/images/decoration/history-bg.svg')] bg-cover bg-center">
//           <div className="aspect-video w-full flex flex-col items-center justify-center rounded-xl bg-[url('/assets/images/decoration/history-bg.svg')] bg-cover bg-center">
//             <p className="text-xl undeline font-bold">
//               Geography / Mathematics
//             </p>
//             <p className="">
//               variant: <strong>5456</strong>
//             </p>
//             <p className="text-lg font-bold mt-20">result: 103/140</p>
//           </div>
//         </div>
//         <div className="aspect-video w-full rounded-xl bg-[url('/assets/images/decoration/history-bg.svg')] bg-cover bg-center">
//           <div className="aspect-video w-full flex flex-col items-center justify-center rounded-xl bg-[url('/assets/images/decoration/history-bg.svg')] bg-cover bg-center">
//             <p className="text-xl undeline font-bold">Mistake Bank</p>
//             <p className="">{/* variant: <strong>5343</strong> */}</p>
//             <p className="text-lg font-bold mt-20">result: 12/15</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestHistory;
