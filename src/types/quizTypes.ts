export interface SubjectStructure {
  subject: string;
  question_count: number;
}

// Создание теста
export interface CreateQuizPayload {
  title: string;
  year: string;
  variant: string;
  subjects: SubjectStructure[];
}

export interface CreateQuizResponse {
  _id: string;
  variant: string;
  year: string;
  title: string;
  structure: SubjectStructure[];
}

// Вопросы в тесте
export type QuestionType = "single_choice" | "multiple_choice";

export interface QuestionOption {
  label: string;
  option_text: string;
  is_correct?: boolean;
}

export interface AddQuizQuestionsPayload {
  type: QuestionType;
  subject: string;
  question_text: string;
  options: QuestionOption[];
}

export interface AddQuizQuestionsResponse {
  _id: string;
  quiz_id: string;
  type: QuestionType;
  subject: string;
  question_text: string;
  options: QuestionOption[];
}

// Получение всех тестов
export interface GetAllQuizzesResponse {
  _id: string;
  variant: string;
  year: string;
  title: string;
  structure: SubjectStructure[];
}

// Получение вопросов конкретного теста
export interface GetQuizQuestionsResponse {
  _id: string;
  id: string;
  quiz_id: string;
  type: QuestionType;
  subject: string;
  question_text: string;
  options: QuestionOption[];
}

// Начало попытки прохождения теста
export interface StartQuizAttemptResponse {
  _id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  started_at: string;
  ended_at: string | null;
  is_completed: boolean;
}

// Отправка ответа на вопрос
export interface SubmitAnswerPayload {
  question_id: string;
  option_labels: string[];
}

export interface SubmitAnswerResponse {
  _id: string;
  attempt_id: string;
  question_id: string;
  selected_options: string[];
  score: number;
}

// Завершение попытки теста
export interface FinishQuizAttemptResponse {
  attempt_id: string;
  quiz_id: string;
  total_score: number;
}

export interface AttemptAnswer {
  question_id: string;
  question_text: string;
  options: {
    label: string;
    option_text: string;
    is_correct: boolean;
  }[];
  selected_option: string[];
}

export interface GetQuizAttemptDetailsResponse {
  attempt_id: string;
  quiz_id: string;
  user_id: string;
  quiz_title: string;
  quiz_variant: string;
  quiz_year: string;
  answers: AttemptAnswer[];
}
