"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { createQuiz } from "@/api/quiz";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import QuestionCreation from "@/components/page-components/admin/questions-creation";
import { Loader2 } from "lucide-react";

const subjectsList = [
  "Физика",
  "Математика",
  "Химия",
  "Биология",
  "География",
  "ДЖТ",
  "Каз Лит",
  "Рус Лит",
  "Английскии",
];

const defaultQuestionCounts: Record<string, number> = {
  Английскии: 45,
  География: 45,
  Химия: 45,
  Физика: 45,
  Математика: 45,
  Биология: 45,
  Информатика: 45,
};

const Admin = () => {
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [variant, setVariant] = useState("");
  const [isQuizCreating, setIsQuizCreating] = useState(false);
  // const [selectedSubjects, setSelectedSubjects] = useState<
  //   { subject: string; question_count: number }[]
  // >([]);
  const [selectedSubjects, setSelectedSubjects] = useState<
    { subject: string; question_count: number }[]
  >([
    { subject: "Грамотность Чтения", question_count: 20 },
    { subject: "Мат Грамотность", question_count: 20 },
    { subject: "История Казахстана", question_count: 20 },
  ]);

  const [quizId, setQuizId] = useState<string | null>(null);

  // Загрузка данных из localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("quizDraft");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setTitle(parsedData.title || "");
      setYear(parsedData.year || "");
      setVariant(parsedData.variant || "");
      setSelectedSubjects(parsedData.selectedSubjects || []);
      setQuizId(parsedData.quizId || null);
    }
  }, []);

  // Сохранение данных в localStorage
  useEffect(() => {
    localStorage.setItem(
      "quizDraft",
      JSON.stringify({ title, year, variant, selectedSubjects, quizId })
    );
  }, [title, year, variant, selectedSubjects, quizId]);

  // Обработчик выбора предметов
  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) => {
      const exists = prev.find((s) => s.subject === subject);
      if (exists) {
        return prev.filter((s) => s.subject !== subject);
      } else {
        return [
          ...prev,
          { subject, question_count: defaultQuestionCounts[subject] || 20 },
        ];
      }
    });
  };

  // Обновление количества вопросов
  const updateQuestionCount = (subject: string, count: number) => {
    setSelectedSubjects((prev) =>
      prev.map((s) =>
        s.subject === subject ? { ...s, question_count: count } : s
      )
    );
  };

  // Создание квиза
  const handleCreateQuiz = async () => {
    setIsQuizCreating(true);
    if (!title || !year || !variant || selectedSubjects.length === 0) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Заполните все поля и выберите хотя бы один предмет.",
      });
      return;
    }

    try {
      const response = await createQuiz({
        title,
        year,
        variant,
        subjects: selectedSubjects,
      });

      setQuizId(response._id);
      toast({ title: "Квиз создан!", description: "Теперь добавьте вопросы." });
      setIsQuizCreating(false);
    } catch (error) {
      setIsQuizCreating(false);

      console.log(error);
      toast({
        variant: "destructive",
        title: "Ошибка при создании квиза",
        description: "Попробуйте снова.",
      });
    }
  };

  return (
    <div className="flex flex-col w-full items-center px-20 pt-10">
      {!quizId ? (
        <div className="flex flex-col w-full p-6 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold mb-4">Test Creation</h1>

          {/* Поля ввода */}
          <div className="flex gap-3">
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                className="border-2 border-myindigo"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="enter title"
              />
            </div>
            <div>
              <Label>Year</Label>
              <Input
                className="border-2 border-myindigo"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Enter year"
              />
            </div>
            <div>
              <Label>Variant</Label>
              <Input
                className="border-2 border-myindigo"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                placeholder="Enter variant"
              />
            </div>
          </div>

          {/* Выбор предметов */}
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Choose subjects</h2>
            <div className="grid grid-cols-2 gap-3">
              {subjectsList.map((subject) => {
                const isChecked = selectedSubjects.some(
                  (s) => s.subject === subject
                );
                const questionCount =
                  selectedSubjects.find((s) => s.subject === subject)
                    ?.question_count || 20;

                return (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      checked={isChecked}
                      className="border-2 border-myindigo"
                      onCheckedChange={() => toggleSubject(subject)}
                    />
                    <Label>{subject}</Label>
                    {isChecked && (
                      <Input
                        type="number"
                        min={1}
                        value={questionCount}
                        onChange={(e) =>
                          updateQuestionCount(subject, Number(e.target.value))
                        }
                        className="w-16 text-center"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Кнопка создания */}
          <Button
            className="mt-6 w-full"
            variant={"indigo"}
            onClick={handleCreateQuiz}
            disabled={isQuizCreating}
          >
            {isQuizCreating ? (
              <Loader2 className="animate-spin size-8 " />
            ) : (
              "Create Quiz"
            )}
          </Button>
        </div>
      ) : (
        <div className="w-full ">
          <h1 className="text-2xl font-bold mb-6">Questions creation</h1>
          {selectedSubjects.map((subject) => (
            <QuestionCreation
              key={subject.subject}
              quizId={quizId}
              subject={subject.subject}
              questionCount={subject.question_count}
            />
          ))}
        </div>
      )}

      <Link
        href="/ubt-tests"
        className="mt-4 mb-10 bg-myindigo px-10 py-4 rounded-2xl text-white font-bold"
      >
        Complete
      </Link>
    </div>
  );
};

export default Admin;

// "use client";

// import { useState, useEffect } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { createQuiz } from "@/api/quiz";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";

// const subjectsList = [
//   "Мат Грамотность",
//   "История Казахстана",
//   "Грамотность Чтения",
//   "Физика",
//   "Математика",
//   "Химия",
//   "Биология",
//   "География",
//   "ДЖТ",
//   "Каз Лит",
//   "Рус Лит",
//   "Английскии",
// ];

// const defaultQuestionCounts: Record<string, number> = {
//   "Английскии": 45,
//   "География": 45,
//   "Химия": 45,
//   "Физика": 45,
//   "Математика": 45,
//   "Биология": 45,
//   "Информатика": 45,
// };

// const Admin = () => {
//   const { toast } = useToast();

//   // Состояние формы
//   const [title, setTitle] = useState("");
//   const [year, setYear] = useState("");
//   const [variant, setVariant] = useState("");
//   const [selectedSubjects, setSelectedSubjects] = useState<{ subject: string; question_count: number }[]>([]);
//   const [quizId, setQuizId] = useState<string | null>(null);

//   // Загрузка данных из localStorage (чтобы не сбрасывался процесс)
//   useEffect(() => {
//     const savedData = localStorage.getItem("quizDraft");
//     if (savedData) {
//       const parsedData = JSON.parse(savedData);
//       setTitle(parsedData.title || "");
//       setYear(parsedData.year || "");
//       setVariant(parsedData.variant || "");
//       setSelectedSubjects(parsedData.selectedSubjects || []);
//       setQuizId(parsedData.quizId || null);
//     }
//   }, []);

//   // Сохранение данных в localStorage
//   useEffect(() => {
//     localStorage.setItem(
//       "quizDraft",
//       JSON.stringify({ title, year, variant, selectedSubjects, quizId })
//     );
//   }, [title, year, variant, selectedSubjects, quizId]);

//   // Обработчик выбора предметов
//   const toggleSubject = (subject: string) => {
//     setSelectedSubjects((prev) => {
//       const exists = prev.find((s) => s.subject === subject);
//       if (exists) {
//         return prev.filter((s) => s.subject !== subject);
//       } else {
//         return [...prev, { subject, question_count: defaultQuestionCounts[subject] || 20 }];
//       }
//     });
//   };

//   // Обновление количества вопросов
//   const updateQuestionCount = (subject: string, count: number) => {
//     setSelectedSubjects((prev) =>
//       prev.map((s) => (s.subject === subject ? { ...s, question_count: count } : s))
//     );
//   };

//   // Отправка формы на сервер
//   const handleCreateQuiz = async () => {
//     if (!title || !year || !variant || selectedSubjects.length === 0) {
//       toast({
//         variant: "destructive",
//         title: "Ошибка",
//         description: "Заполните все поля и выберите хотя бы один предмет.",
//       });
//       return;
//     }

//     try {
//       const response = await createQuiz({
//         title,
//         year,
//         variant,
//         subjects: selectedSubjects,
//       });

//       setQuizId(response._id);
//       toast({ title: "Квиз создан!", description: "Вы можете добавить вопросы." });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Ошибка при создании квиза",
//         description: "Попробуйте снова.",
//       });
//     }
//   };

//   return (
//     <div className="flex flex-col w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h1 className="text-2xl font-semibold mb-4">Создание Квиза</h1>

//       {/* Поля ввода */}
//       <div className="gap-4 flex">
//         <div>
//           <Label>Название</Label>
//           <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Введите название квиза" />
//         </div>
//         <div>
//           <Label>Год</Label>
//           <Input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Введите год" />
//         </div>
//         <div>
//           <Label>Вариант</Label>
//           <Input value={variant} onChange={(e) => setVariant(e.target.value)} placeholder="Введите вариант" />
//         </div>
//       </div>

//       {/* Выбор предметов */}
//       <div className="mt-6">
//         <h2 className="text-lg font-medium mb-2">Выберите предметы</h2>
//         <div className="grid grid-cols-2 gap-3">
//           {subjectsList.map((subject) => {
//             const isChecked = selectedSubjects.some((s) => s.subject === subject);
//             const questionCount = selectedSubjects.find((s) => s.subject === subject)?.question_count || 20;

//             return (
//               <div key={subject} className="flex items-center space-x-2">
//                 <Checkbox checked={isChecked} onCheckedChange={() => toggleSubject(subject)} />
//                 <Label>{subject}</Label>
//                 {isChecked && (
//                   <Input
//                     type="number"
//                     min={1}
//                     value={questionCount}
//                     onChange={(e) => updateQuestionCount(subject, Number(e.target.value))}
//                     className="w-16 text-center"
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Кнопка создания */}
//       <Button className="mt-6 w-full" onClick={handleCreateQuiz}>
//         Создать квиз
//       </Button>
//     </div>
//   );
// };

// export default Admin;
