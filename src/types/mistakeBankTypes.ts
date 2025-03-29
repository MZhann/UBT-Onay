export interface MistakeQuestion {
  question_id: string;
  question_text: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  label: string;
  option_text: string;
  is_correct: boolean;
}

export interface QuestionOption {
  label: string;
  option_text: string;
  is_correct: boolean;
}

export interface MistakeQuestion {
  question_id: string;
  question_text: string;
  options: QuestionOption[];
}

export interface StartMistakeSessionResponse {
  session_id: string;
  questions: MistakeQuestion[];
}

export interface AnswerMistakeQuestionPayload {
  question_id: string;
  selected_options: string[]; // например: ["A", "C"]
}

export interface AnswerMistakeQuestionResponse {
  message: string;
  correct: boolean;
}

export interface CompletedMistakeResult {
  question_id: string;
  question_text: string;
  options: QuestionOption[];
  selected_options: string[];
  is_correct: boolean;
}

export interface CompleteMistakeSessionResponse {
  message: string;
  session_results: CompletedMistakeResult[];
}

export interface GetMistakeSessionResultsResponse {
  session_id: string;
  mistakes: CompletedMistakeResult[];
}

export interface MistakeQuizSession {
  _id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  mistakes: [];
  status: string;
}
