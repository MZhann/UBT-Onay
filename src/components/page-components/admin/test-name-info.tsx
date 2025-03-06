"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

const TestNameInfo = () => {
  const [title, setTitle] = useState("");
  const [subjects, setSubjects] = useState("");
  const [year, setYear] = useState<number>();
  const [variant, setVariant] = useState<number>();

  return (
    <>
      <div className="w-full flex flex-start items-center">
        <h1 className="text-2xl font-bold">Creation of a Test</h1>
      </div>
      <div className="w-full flex justify-between gap-2 mt-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-2 border-myindigo"
          placeholder="test title"
        />
        <Input
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          className="border-2 border-myindigo"
          placeholder="subjects"
        />
        <Input
          value={year}
          type="number"
          onChange={(e) => setYear(Number(e.target.value))}
          className="border-2 border-myindigo"
          placeholder="year"
        />
        <Input
          value={variant}
          type="number"
          onChange={(e) => setVariant(Number(e.target.value))}
          className="border-2 border-myindigo"
          placeholder="variant"
        />
      </div>
    </>
  );
};

export default TestNameInfo;
