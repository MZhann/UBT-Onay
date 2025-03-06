"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addQuizQuestions } from "@/api/quiz";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Question {
  id: number;
  question_text: string;
  options: { label: string; option_text: string; is_correct: boolean }[];
}

interface SubjectQuestionsProps {
  quizId: string;
  subject: string;
  questionCount: number;
}

const generateDefaultQuestions = (count: number): Question[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    question_text: `Question ${index + 1}`,
    options: [
      { label: "A", option_text: "variant 1", is_correct: false },
      { label: "B", option_text: "variant 2", is_correct: false },
      { label: "C", option_text: "variant 3", is_correct: false },
      { label: "D", option_text: "variant 4", is_correct: false },
    ],
  }));
};

const SubjectQuestions = ({ quizId, subject, questionCount }: SubjectQuestionsProps) => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>(generateDefaultQuestions(questionCount));
  const [isSaving, setIsSaving] = useState(false);

  // Обновление текста вопроса
  const updateQuestionText = (id: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, question_text: text } : q))
    );
  };

  // Обновление вариантов ответа
  const toggleCorrectAnswer = (questionId: number, label: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.label === label ? { ...opt, is_correct: !opt.is_correct } : opt
              ),
            }
          : q
      )
    );
  };

  // Сохранение вопросов
  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    // Проверка на правильный ответ
    for (const question of questions) {
      if (!question.options.some((opt) => opt.is_correct)) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: `У вопроса "${question.question_text}" нет правильного ответа.`,
        });
        setIsSaving(false);
        return;
      }
    }

    try {
      await addQuizQuestions(quizId, questions.map((q) => ({
        type: "single_choice",
        subject,
        question_text: q.question_text,
        options: q.options,
      })));

      toast({ title: `Вопросы по предмету ${subject} сохранены!` });
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить вопросы. Попробуйте снова.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{subject}</h2>
      <div className="max-h-80 overflow-y-auto border p-2">
        {questions.map((question) => (
          <div key={question.id} className="mb-4 p-2 border-b">
            <Input
              value={question.question_text}
              onChange={(e) => updateQuestionText(question.id, e.target.value)}
              className="mb-2"
            />
            <div className="grid grid-cols-2 gap-2">
              {question.options.map((option) => (
                <div key={option.label} className="flex items-center space-x-2">
                  <Checkbox
                    checked={option.is_correct}
                    onCheckedChange={() => toggleCorrectAnswer(question.id, option.label)}
                  />
                  <Input
                    value={option.option_text}
                    onChange={(e) =>
                      setQuestions((prev) =>
                        prev.map((q) =>
                          q.id === question.id
                            ? {
                                ...q,
                                options: q.options.map((opt) =>
                                  opt.label === option.label ? { ...opt, option_text: e.target.value } : opt
                                ),
                              }
                            : q
                        )
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleSave} className="mt-3 w-full" disabled={isSaving}>
        {isSaving ? "Сохранение..." : "Save"}
      </Button>

    </div>

  );
};

export default SubjectQuestions;
