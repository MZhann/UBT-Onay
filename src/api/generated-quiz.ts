import { AxiosError } from "axios";
import { backendApiInstance } from "./index";
import { QuizAttempt, QuizResponse } from "@/types/generatedQuizTypes";
import { GeneratedQuiz } from "@/types/generatedQuizTypes";
// interface GenerateQuizPayload {
//   user_prompt: string;
// }

export async function generateQuiz(userPrompt: string): Promise<QuizResponse> {
  try {
    const response = await backendApiInstance.post<QuizResponse>(
      "/generated-quiz/",
      {
        user_prompt: userPrompt,
      }
    );

    const quizData = response.data;

    // Сохраняем данные в localStorage
    localStorage.setItem(
      "generatedQuiz",
      JSON.stringify({
        id: quizData._id,
        title: quizData.title,
        subject: quizData.subject,
        numberOfQuestions: quizData.questions.length,
      })
    );

    return quizData;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to generate quiz");
  }
}

//get quiz attempts
export async function getMyQuizAttempts(): Promise<QuizAttempt[]> {
  try {
    const response = await backendApiInstance.get<QuizAttempt[]>(
      "/generated-quiz/attempts/me"
    );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to fetch quiz attempts");
  }
}

// Получение всех сгенерированных тестов текущего пользователя
export async function fetchMyGeneratedQuizzes(): Promise<GeneratedQuiz[]> {
  try {
    const response = await backendApiInstance.get<GeneratedQuiz | GeneratedQuiz[]>(
      "/generated-quiz/me"
    );

    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === "object") {
      return [data]; // ✅ оборачиваем одиночный объект в массив
    }

    return [];
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to fetch generated quizzes");
  }
}


// export async function fetchMyGeneratedQuizzes(): Promise<GeneratedQuiz[]> {
//   try {
//     const response = await backendApiInstance.get<GeneratedQuiz[]>(
//       "/generated-quiz/me"
//     );
//     return response.data;
//   } catch (error) {
//     if ((error as AxiosError).isAxiosError) {
//       throw error;
//     }
//     throw new Error("Failed to fetch generated quizzes");
//   }
// }
