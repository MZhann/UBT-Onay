import { AxiosError } from "axios";
import { backendApiInstance } from "./index";
import {
  CreateQuizPayload,
  CreateQuizResponse,
  AddQuizQuestionsPayload,
  AddQuizQuestionsResponse,
  GetAllQuizzesResponse,
  GetQuizQuestionsResponse,
  StartQuizAttemptResponse,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
  FinishQuizAttemptResponse,
  GetQuizAttemptDetailsResponse,
  QuizAttemptShort,
} from "@/types/quizTypes";

// Получение всех тестов
export async function getAllQuizzes(): Promise<GetAllQuizzesResponse[]> {
  try {
    const response = await backendApiInstance.get<GetAllQuizzesResponse[]>(
      "/quiz/"
    );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to fetch quizzes");
  }
}

// Создание теста
export async function createQuiz(
  payload: CreateQuizPayload
): Promise<CreateQuizResponse> {
  try {
    const response = await backendApiInstance.post<CreateQuizResponse>(
      "/quiz/",
      payload
    );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to create quiz");
  }
}

// Добавление вопросов в тест
export async function addQuizQuestions(
  quizId: string,
  payload: AddQuizQuestionsPayload[]
): Promise<AddQuizQuestionsResponse[]> {
  try {
    const response = await Promise.all(
      payload.map((question) =>
        backendApiInstance.post<AddQuizQuestionsResponse>(
          `/quiz/${quizId}/questions`,
          question
        )
      )
    );
    return response.map((res) => res.data);
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to add quiz questions");
  }
}

// Получение вопросов теста
export async function getQuizQuestions(
  quizId: string,
  subject?: string
): Promise<GetQuizQuestionsResponse[]> {
  try {
    const url = subject
      ? `/quiz/${quizId}/questions?subject=${encodeURIComponent(subject)}`
      : `/quiz/${quizId}/questions`;
    const response = await backendApiInstance.get<GetQuizQuestionsResponse[]>(
      url
    );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to fetch quiz questions");
  }
}

// Начало попытки прохождения теста
export async function startQuizAttempt(
  quizId: string
): Promise<StartQuizAttemptResponse> {
  try {
    const response = await backendApiInstance.post<StartQuizAttemptResponse>(
      `/quiz/${quizId}/start`
    );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to start quiz attempt");
  }
}

// Отправка ответа на вопрос
export async function submitAnswer(
  attemptId: string,
  payload: SubmitAnswerPayload
): Promise<SubmitAnswerResponse> {
  try {
    const response = await backendApiInstance.post<SubmitAnswerResponse>(
      `/quiz/attempts/${attemptId}/answer`,
      payload
    );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to submit answer");
  }
}

// Завершение попытки прохождения теста
export async function finishQuizAttempt(
  attemptId: string
): Promise<FinishQuizAttemptResponse> {
  try {
    const response = await backendApiInstance.post<FinishQuizAttemptResponse>(
      `/quiz/attempts/${attemptId}/finish`
    );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to finish quiz attempt");
  }
}

// Fetch Attempt Details

export async function getQuizAttemptDetails(
  attemptId: string
): Promise<GetQuizAttemptDetailsResponse> {
  try {
    const response =
      await backendApiInstance.get<GetQuizAttemptDetailsResponse>(
        `/quiz/${attemptId}/attempt_details`
      );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to fetch quiz attempt details");
  }
}

export async function getMyQuizAttempts(): Promise<QuizAttemptShort[]> {
  try {
    const response = await backendApiInstance.get<QuizAttemptShort[]>(
      "/quiz/attempts/me"
    );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to fetch quiz attempts");
  }
}
