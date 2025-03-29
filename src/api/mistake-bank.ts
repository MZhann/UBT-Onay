import { AxiosError } from "axios";
import { backendApiInstance } from "./index";
import {
  MistakeQuestion,
  AnswerMistakeQuestionPayload,
  AnswerMistakeQuestionResponse,
  CompleteMistakeSessionResponse,
  MistakeQuizSession,
  GetMistakeSessionResultsResponse,
  StartMistakeSessionResponse
} from "@/types/mistakeBankTypes";

// MistakeBank get all questions
export async function getMistakeQuestions(): Promise<MistakeQuestion[]> {
  try {
    const response = await backendApiInstance.get<MistakeQuestion[]>(
      "/mistake/get_all_questions_from_mistake/"
    );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to fetch mistaken questions");
  }
}

// StartMistakeQuizSession
export async function startMistakeQuizSession(): Promise<StartMistakeSessionResponse> {
  try {
    const response = await backendApiInstance.get<StartMistakeSessionResponse>(
      "/mistake/start_mistake_quiz_session/"
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError?.response?.status === 400) {
      throw new Error(
        "У вас уже есть активная сессия для выполнения теста по ошибкам."
      );
    }

    if (axiosError.isAxiosError) {
      throw axiosError;
    }

    throw new Error("Не удалось запустить сессию по ошибкам.");
  }
}

// AnserMistakeQuestion
export async function answerMistakeQuestion(
  sessionId: string,
  payload: AnswerMistakeQuestionPayload
): Promise<AnswerMistakeQuestionResponse> {
  try {
    const response =
      await backendApiInstance.post<AnswerMistakeQuestionResponse>(
        `/mistake/answer_mistake_question/?session_id=${sessionId}`,
        payload
      );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Не удалось отправить ответ на вопрос.");
  }
}

// CompleteMistakeQuizSession
export async function completeMistakeQuizSession(
  sessionId: string
): Promise<CompleteMistakeSessionResponse> {
  try {
    const response =
      await backendApiInstance.post<CompleteMistakeSessionResponse>(
        `/mistake/complete_mistake_quiz_session/?session_id=${sessionId}`
      );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Не удалось завершить сессию ошибок.");
  }
}

// GetMistakeQuizSessionResults
export async function getMistakeQuizSessionResults(
  sessionId: string
): Promise<GetMistakeSessionResultsResponse> {
  try {
    const response =
      await backendApiInstance.get<GetMistakeSessionResultsResponse>(
        `/mistake/mistake_quiz_session_results/${sessionId}`
      );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Не удалось получить результаты сессии.");
  }
}

export async function getAllMistakeQuizSessions(): Promise<
  MistakeQuizSession[]
> {
  try {
    const response = await backendApiInstance.get<MistakeQuizSession[]>(
      "/mistake/all_mistake_quiz_sessions/"
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка получения списка сессий:", error);
    throw new Error("Не удалось загрузить список сессий");
  }
}
