import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  Quiz,
  Question,
  QuestionType,
  demoQuizzes,
  demoQuestions,
  generateId,
  getDefaultQuestionContent,
} from '@/lib/quiz-types';
import { toast } from 'sonner';

interface QuizBuilderContextType {
  // Data
  quiz: Quiz | null;
  questions: Question[];
  selectedQuestionId: string | null;

  // Selection
  setSelectedQuestionId: (id: string | null) => void;

  // Quiz settings
  updateQuiz: (updates: Partial<Quiz>) => void;

  // Question CRUD
  addQuestion: (type: QuestionType, insertAtIndex?: number) => string;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  duplicateQuestion: (id: string) => void;
  reorderQuestions: (orderedIds: string[]) => void;

  // Helpers
  getQuestionsByQuiz: (quizId: string) => Question[];
  getTotalPoints: () => number;
}

const QuizBuilderContext = createContext<QuizBuilderContextType | undefined>(undefined);

interface QuizBuilderProviderProps {
  children: ReactNode;
  quizId: string;
}

export function QuizBuilderProvider({ children, quizId }: QuizBuilderProviderProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(
    demoQuizzes.find((q) => q.id === quizId) || null
  );
  const [questions, setQuestions] = useState<Question[]>(
    demoQuestions.filter((q) => q.quizId === quizId)
  );
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    questions.length > 0 ? questions[0].id : null
  );

  // Update quiz settings
  const updateQuiz = useCallback((updates: Partial<Quiz>) => {
    setQuiz((prev) => (prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null));
  }, []);

  // Add a new question
  const addQuestion = useCallback(
    (type: QuestionType, insertAtIndex?: number) => {
      const questionLabels: Record<QuestionType, string> = {
        'multiple-choice': 'Multiple Choice',
        'multiple-select': 'Multiple Select',
        'true-false': 'True/False',
        'short-answer': 'Short Answer',
        'fill-blank': 'Fill in the Blank',
        matching: 'Matching',
      };

      const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);
      const newOrder = insertAtIndex !== undefined ? insertAtIndex + 1 : sortedQuestions.length + 1;

      const newQuestion: Question = {
        id: generateId('q'),
        quizId,
        type,
        text: `New ${questionLabels[type]} Question`,
        points: 1,
        required: true,
        content: getDefaultQuestionContent(type),
        order: newOrder,
      };

      // If inserting at a specific index, update orders of existing questions
      if (insertAtIndex !== undefined && insertAtIndex < sortedQuestions.length) {
        setQuestions((prev) => {
          const updated = prev.map((q) => ({
            ...q,
            order: q.order >= newOrder ? q.order + 1 : q.order,
          }));
          return [...updated, newQuestion];
        });
      } else {
        setQuestions((prev) => [...prev, newQuestion]);
      }

      // Update quiz question count
      setQuiz((prev) =>
        prev ? { ...prev, questionsCount: prev.questionsCount + 1 } : null
      );

      setSelectedQuestionId(newQuestion.id);
      toast.success(`${questionLabels[type]} added`);

      return newQuestion.id;
    },
    [questions, quizId]
  );

  // Update a question
  const updateQuestion = useCallback((id: string, updates: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  }, []);

  // Delete a question
  const deleteQuestion = useCallback(
    (id: string) => {
      setQuestions((prev) => prev.filter((q) => q.id !== id));

      // Update quiz question count
      setQuiz((prev) =>
        prev ? { ...prev, questionsCount: Math.max(0, prev.questionsCount - 1) } : null
      );

      // Select another question if the deleted one was selected
      if (selectedQuestionId === id) {
        const remaining = questions.filter((q) => q.id !== id);
        setSelectedQuestionId(remaining.length > 0 ? remaining[0].id : null);
      }

      toast.success('Question deleted');
    },
    [questions, selectedQuestionId]
  );

  // Duplicate a question
  const duplicateQuestion = useCallback(
    (id: string) => {
      const question = questions.find((q) => q.id === id);
      if (!question) return;

      const newQuestion: Question = {
        ...question,
        id: generateId('q'),
        text: `${question.text} (Copy)`,
        order: questions.length + 1,
      };

      setQuestions((prev) => [...prev, newQuestion]);

      // Update quiz question count
      setQuiz((prev) =>
        prev ? { ...prev, questionsCount: prev.questionsCount + 1 } : null
      );

      setSelectedQuestionId(newQuestion.id);
      toast.success('Question duplicated');
    },
    [questions]
  );

  // Reorder questions
  const reorderQuestions = useCallback((orderedIds: string[]) => {
    setQuestions((prev) => {
      const reordered = orderedIds
        .map((id, index) => {
          const question = prev.find((q) => q.id === id);
          return question ? { ...question, order: index + 1 } : null;
        })
        .filter(Boolean) as Question[];
      return reordered;
    });
  }, []);

  // Get questions by quiz
  const getQuestionsByQuiz = useCallback(
    (qId: string) => {
      return questions
        .filter((q) => q.quizId === qId)
        .sort((a, b) => a.order - b.order);
    },
    [questions]
  );

  // Get total points
  const getTotalPoints = useCallback(() => {
    return questions.reduce((sum, q) => sum + q.points, 0);
  }, [questions]);

  return (
    <QuizBuilderContext.Provider
      value={{
        quiz,
        questions,
        selectedQuestionId,
        setSelectedQuestionId,
        updateQuiz,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        duplicateQuestion,
        reorderQuestions,
        getQuestionsByQuiz,
        getTotalPoints,
      }}
    >
      {children}
    </QuizBuilderContext.Provider>
  );
}

export function useQuizBuilder() {
  const context = useContext(QuizBuilderContext);
  if (!context) {
    throw new Error('useQuizBuilder must be used within QuizBuilderProvider');
  }
  return context;
}
