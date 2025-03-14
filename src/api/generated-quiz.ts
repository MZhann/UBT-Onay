import { AxiosError } from "axios";
import { backendApiInstance } from "./index";

// interface GenerateQuizPayload {
//   user_prompt: string;
// }

interface QuizResponse {
  _id: string;
  title: string;
  subject: string;
  questions: { id: string }[];
}

export async function generateQuiz(userPrompt: string): Promise<QuizResponse> {
  try {
    const response = await backendApiInstance.post<QuizResponse>("/generated-quiz/", {
      user_prompt: userPrompt,
    });

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
