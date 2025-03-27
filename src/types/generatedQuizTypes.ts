
export interface QuizResponse {
  _id: string;
  title: string;
  subject: string;
  questions: { id: string }[];
}

export interface QuizOption {
  label: string;
  text: string;
  is_correct: boolean;
}

export interface QuizAnswer {
  question_id: string;
  selected_options: string[];
  score: number;
  question_text: string;
  options: QuizOption[];
}

export interface QuizAttempt {
  _id: string;
  id: string;
  user_id: string;
  quiz_id: string;
  quiz_title: string;
  quiz_subject: string;
  answers: QuizAnswer[];
  score: number;
  started_at: string;
  finished_at: string | null;
}


export interface GeneratedQuizQuestionOption {
  label: string;
  option_text: string;
  is_correct: boolean;
}

export interface GeneratedQuizQuestion {
  id: string;
  type: 'single_choice' | 'multiple_choice';
  question_text: string;
  options: GeneratedQuizQuestionOption[];
}

export interface GeneratedQuiz {
  _id: string;
  user_id: string;
  title: string;
  subject: string;
  questions: GeneratedQuizQuestion[];
}