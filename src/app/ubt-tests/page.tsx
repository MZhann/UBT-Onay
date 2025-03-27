"use client";

import { useState, useEffect } from "react";
import { getAllQuizzes } from "@/api/quiz";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Quiz {
  _id: string;
  variant: string;
  year: string;
  title: string;
  structure: { subject: string; question_count: number }[];
}

// Define fixed years from 2015 to 2025
const years = Array.from({ length: 11 }, (_, i) => (2015 + i).toString());

// Define grouped subjects for filtering
const subjectGroups = [
  { label: "Physics/Math", subjects: ["Физика", "Математика"] },
  { label: "Chemistry/Biology", subjects: ["Химия", "Биология"] },
  { label: "Geography/Math", subjects: ["География", "Математика"] },
  { label: "English/History", subjects: ["Английскии", "История Казахстана"] },
  { label: "Mathematics/Information", subjects: ["Математика", "Информатика"] },
];

const UNTTestsPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [yearIndex, setYearIndex] = useState(0);
  const [subjectIndex, setSubjectIndex] = useState(0);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getAllQuizzes();
        setQuizzes(data);
        setFilteredQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  // Toggle year filter
  const handleYearClick = (year: string) => {
    setSelectedYear((prev) => (prev === year ? null : year));
  };

  // Toggle subject filter
  const handleSubjectClick = (subjects: string[]) => {
    setSelectedSubjects((prev) => {
      const isSelected =
        prev.length === subjects.length &&
        prev.every((s) => subjects.includes(s));
      return isSelected ? [] : subjects;
    });
  };

  // Filter quizzes based on selected year and subjects
  useEffect(() => {
    let filtered = quizzes;

    if (selectedYear) {
      filtered = filtered.filter((quiz) => quiz.year === selectedYear);
    }

    if (selectedSubjects.length > 0) {
      filtered = filtered.filter((quiz) =>
        selectedSubjects.every((subj) =>
          quiz.structure.some((s) => s.subject === subj)
        )
      );
    }

    setFilteredQuizzes(filtered);
  }, [selectedYear, selectedSubjects, quizzes]);

  return (
    <div className="flex flex-col w-full items-center px-20 pt-10 pb-10">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-6 px-14">UNT Tests</h1>
      </div>
      {/* Year Filter (Scrollable) */}
      <div className="w-full">
        <h1 className="text-xl mb-3 px-14 text-[#606060]">year</h1>
      </div>
      <div className="flex justify-between items-center space-x-3 mb-4 w-full overflow-hidden text-[#4E4E4E] text-xl font-bold">
        <Button
          variant="outline"
          onClick={() => setYearIndex(Math.max(yearIndex - 1, 0))}
        >
          {"<"}
        </Button>

        {/* Container for year buttons with full width */}
        <div className="flex flex-1 space-x-3">
          {years.slice(yearIndex, yearIndex + 4).map((year) => (
            <button
              key={year}
              className={`px-6 py-2 rounded-lg flex-1 bg-[url('/assets/images/decoration/year-bg.svg')]  bg-cover bg-centerfull ${
                selectedYear === year
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleYearClick(year)}
            >
              {year}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() =>
            setYearIndex(Math.min(yearIndex + 1, years.length - 4))
          }
        >
          {">"}
        </Button>
      </div>

      {/* Subject Filter (Scrollable) */}
      <div className="w-full">
        <h1 className="text-xl mb-3 px-14 text-[#606060]">subjects</h1>
      </div>
      <div className="flex items-center space-x-3 mb-6 w-full overflow-hidden ">
        <Button
          variant="outline"
          onClick={() => setSubjectIndex(Math.max(subjectIndex - 1, 0))}
        >
          {"<"}
        </Button>

        {/* Container for subject buttons with full width */}
        <div className="flex flex-1 space-x-3 text-white font-bold ">
          {subjectGroups.slice(subjectIndex, subjectIndex + 3).map((group) => (
            <button
              key={group.label}
              className={`px-4 py-3 rounded-lg flex-1 bg-[url('/assets/images/decoration/subjects-bg.svg')]  bg-cover bg-centerfull ${
                selectedSubjects.length > 0 &&
                selectedSubjects.every((s) => group.subjects.includes(s))
                  ? "bg-indigo-600 text-indigo-200"
                  : "bg-gray-300"
              }`}
              onClick={() => handleSubjectClick(group.subjects)}
            >
              {group.label}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() =>
            setSubjectIndex(
              Math.min(subjectIndex + 1, subjectGroups.length - 3)
            )
          }
        >
          {">"}
        </Button>
      </div>

      {/* Quizzes Grid */}
      <div className="w-full">
        <h1 className="text-xl mb-3 px-14 text-[#606060]  mt-10">variants</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full px-[3.2rem]">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="p-4 text-white min-h-32 font-bold rounded-lg shadow-md text-center bg-[url('/assets/images/decoration/variant-bg.svg')] bg-cover bg-center flex-1"
            >
              <h3 className="text-lg font-semibold">{quiz.title}</h3>
              <p className="text-sm">Variant: {quiz.variant}</p>
              <p className="text-sm">Year: {quiz.year}</p>
              <Link href={`/test?id=${quiz._id}`} className="w-full rounded-lg flex items-center justify-center bg-indigo-700 px-10">
                Start
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-3 text-center">
            No quizzes found
          </p>
        )}
      </div>
    </div>
  );
};

export default UNTTestsPage;
