// Demo Centre Data for Tuition Centre LMS

export type UserRole = 'admin' | 'tutor' | 'student' | 'parent';

export interface Centre {
  id: string;
  name: string;
  logo?: string;
  subdomain: string;
  primaryColor?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  centreId: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  level: string;
  subject: string;
  chaptersCount: number;
  studentsEnrolled: number;
  completionRate: number;
  status: 'draft' | 'published' | 'archived';
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  order: number;
  pagesCount: number;
  isLocked: boolean;
}

export interface Page {
  id: string;
  chapterId: string;
  title: string;
  order: number;
  blocksCount: number;
  isRequired: boolean;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface Block {
  id: string;
  pageId: string;
  type: BlockType;
  title: string;
  content: any;
  order: number;
  isRequired: boolean;
  isCompleted: boolean;
}

export type BlockType = 
  | 'text'
  | 'video'
  | 'image'
  | 'micro-quiz'
  | 'drag-drop-reorder'
  | 'whiteboard'
  | 'reflection'
  | 'qa-thread'
  | 'resource'
  | 'divider';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  enrolledCourses: number;
  completionRate: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'at-risk';
  makeUpCredits: number;
}

export interface Cohort {
  id: string;
  name: string;
  courseId: string;
  tutorId: string;
  studentsCount: number;
  schedule: string;
  startDate: string;
  status: 'active' | 'completed' | 'upcoming';
}

export interface Session {
  id: string;
  cohortId: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  meetingLink: string;
  recordingLink?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  attendanceCount: number;
  totalStudents: number;
}

export interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  description: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentIds: string[];
}

// Demo Data
export const demoCentres: Centre[] = [
  {
    id: 'centre-1',
    name: 'Bright Minds Academy',
    subdomain: 'brightminds',
    primaryColor: '#1e3a5f',
  },
  {
    id: 'centre-2',
    name: 'Excel Learning Hub',
    subdomain: 'excelhub',
    primaryColor: '#0d9488',
  },
];

export const demoUsers: Record<UserRole, User> = {
  admin: {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah@brightminds.edu',
    role: 'admin',
    centreId: 'centre-1',
  },
  tutor: {
    id: 'user-2',
    name: 'Mr. Ahmad Rahman',
    email: 'ahmad@brightminds.edu',
    role: 'tutor',
    centreId: 'centre-1',
  },
  student: {
    id: 'user-3',
    name: 'Wei Lin Tan',
    email: 'weilin@student.edu',
    role: 'student',
    centreId: 'centre-1',
  },
  parent: {
    id: 'user-4',
    name: 'Mrs. Tan Mei Ling',
    email: 'meiling.tan@email.com',
    role: 'parent',
    centreId: 'centre-1',
  },
};

export const demoCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Secondary 3 Mathematics',
    description: 'Comprehensive coverage of Sec 3 A-Math and E-Math syllabus with active learning components.',
    level: 'Secondary 3',
    subject: 'Mathematics',
    chaptersCount: 8,
    studentsEnrolled: 24,
    completionRate: 67,
    status: 'published',
  },
  {
    id: 'course-2',
    title: 'Primary 6 Science',
    description: 'PSLE Science preparation with experiments and interactive quizzes.',
    level: 'Primary 6',
    subject: 'Science',
    chaptersCount: 12,
    studentsEnrolled: 32,
    completionRate: 45,
    status: 'published',
  },
  {
    id: 'course-3',
    title: 'O-Level English',
    description: 'Complete O-Level English preparation covering comprehension, composition, and oral.',
    level: 'Secondary 4',
    subject: 'English',
    chaptersCount: 10,
    studentsEnrolled: 18,
    completionRate: 82,
    status: 'published',
  },
  {
    id: 'course-4',
    title: 'A-Level Economics',
    description: 'H2 Economics with case studies and essay practice.',
    level: 'JC 2',
    subject: 'Economics',
    chaptersCount: 6,
    studentsEnrolled: 0,
    completionRate: 0,
    status: 'draft',
  },
];

export const demoChapters: Chapter[] = [
  { id: 'ch-1', courseId: 'course-1', title: 'Chapter 1: Quadratic Equations', order: 1, pagesCount: 5, isLocked: false },
  { id: 'ch-2', courseId: 'course-1', title: 'Chapter 2: Indices and Surds', order: 2, pagesCount: 4, isLocked: false },
  { id: 'ch-3', courseId: 'course-1', title: 'Chapter 3: Polynomials', order: 3, pagesCount: 6, isLocked: true },
  { id: 'ch-4', courseId: 'course-1', title: 'Chapter 4: Linear Inequalities', order: 4, pagesCount: 4, isLocked: true },
];

export const demoPages: Page[] = [
  { id: 'pg-1', chapterId: 'ch-1', title: 'Introduction to Quadratics', order: 1, blocksCount: 4, isRequired: true, isCompleted: true, isLocked: false },
  { id: 'pg-2', chapterId: 'ch-1', title: 'Solving by Factorisation', order: 2, blocksCount: 6, isRequired: true, isCompleted: true, isLocked: false },
  { id: 'pg-3', chapterId: 'ch-1', title: 'The Quadratic Formula', order: 3, blocksCount: 5, isRequired: true, isCompleted: false, isLocked: false },
  { id: 'pg-4', chapterId: 'ch-1', title: 'Graphing Quadratics', order: 4, blocksCount: 7, isRequired: true, isCompleted: false, isLocked: true },
  { id: 'pg-5', chapterId: 'ch-1', title: 'Chapter Quiz', order: 5, blocksCount: 3, isRequired: true, isCompleted: false, isLocked: true },
];

export const demoBlocks: Block[] = [
  { id: 'blk-1', pageId: 'pg-3', type: 'text', title: 'Learning Objectives', content: {}, order: 1, isRequired: false, isCompleted: true },
  { id: 'blk-2', pageId: 'pg-3', type: 'video', title: 'Video: Deriving the Formula', content: { duration: '12:34' }, order: 2, isRequired: true, isCompleted: true },
  { id: 'blk-3', pageId: 'pg-3', type: 'micro-quiz', title: 'Quick Check', content: { questions: 3 }, order: 3, isRequired: true, isCompleted: false },
  { id: 'blk-4', pageId: 'pg-3', type: 'whiteboard', title: 'Practice: Solve These', content: {}, order: 4, isRequired: true, isCompleted: false },
  { id: 'blk-5', pageId: 'pg-3', type: 'reflection', title: 'Reflection: What did you learn?', content: {}, order: 5, isRequired: false, isCompleted: false },
];

export const demoStudents: Student[] = [
  { id: 'stu-1', name: 'Wei Lin Tan', email: 'weilin@student.edu', phone: '+65 9123 4567', enrolledCourses: 2, completionRate: 78, lastActive: '2 hours ago', status: 'active', makeUpCredits: 1 },
  { id: 'stu-2', name: 'Aisha Binti Hassan', email: 'aisha@student.edu', phone: '+60 12-345 6789', enrolledCourses: 3, completionRate: 92, lastActive: '30 minutes ago', status: 'active', makeUpCredits: 0 },
  { id: 'stu-3', name: 'Ryan Koh', email: 'ryan.koh@student.edu', phone: '+65 8765 4321', enrolledCourses: 1, completionRate: 34, lastActive: '5 days ago', status: 'at-risk', makeUpCredits: 2 },
  { id: 'stu-4', name: 'Priya Sharma', email: 'priya.s@student.edu', phone: '+65 9876 5432', enrolledCourses: 2, completionRate: 65, lastActive: '1 day ago', status: 'active', makeUpCredits: 0 },
  { id: 'stu-5', name: 'Muhammad Irfan', email: 'irfan@student.edu', phone: '+60 11-234 5678', enrolledCourses: 1, completionRate: 88, lastActive: '3 hours ago', status: 'active', makeUpCredits: 1 },
];

export const demoCohorts: Cohort[] = [
  { id: 'coh-1', name: 'Sec 3 Math - Tue/Thu', courseId: 'course-1', tutorId: 'user-2', studentsCount: 12, schedule: 'Tue & Thu, 4:00 PM', startDate: '2024-01-08', status: 'active' },
  { id: 'coh-2', name: 'Sec 3 Math - Sat AM', courseId: 'course-1', tutorId: 'user-2', studentsCount: 8, schedule: 'Sat, 9:00 AM', startDate: '2024-01-06', status: 'active' },
  { id: 'coh-3', name: 'P6 Science - Wed', courseId: 'course-2', tutorId: 'user-2', studentsCount: 15, schedule: 'Wed, 5:00 PM', startDate: '2024-01-10', status: 'active' },
];

export const demoSessions: Session[] = [
  { id: 'ses-1', cohortId: 'coh-1', title: 'Quadratic Equations - Part 2', date: '2024-01-23', time: '4:00 PM', duration: 90, meetingLink: 'https://meet.google.com/abc-defg-hij', status: 'scheduled', attendanceCount: 0, totalStudents: 12 },
  { id: 'ses-2', cohortId: 'coh-2', title: 'Indices Practice', date: '2024-01-20', time: '9:00 AM', duration: 120, meetingLink: 'https://meet.google.com/xyz-uvwx-rst', recordingLink: 'https://drive.google.com/...', status: 'completed', attendanceCount: 7, totalStudents: 8 },
  { id: 'ses-3', cohortId: 'coh-3', title: 'Energy Conversion', date: '2024-01-24', time: '5:00 PM', duration: 90, meetingLink: 'https://meet.google.com/pqr-stuv-wxy', status: 'scheduled', attendanceCount: 0, totalStudents: 15 },
];

export const demoInvoices: Invoice[] = [
  { id: 'inv-1', studentId: 'stu-1', studentName: 'Wei Lin Tan', amount: 480, currency: 'SGD', status: 'paid', dueDate: '2024-01-15', description: 'Jan 2024 - Sec 3 Math' },
  { id: 'inv-2', studentId: 'stu-2', studentName: 'Aisha Binti Hassan', amount: 350, currency: 'MYR', status: 'pending', dueDate: '2024-01-25', description: 'Jan 2024 - P6 Science' },
  { id: 'inv-3', studentId: 'stu-3', studentName: 'Ryan Koh', amount: 480, currency: 'SGD', status: 'overdue', dueDate: '2024-01-10', description: 'Jan 2024 - Sec 3 Math' },
  { id: 'inv-4', studentId: 'stu-4', studentName: 'Priya Sharma', amount: 480, currency: 'SGD', status: 'pending', dueDate: '2024-01-28', description: 'Jan 2024 - Sec 3 Math' },
];

export const demoParents: Parent[] = [
  { id: 'par-1', name: 'Mrs. Tan Mei Ling', email: 'meiling.tan@email.com', phone: '+65 9123 4567', studentIds: ['stu-1'] },
  { id: 'par-2', name: 'Mr. Hassan Bin Ahmad', email: 'hassan.ahmad@email.com', phone: '+60 12-345 6789', studentIds: ['stu-2'] },
  { id: 'par-3', name: 'Mrs. Koh Siew Lian', email: 'siewlian.koh@email.com', phone: '+65 8765 4321', studentIds: ['stu-3'] },
  { id: 'par-4', name: 'Mr. Rajesh Sharma', email: 'rajesh.sharma@email.com', phone: '+65 9876 5432', studentIds: ['stu-4'] },
  { id: 'par-5', name: 'Mrs. Fatimah Binti Yusof', email: 'fatimah.yusof@email.com', phone: '+60 11-234 5678', studentIds: ['stu-5'] },
];

export const blockTypes: { type: BlockType; label: string; icon: string; description: string }[] = [
  { type: 'text', label: 'Text', icon: 'Type', description: 'Rich text content' },
  { type: 'video', label: 'Video', icon: 'Play', description: 'Embedded video' },
  { type: 'image', label: 'Image', icon: 'Image', description: 'Image with caption' },
  { type: 'micro-quiz', label: 'Micro-Quiz', icon: 'HelpCircle', description: '1-3 questions with instant feedback' },
  { type: 'drag-drop-reorder', label: 'Reorder Steps', icon: 'ListOrdered', description: 'Drag & drop to reorder' },
  { type: 'whiteboard', label: 'Whiteboard', icon: 'PenTool', description: 'Draw or write submission' },
  { type: 'reflection', label: 'Reflection', icon: 'MessageSquare', description: 'Reflection with peer gallery' },
  { type: 'qa-thread', label: 'Q&A Thread', icon: 'MessagesSquare', description: 'Questions with tutor answers' },
  { type: 'resource', label: 'Resource', icon: 'FileText', description: 'Downloadable file' },
  { type: 'divider', label: 'Divider', icon: 'Minus', description: 'Visual separator' },
];

export const whatsappTemplates = [
  { id: 't1', name: 'Session Reminder', message: 'Hi {parent_name}! Reminder: {student_name} has class tomorrow ({date}) at {time}. Join link: {meeting_link}' },
  { id: 't2', name: 'Invoice Due', message: 'Hi {parent_name}, the invoice for {student_name} ({amount}) is due on {due_date}. Please make payment to avoid disruption. Thank you!' },
  { id: 't3', name: 'Attendance Alert', message: 'Hi {parent_name}, {student_name} was absent from today\'s class. Please let us know if you\'d like to arrange a make-up session.' },
  { id: 't4', name: 'Progress Update', message: 'Hi {parent_name}! {student_name} has completed {completion}% of the course. Great progress! Keep it up!' },
];
