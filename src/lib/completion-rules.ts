// Unified completion rules for the learning platform
import { Block, BlockType, Page, Chapter, Course } from './demo-data';

// Block completion rules by type
export type CompletionMethod = 'viewed' | 'answered' | 'correct_order' | 'submitted' | 'not_counted';

export interface BlockCompletionRule {
  type: BlockType;
  method: CompletionMethod;
  label: string;
  description: string;
  countsTowardsCompletion: boolean;
}

export const blockCompletionRules: Record<BlockType, BlockCompletionRule> = {
  'text': {
    type: 'text',
    method: 'viewed',
    label: 'View content',
    description: 'Complete when viewed',
    countsTowardsCompletion: true,
  },
  'video': {
    type: 'video',
    method: 'viewed',
    label: 'Watch video',
    description: 'Complete when viewed',
    countsTowardsCompletion: true,
  },
  'image': {
    type: 'image',
    method: 'viewed',
    label: 'View image',
    description: 'Complete when viewed',
    countsTowardsCompletion: true,
  },
  'resource': {
    type: 'resource',
    method: 'viewed',
    label: 'Access resource',
    description: 'Complete when viewed',
    countsTowardsCompletion: true,
  },
  'divider': {
    type: 'divider',
    method: 'viewed',
    label: 'Visual only',
    description: 'No completion required',
    countsTowardsCompletion: false,
  },
  'micro-quiz': {
    type: 'micro-quiz',
    method: 'answered',
    label: 'Answer quiz',
    description: 'Complete when answered',
    countsTowardsCompletion: true,
  },
  'drag-drop-reorder': {
    type: 'drag-drop-reorder',
    method: 'correct_order',
    label: 'Correct order',
    description: 'Complete when correct order achieved',
    countsTowardsCompletion: true,
  },
  'whiteboard': {
    type: 'whiteboard',
    method: 'submitted',
    label: 'Submit work',
    description: 'Complete when submission exists',
    countsTowardsCompletion: true,
  },
  'reflection': {
    type: 'reflection',
    method: 'submitted',
    label: 'Submit reflection',
    description: 'Complete when submitted',
    countsTowardsCompletion: true,
  },
  'qa-thread': {
    type: 'qa-thread',
    method: 'not_counted',
    label: 'Optional',
    description: 'Not counted towards completion',
    countsTowardsCompletion: false,
  },
};

// Get completion rule for a block type
export function getBlockCompletionRule(type: BlockType): BlockCompletionRule {
  return blockCompletionRules[type];
}

// Check if a block is complete based on its type and state
export function isBlockComplete(block: Block): boolean {
  const rule = getBlockCompletionRule(block.type);
  
  // Blocks that don't count are always "complete" for calculation purposes
  if (!rule.countsTowardsCompletion) {
    return true;
  }
  
  // For demo purposes, we rely on the isCompleted flag
  // In a real app, this would check specific conditions per type
  return block.isCompleted;
}

// Calculate page completion percentage and status
export interface PageCompletionStatus {
  completedBlocks: number;
  requiredBlocks: number;
  totalBlocks: number;
  percentage: number;
  isComplete: boolean;
}

export function calculatePageCompletion(blocks: Block[]): PageCompletionStatus {
  // Filter out blocks that don't count towards completion
  const countableBlocks = blocks.filter(b => {
    const rule = getBlockCompletionRule(b.type);
    return rule.countsTowardsCompletion;
  });
  
  // For required blocks
  const requiredBlocks = countableBlocks.filter(b => b.isRequired);
  const completedRequiredBlocks = requiredBlocks.filter(b => isBlockComplete(b));
  
  // All countable blocks for percentage
  const completedBlocks = countableBlocks.filter(b => isBlockComplete(b));
  
  const percentage = countableBlocks.length > 0 
    ? Math.round((completedBlocks.length / countableBlocks.length) * 100)
    : 100;
  
  // Page is complete when all REQUIRED blocks are complete
  const isComplete = requiredBlocks.length === 0 || 
    completedRequiredBlocks.length === requiredBlocks.length;
  
  return {
    completedBlocks: completedBlocks.length,
    requiredBlocks: requiredBlocks.length,
    totalBlocks: countableBlocks.length,
    percentage,
    isComplete,
  };
}

// Calculate chapter completion
export interface ChapterCompletionStatus {
  completedPages: number;
  totalPages: number;
  percentage: number;
  isComplete: boolean;
}

export function calculateChapterCompletion(pages: Page[], blocks: Block[]): ChapterCompletionStatus {
  if (pages.length === 0) {
    return { completedPages: 0, totalPages: 0, percentage: 100, isComplete: true };
  }
  
  let completedPages = 0;
  
  pages.forEach(page => {
    const pageBlocks = blocks.filter(b => b.pageId === page.id);
    const pageCompletion = calculatePageCompletion(pageBlocks);
    if (pageCompletion.isComplete) {
      completedPages++;
    }
  });
  
  const percentage = Math.round((completedPages / pages.length) * 100);
  const isComplete = completedPages === pages.length;
  
  return {
    completedPages,
    totalPages: pages.length,
    percentage,
    isComplete,
  };
}

// Calculate course completion
export interface CourseCompletionStatus {
  completedChapters: number;
  totalChapters: number;
  percentage: number;
  isComplete: boolean;
}

export function calculateCourseCompletion(
  chapters: Chapter[], 
  pages: Page[], 
  blocks: Block[]
): CourseCompletionStatus {
  if (chapters.length === 0) {
    return { completedChapters: 0, totalChapters: 0, percentage: 100, isComplete: true };
  }
  
  let completedChapters = 0;
  
  chapters.forEach(chapter => {
    const chapterPages = pages.filter(p => p.chapterId === chapter.id);
    const chapterCompletion = calculateChapterCompletion(chapterPages, blocks);
    if (chapterCompletion.isComplete) {
      completedChapters++;
    }
  });
  
  const percentage = Math.round((completedChapters / chapters.length) * 100);
  const isComplete = completedChapters === chapters.length;
  
  return {
    completedChapters,
    totalChapters: chapters.length,
    percentage,
    isComplete,
  };
}

// Get human-readable completion summary for a page
export function getPageCompletionSummary(blocks: Block[]): string {
  const countableBlocks = blocks.filter(b => {
    const rule = getBlockCompletionRule(b.type);
    return rule.countsTowardsCompletion;
  });
  
  const requiredBlocks = countableBlocks.filter(b => b.isRequired);
  
  if (requiredBlocks.length === 0) {
    if (countableBlocks.length === 0) {
      return 'No completion requirements';
    }
    return 'View all content to complete';
  }
  
  // Group required blocks by type for summary
  const typeGroups: Record<string, number> = {};
  requiredBlocks.forEach(block => {
    const rule = getBlockCompletionRule(block.type);
    const key = rule.label;
    typeGroups[key] = (typeGroups[key] || 0) + 1;
  });
  
  const parts = Object.entries(typeGroups).map(([label, count]) => {
    return count > 1 ? `${count} × ${label}` : label;
  });
  
  return parts.join(', ');
}
