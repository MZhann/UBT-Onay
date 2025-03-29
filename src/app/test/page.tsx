import { Suspense } from "react";
import UbtTestPage from "@/components/page-components/test-page/ubt-test-page"; 

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UbtTestPage />
    </Suspense>
  );
}


// "use client";

// import { Suspense, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   startQuizAttempt,
//   getQuizQuestions,
//   submitAnswer,
//   getQuizAttemptDetails,
// } from "@/api/quiz";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { GetQuizAttemptDetailsResponse } from "@/types/quizTypes";
// import QuizIdProvider from "@/components/page-components/test-page/quiz-id-provider";

// interface Question {
//   id: string;
//   subject: string;
//   question_text: string;
//   type: "single_choice" | "multiple_choice";
//   options: { label: string; option_text: string }[];
// }

// const TestPage = () => {
//   return (
//     <Suspense fallback={<p>Loading...</p>}>
//       <TestContent />
//     </Suspense>
//   );
// };

// const TestContent = () => {
//   const quizId = QuizIdProvider();
//   const router = useRouter();
//   const { toast } = useToast();

//   const [attemptId, setAttemptId] = useState<string | null>(null);
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [selectedAnswers, setSelectedAnswers] = useState<
//     Record<string, string[]>
//   >({});
//   const [answeredCount, setAnsweredCount] = useState(0);
//   const [isStarted, setIsStarted] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const [isTestCompleting, setIsTestCompleting] = useState(false);
//   const [attemptDetails, setAttemptDetails] =
//     useState<GetQuizAttemptDetailsResponse | null>(null);

//   // Start Quiz Attempt
//   const handleStartTest = async () => {
//     if (!quizId) return;

//     try {
//       const response = await startQuizAttempt(quizId);
//       setAttemptId(response._id);

//       const questionsResponse = await getQuizQuestions(quizId);
//       setQuestions(questionsResponse);
//       setIsStarted(true);
//     } catch (error) {
//       console.log(error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to start quiz.",
//       });
//       router.push("/ubt-tests");
//     }
//   };

//   // Handle Answer Selection
//   const handleAnswerSelect = (
//     questionId: string,
//     optionLabel: string,
//     isMultiple: boolean
//   ) => {
//     setSelectedAnswers((prev) => {
//       const prevAnswers = prev[questionId] || [];

//       let updatedAnswers;
//       if (isMultiple) {
//         updatedAnswers = prevAnswers.includes(optionLabel)
//           ? prevAnswers.filter((label) => label !== optionLabel)
//           : [...prevAnswers, optionLabel];
//       } else {
//         updatedAnswers = [optionLabel]; // Ensure only one answer is selected for single_choice
//       }

//       return { ...prev, [questionId]: updatedAnswers };
//     });

//     setAnsweredCount((prevCount) => {
//       const isPreviouslyAnswered = selectedAnswers[questionId]?.length > 0;
//       return isPreviouslyAnswered ? prevCount : prevCount + 1;
//     });
//   };

//   // Submit Answers in Batch (After Clicking "Complete")
//   const handleCompleteTest = async () => {
//     if (!attemptId) return;

//     try {
//       setIsTestCompleting(true);
//       // Send answers one by one
//       for (const questionId in selectedAnswers) {
//         await submitAnswer(attemptId, {
//           question_id: questionId,
//           option_labels: selectedAnswers[questionId],
//         });
//       }

//       toast({
//         variant: "success",
//         title: "Test Completed",
//         description: "Your answers were submitted!",
//       });

//       // Fetch Attempt Details
//       const details = await getQuizAttemptDetails(attemptId);
//       setAttemptDetails(details);

//       // Show results UI
//       setShowResults(true);
//       setIsTestCompleting(false);
//     } catch (error) {
//       setIsTestCompleting(false);

//       console.log(error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to submit answers.",
//       });
//     }
//   };

//   return (
//     <div className="flex h-screen px-20">
//       {/* Main Content */}
//       <div className="flex-1 p-6">
//         {!isStarted ? (
//           <Button className="w-full h-16 text-lg" onClick={handleStartTest}>
//             Start Test
//           </Button>
//         ) : (
//           <>
//             <h1 className="text-2xl font-bold mb-4">UNT Test, Variant: 2656</h1>
//             <div className="grid grid-cols-3 gap-6">
//               {/* Left Panel (Questions) */}
//               <div className="col-span-2 space-y-6">
//                 {Array.from(new Set(questions.map((q) => q.subject))).map(
//                   (subject) => (
//                     <div key={subject}>
//                       <h2 className="text-lg font-semibold text-indigo-600">
//                         {subject}
//                       </h2>
//                       {questions
//                         .filter((q) => q.subject === subject)
//                         .map((question, index) => (
//                           <div key={question.id} className="mb-4">
//                             <p className="font-semibold">
//                               {index + 1}. {question.question_text}
//                             </p>
//                             <div className="space-y-1">
//                               {question.options.map((option, index) => (
//                                 <label
//                                   key={option.label}
//                                   className="flex items-center space-x-2"
//                                 >
//                                   <Checkbox
//                                     className="border-2 border-myindigo mr-2"
//                                     checked={
//                                       selectedAnswers[question.id]?.includes(
//                                         option.label
//                                       ) || false
//                                     }
//                                     onCheckedChange={() =>
//                                       handleAnswerSelect(
//                                         question.id,
//                                         option.label,
//                                         question.type === "multiple_choice"
//                                       )
//                                     }
//                                   />
//                                   {String.fromCharCode(65 + index)}){" "}
//                                   <span>{option.option_text}</span>
//                                 </label>
//                               ))}
//                             </div>
//                           </div>
//                         ))}
//                     </div>
//                   )
//                 )}
//               </div>

//               {/* Right Panel (Progress & Complete) */}
//               <div className="col-span-1 p-4 border-l">
//                 <p>{`Answered: ${answeredCount}/${questions.length}`}</p>
//                 <Button
//                   className="w-full mt-6"
//                   onClick={handleCompleteTest}
//                   disabled={isTestCompleting}
//                 >
//                   {isTestCompleting ? "Completing..." : "Complete"}
//                 </Button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Completion Modal */}
//       {showResults && attemptDetails && (
//         <Dialog open={showResults} onOpenChange={setShowResults}>
//           <DialogContent>
//             <DialogHeader>Your Results</DialogHeader>
//             <div className="space-y-4">
//               {attemptDetails.answers.map((answer) => {
//                 const correctAnswers = answer.options
//                   .filter((o) => o.is_correct)
//                   .map((o) => o.label);

//                 const userAnswers = answer.selected_option || [];

//                 const isCorrect =
//                   userAnswers.length > 0 &&
//                   userAnswers.every((ans) => correctAnswers.includes(ans)) &&
//                   correctAnswers.length === userAnswers.length;

//                 return (
//                   <div
//                     key={answer.question_id}
//                     className={`p-3 border rounded-md ${
//                       isCorrect
//                         ? "border-green-500 bg-green-100"
//                         : "border-red-500 bg-red-100"
//                     }`}
//                   >
//                     <p className="font-semibold">{answer.question_text}</p>
//                     <p
//                       className={isCorrect ? "text-green-600" : "text-red-600"}
//                     >
//                       <strong>Your Answer:</strong> {userAnswers.join(", ")}
//                     </p>
//                     <p className="text-green-600 font-semibold">
//                       <strong>Correct Answer:</strong>{" "}
//                       {correctAnswers.join(", ")}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//             <DialogFooter>
//               <Button onClick={() => router.push("/ubt-tests")}>Close</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default TestPage;
