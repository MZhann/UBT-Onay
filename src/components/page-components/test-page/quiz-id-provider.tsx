"use client";

import { useSearchParams } from "next/navigation";

const QuizIdProvider = () => {
  const searchParams = useSearchParams();
  return searchParams.get("id") || "";
};

export default QuizIdProvider;
