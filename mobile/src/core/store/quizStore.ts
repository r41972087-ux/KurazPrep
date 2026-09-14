import { create } from 'zustand';

export interface Question {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

interface QuizState {
  subjectId: string | null;
  questions: Question[];
  currentIndex: number;
  selectedOptionId: string | null;
  isAnswerSubmitted: boolean;
  score: number;
  answers: { questionId: string; selectedOptionId: string; isCorrect: boolean }[];
  
  // Actions
  initializeQuiz: (subjectId: string, questions: Question[]) => void;
  selectOption: (optionId: string) => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  subjectId: null,
  questions: [],
  currentIndex: 0,
  selectedOptionId: null,
  isAnswerSubmitted: false,
  score: 0,
  answers: [],

  initializeQuiz: (subjectId, questions) => set({
    subjectId,
    questions,
    currentIndex: 0,
    selectedOptionId: null,
    isAnswerSubmitted: false,
    score: 0,
    answers: []
  }),

  selectOption: (optionId) => {
    if (!get().isAnswerSubmitted) {
      set({ selectedOptionId: optionId });
    }
  },

  submitAnswer: () => {
    const state = get();
    if (state.selectedOptionId && !state.isAnswerSubmitted) {
      const currentQ = state.questions[state.currentIndex];
      const isCorrect = currentQ.correctOptionId === state.selectedOptionId;
      
      set({
        isAnswerSubmitted: true,
        score: isCorrect ? state.score + 1 : state.score,
        answers: [...state.answers, {
          questionId: currentQ.id,
          selectedOptionId: state.selectedOptionId,
          isCorrect
        }]
      });
    }
  },

  nextQuestion: () => {
    const state = get();
    if (state.currentIndex < state.questions.length - 1) {
      set({
        currentIndex: state.currentIndex + 1,
        selectedOptionId: null,
        isAnswerSubmitted: false
      });
    }
  },

  resetQuiz: () => set({
    subjectId: null,
    questions: [],
    currentIndex: 0,
    selectedOptionId: null,
    isAnswerSubmitted: false,
    score: 0,
    answers: []
  })
}));
