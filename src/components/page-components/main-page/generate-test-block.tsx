"use client";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { generateQuiz } from "@/api/generated-quiz";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const GenerateTestBlock = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quizInfo, setQuizInfo] = useState<{
    id: string;
    title: string;
    subject: string;
    numberOfQuestions: number;
  } | null>(null);

  useEffect(() => {
    // Load existing quiz data from localStorage on mount
    const storedQuiz = localStorage.getItem("generatedQuiz");
    if (storedQuiz) {
      setQuizInfo(JSON.parse(storedQuiz));
    }
  }, []);

  const startGeneratedQuiz = (quizId: string) => {
   router.push(`/generated-quiz/${quizId}`);
  };

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleGenerateQuiz = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const quizData = await generateQuiz(prompt);
      const quizDetails = {
        id: quizData._id,
        title: quizData.title,
        subject: quizData.subject,
        numberOfQuestions: quizData.questions.length,
      };

      localStorage.setItem("generatedQuiz", JSON.stringify(quizDetails));
      setQuizInfo(quizDetails);
      toast({
        title: "Success",
        description: "You can view your quiz details below",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Some Error appeared, please log in and try again",
        variant: "destructive",
      });
      console.error("Failed to generate quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl flex flex-col items-center p-6 md:min-h-min bg-[url('/assets/images/decoration/generate-bg.svg')] bg-cover bg-centerfull">
      <h2 className="text-2xl uppercase text-white">Generate Test</h2>
      <div className="mt-4 w-full flex justify-between gap-6 text-white">
        <div className="w-1/2 ml-10">
          <p className="text-xl">Your Prompt</p>
          <Textarea
            placeholder="Generate me test for topic History of Kazakh nation from 15th century till 17th century"
            className="bg-white/10 backdrop-blur-sm min-h-40 mt-2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div className="w-1/3">
          <p className="text-xl">Settings</p>
          <div className="min-h-40 flex flex-col justify-center gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="multiple-answer"
                checked={selectedOptions.includes("multiple-answer")}
                onCheckedChange={() => toggleOption("multiple-answer")}
              />
              <Label htmlFor="multiple-answer">Multiple Answer Questions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="single-question"
                checked={selectedOptions.includes("single-question")}
                onCheckedChange={() => toggleOption("single-question")}
              />
              <Label htmlFor="single-question">Single Question</Label>
            </div>
            {/* <div className="flex items-center space-x-2">
              <Checkbox
                id="true-false"
                checked={selectedOptions.includes("true-false")}
                onCheckedChange={() => toggleOption("true-false")}
              />
              <Label htmlFor="true-false">True or False</Label>
            </div> */}
          </div>

          <div className="flex gap-1 h-4">
            {selectedOptions.map((item) => (
              <p key={item}>{item}, </p>
            ))}
          </div>
        </div>
      </div>
      <Button
        variant={"indigo"}
        size="none"
        className="mt-10 py-3 w-full max-w-xl rounded-3xl flex items-center justify-center"
        disabled={!prompt.trim() || isLoading}
        onClick={handleGenerateQuiz}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : "Start Generation"}
      </Button>
      {isLoading && (
        <p className="text-white mt-4">
          it will take less that a minute, please wait :)
        </p>
      )}

      {quizInfo && (
        <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg w-full max-w-2xl border-myindigo border-4 text-white">
          <div className="flex items-start w-full justify-between">
            <div>
              <h3 className="text-xl font-semibold">{quizInfo.title}</h3>
              <p className="text-sm text-gray-300">
                Subject: {quizInfo.subject}
              </p>
              <p className="text-sm text-gray-300">
                Questions: {quizInfo.numberOfQuestions}
              </p>
            </div>
            <div className="bg-emerald-600/60 p-2 rounded-full">Successfully generated</div>
          </div>

          <Button
            onClick={() => startGeneratedQuiz(quizInfo.id)}
            variant={"indigo"}
            size="none"
            className="mt-4 py-3 w-full rounded-3xl flex items-center justify-center"
          >
            Start
          </Button>
        </div>
      )}
    </div>
  );
};

export default GenerateTestBlock;
