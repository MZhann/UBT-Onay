"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const GenerateTestBlock = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl flex flex-col items-center p-6 md:min-h-min bg-[url('/assets/images/decoration/generate-bg.svg')] bg-cover bg-centerfull">
      <h2 className="text-2xl uppercase text-white">Generate Test</h2>
      <div className="mt-4 w-full flex justify-between gap-6 text-white">
        <div className="w-1/2 ml-10">
          <p className="text-xl">Your Prompt</p>
          <Textarea placeholder="Generate me test for topic History of Kazakh nation from 15th century till 17th century" className="bg-white/10 backdrop-blur-sm min-h-40 mt-2" />
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="true-false"
                checked={selectedOptions.includes("true-false")}
                onCheckedChange={() => toggleOption("true-false")}
              />
              <Label htmlFor="true-false">True or False</Label>
            </div>
          </div>

          <div className="flex gap-1 h-4">
            {selectedOptions.map((item) => (
                <p key={`${item}-${Date.now()}`}>{item}, </p>
            ))}
          </div>
        </div>
      </div>
      <Button variant={'indigo'} size='none' className="mt-10 py-3 w-full max-w-xl rounded-3xl">Start Generation</Button>
    </div>
  );
};

export default GenerateTestBlock;
