// Assessment Builder Types

export type QuestionType =
  | 'multiple-choice'
  | 'multiple-select'
  | 'true-false'
  | 'short-answer'
  | 'fill-blank'
  | 'matching'
  | 'essay'
  | 'file-upload'
  | 'long-answer';

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  duration: number;
  passMark: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  allowRetakes: boolean;
  maxAttempts: number;
  status: 'draft' | 'published' | 'archived';
  questionsCount: number;
  attempts: number;
  avgScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  assessmentId: string;
  type: QuestionType;
  text: string;
  points: number;
  required: boolean;
  explanation?: string;
  content: QuestionContent;
  order: number;
}

export type QuestionContent =
  | MultipleChoiceContent
  | MultipleSelectContent
  | TrueFalseContent
  | ShortAnswerContent
  | FillBlankContent
  | MatchingContent
  | EssayContent
  | FileUploadContent
  | LongAnswerContent;

export interface MultipleChoiceContent {
  type: 'multiple-choice';
  options: { id: string; text: string; isCorrect: boolean }[];
}

export interface MultipleSelectContent {
  type: 'multiple-select';
  options: { id: string; text: string; isCorrect: boolean }[];
}

export interface TrueFalseContent {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface ShortAnswerContent {
  type: 'short-answer';
  acceptedAnswers: string[];
  caseSensitive: boolean;
}

export interface FillBlankContent {
  type: 'fill-blank';
  textWithBlanks: string;
  blanks: { id: string; acceptedAnswers: string[] }[];
}

export interface MatchingContent {
  type: 'matching';
  pairs: { id: string; left: string; right: string }[];
}

export interface EssayContent {
  type: 'essay';
  minWords?: number;
  maxWords?: number;
  rubric?: string;
}

export interface FileUploadContent {
  type: 'file-upload';
  allowedTypes: ('image' | 'video' | 'audio' | 'document' | 'presentation')[];
  maxFileSize: number; // in MB
  maxFiles: number;
  instructions?: string;
}

export interface LongAnswerContent {
  type: 'long-answer';
  minWords?: number;
  maxWords?: number;
  placeholder?: string;
}

// Question type metadata for the library - split into categories
export const questionTypes: {
  type: QuestionType;
  label: string;
  icon: string;
  description: string;
  category: 'auto-graded' | 'submission';
}[] = [
  // Auto-graded questions
  {
    type: 'multiple-choice',
    label: 'Multiple Choice',
    icon: 'CircleDot',
    description: 'Single correct answer',
    category: 'auto-graded',
  },
  {
    type: 'multiple-select',
    label: 'Multiple Select',
    icon: 'CheckSquare',
    description: 'Multiple correct answers',
    category: 'auto-graded',
  },
  {
    type: 'true-false',
    label: 'True/False',
    icon: 'ToggleLeft',
    description: 'Boolean question',
    category: 'auto-graded',
  },
  {
    type: 'short-answer',
    label: 'Short Answer',
    icon: 'Type',
    description: 'Text input response',
    category: 'auto-graded',
  },
  {
    type: 'fill-blank',
    label: 'Fill in the Blank',
    icon: 'TextCursorInput',
    description: 'Complete the sentence',
    category: 'auto-graded',
  },
  {
    type: 'matching',
    label: 'Matching',
    icon: 'ArrowRightLeft',
    description: 'Match pairs of items',
    category: 'auto-graded',
  },
  // Submission-based questions
  {
    type: 'essay',
    label: 'Essay',
    icon: 'FileText',
    description: 'Long-form written response',
    category: 'submission',
  },
  {
    type: 'long-answer',
    label: 'Long Answer',
    icon: 'AlignLeft',
    description: 'Extended text response',
    category: 'submission',
  },
  {
    type: 'file-upload',
    label: 'File Upload',
    icon: 'Upload',
    description: 'Upload files (essays, presentations, videos)',
    category: 'submission',
  },
];

// Demo assessments with full data
export const demoAssessments: Assessment[] = [
  {
    id: 'assessment-1',
    title: 'Quadratic Equations - Chapter Test',
    description: 'Test your understanding of quadratic equations and their solutions.',
    courseId: 'course-1',
    duration: 30,
    passMark: 60,
    shuffleQuestions: true,
    showResults: true,
    allowRetakes: true,
    maxAttempts: 3,
    status: 'published',
    questionsCount: 10,
    attempts: 18,
    avgScore: 76,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'assessment-2',
    title: 'Indices Quick Check',
    description: 'A quick assessment on indices and their properties.',
    courseId: 'course-1',
    duration: 10,
    passMark: 70,
    shuffleQuestions: false,
    showResults: true,
    allowRetakes: true,
    maxAttempts: 2,
    status: 'published',
    questionsCount: 5,
    attempts: 24,
    avgScore: 82,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
  },
  {
    id: 'assessment-3',
    title: 'Energy Forms Essay',
    description: 'Write an essay explaining different forms of energy and their conversions.',
    courseId: 'course-2',
    duration: 60,
    passMark: 50,
    shuffleQuestions: false,
    showResults: false,
    allowRetakes: false,
    maxAttempts: 1,
    status: 'published',
    questionsCount: 2,
    attempts: 28,
    avgScore: 71,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: 'assessment-4',
    title: 'Science Project Submission',
    description: 'Submit your science project presentation and video.',
    courseId: 'course-2',
    duration: 0,
    passMark: 60,
    shuffleQuestions: false,
    showResults: true,
    allowRetakes: true,
    maxAttempts: 3,
    status: 'draft',
    questionsCount: 2,
    attempts: 0,
    avgScore: 0,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
];

// Demo questions
export const demoQuestions: Question[] = [
  // Assessment 1 questions
  {
    id: 'q-1',
    assessmentId: 'assessment-1',
    type: 'multiple-choice',
    text: 'What is the standard form of a quadratic equation?',
    points: 1,
    required: true,
    explanation: 'The standard form is ax² + bx + c = 0, where a ≠ 0.',
    content: {
      type: 'multiple-choice',
      options: [
        { id: 'opt-1', text: 'ax² + bx + c = 0', isCorrect: true },
        { id: 'opt-2', text: 'ax + b = 0', isCorrect: false },
        { id: 'opt-3', text: 'ax³ + bx² + cx + d = 0', isCorrect: false },
        { id: 'opt-4', text: 'a/x + b = 0', isCorrect: false },
      ],
    },
    order: 1,
  },
  {
    id: 'q-2',
    assessmentId: 'assessment-1',
    type: 'true-false',
    text: 'A quadratic equation always has two real roots.',
    points: 1,
    required: true,
    explanation: 'This is false. A quadratic can have 2, 1, or 0 real roots depending on the discriminant.',
    content: {
      type: 'true-false',
      correctAnswer: false,
    },
    order: 2,
  },
  {
    id: 'q-3',
    assessmentId: 'assessment-1',
    type: 'short-answer',
    text: 'What is the quadratic formula? (Use "x =" format)',
    points: 2,
    required: true,
    explanation: 'x = (-b ± √(b² - 4ac)) / 2a',
    content: {
      type: 'short-answer',
      acceptedAnswers: [
        'x = (-b ± √(b² - 4ac)) / 2a',
        '(-b ± √(b² - 4ac)) / 2a',
        'x=(-b±√(b²-4ac))/2a',
      ],
      caseSensitive: false,
    },
    order: 3,
  },
  {
    id: 'q-4',
    assessmentId: 'assessment-1',
    type: 'multiple-select',
    text: 'Which of the following are methods to solve quadratic equations?',
    points: 2,
    required: true,
    explanation: 'Factorisation, completing the square, and the quadratic formula are all valid methods.',
    content: {
      type: 'multiple-select',
      options: [
        { id: 'opt-1', text: 'Factorisation', isCorrect: true },
        { id: 'opt-2', text: 'Completing the square', isCorrect: true },
        { id: 'opt-3', text: 'Integration', isCorrect: false },
        { id: 'opt-4', text: 'Quadratic formula', isCorrect: true },
      ],
    },
    order: 4,
  },
  {
    id: 'q-5',
    assessmentId: 'assessment-1',
    type: 'fill-blank',
    text: 'Complete the sentence:',
    points: 2,
    required: true,
    explanation: 'The discriminant determines the nature of the roots.',
    content: {
      type: 'fill-blank',
      textWithBlanks: 'The discriminant of a quadratic equation is {{1}} and determines the {{2}} of the roots.',
      blanks: [
        { id: 'blank-1', acceptedAnswers: ['b² - 4ac', 'b^2 - 4ac', 'b²-4ac'] },
        { id: 'blank-2', acceptedAnswers: ['nature', 'type', 'number'] },
      ],
    },
    order: 5,
  },
  {
    id: 'q-6',
    assessmentId: 'assessment-1',
    type: 'matching',
    text: 'Match the discriminant value with the number of real roots:',
    points: 3,
    required: true,
    explanation: 'D > 0 means 2 roots, D = 0 means 1 root, D < 0 means no real roots.',
    content: {
      type: 'matching',
      pairs: [
        { id: 'pair-1', left: 'D > 0', right: '2 distinct real roots' },
        { id: 'pair-2', left: 'D = 0', right: '1 repeated real root' },
        { id: 'pair-3', left: 'D < 0', right: 'No real roots' },
      ],
    },
    order: 6,
  },
  // Assessment 3 - Essay questions
  {
    id: 'q-10',
    assessmentId: 'assessment-3',
    type: 'essay',
    text: 'Explain the law of conservation of energy and provide three real-world examples.',
    points: 20,
    required: true,
    explanation: 'A good essay should clearly define the law and provide relevant, explained examples.',
    content: {
      type: 'essay',
      minWords: 300,
      maxWords: 800,
      rubric: 'Content accuracy (40%), Examples quality (30%), Writing clarity (20%), Structure (10%)',
    },
    order: 1,
  },
  {
    id: 'q-11',
    assessmentId: 'assessment-3',
    type: 'long-answer',
    text: 'Describe how energy transforms in a hydroelectric power plant.',
    points: 10,
    required: true,
    content: {
      type: 'long-answer',
      minWords: 100,
      maxWords: 300,
      placeholder: 'Explain the energy transformations step by step...',
    },
    order: 2,
  },
  // Assessment 4 - File upload questions
  {
    id: 'q-12',
    assessmentId: 'assessment-4',
    type: 'file-upload',
    text: 'Upload your science project presentation (PowerPoint or PDF).',
    points: 40,
    required: true,
    content: {
      type: 'file-upload',
      allowedTypes: ['presentation', 'document'],
      maxFileSize: 50,
      maxFiles: 1,
      instructions: 'Your presentation should include: Introduction, Hypothesis, Methodology, Results, and Conclusion.',
    },
    order: 1,
  },
  {
    id: 'q-13',
    assessmentId: 'assessment-4',
    type: 'file-upload',
    text: 'Upload a video demonstration of your experiment (max 5 minutes).',
    points: 30,
    required: false,
    content: {
      type: 'file-upload',
      allowedTypes: ['video'],
      maxFileSize: 500,
      maxFiles: 1,
      instructions: 'Record yourself explaining and demonstrating your experiment. Keep it under 5 minutes.',
    },
    order: 2,
  },
];

// Helper to generate unique IDs
export const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper to get default content for question types
export function getDefaultQuestionContent(type: QuestionType): QuestionContent {
  switch (type) {
    case 'multiple-choice':
      return {
        type: 'multiple-choice',
        options: [
          { id: generateId('opt'), text: 'Option A', isCorrect: true },
          { id: generateId('opt'), text: 'Option B', isCorrect: false },
          { id: generateId('opt'), text: 'Option C', isCorrect: false },
          { id: generateId('opt'), text: 'Option D', isCorrect: false },
        ],
      };
    case 'multiple-select':
      return {
        type: 'multiple-select',
        options: [
          { id: generateId('opt'), text: 'Option A', isCorrect: true },
          { id: generateId('opt'), text: 'Option B', isCorrect: false },
          { id: generateId('opt'), text: 'Option C', isCorrect: true },
          { id: generateId('opt'), text: 'Option D', isCorrect: false },
        ],
      };
    case 'true-false':
      return {
        type: 'true-false',
        correctAnswer: true,
      };
    case 'short-answer':
      return {
        type: 'short-answer',
        acceptedAnswers: [''],
        caseSensitive: false,
      };
    case 'fill-blank':
      return {
        type: 'fill-blank',
        textWithBlanks: 'The answer is {{1}}.',
        blanks: [{ id: generateId('blank'), acceptedAnswers: [''] }],
      };
    case 'matching':
      return {
        type: 'matching',
        pairs: [
          { id: generateId('pair'), left: 'Item A', right: 'Match A' },
          { id: generateId('pair'), left: 'Item B', right: 'Match B' },
        ],
      };
    case 'essay':
      return {
        type: 'essay',
        minWords: 200,
        maxWords: 1000,
        rubric: '',
      };
    case 'long-answer':
      return {
        type: 'long-answer',
        minWords: 50,
        maxWords: 500,
        placeholder: 'Enter your answer here...',
      };
    case 'file-upload':
      return {
        type: 'file-upload',
        allowedTypes: ['document', 'image'],
        maxFileSize: 10,
        maxFiles: 1,
        instructions: '',
      };
  }
}
