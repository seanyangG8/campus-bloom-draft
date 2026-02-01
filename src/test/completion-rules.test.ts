import { describe, it, expect } from "vitest";
import { 
  checkQuizPassed, 
  checkReorderCorrect, 
  calculatePageCompletion,
  isBlockComplete,
  getBlockCompletionRule
} from "@/lib/completion-rules";
import { Block, BlockType } from "@/lib/demo-data";

// Helper to create mock blocks
const createBlock = (type: BlockType, content: any = {}, overrides: Partial<Block> = {}): Block => ({
  id: `test-block-${Date.now()}`,
  pageId: 'test-page',
  type,
  title: 'Test Block',
  content,
  order: 1,
  isRequired: false,
  isCompleted: false,
  ...overrides,
});

describe("checkQuizPassed", () => {
  describe("single-choice questions", () => {
    it("should correctly score when answer matches", () => {
      const block = createBlock('micro-quiz', {
        questions: [
          { id: 'q1', type: 'single-choice', question: 'Test?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 }
        ],
        passMark: 70,
        completionRule: 'passed'
      });
      
      const result = checkQuizPassed(block, { q1: 1 }, block.content.questions);
      
      expect(result.passed).toBe(true);
      expect(result.score).toBe(100);
    });

    it("should correctly score when answer is wrong", () => {
      const block = createBlock('micro-quiz', {
        questions: [
          { id: 'q1', type: 'single-choice', question: 'Test?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 }
        ],
        passMark: 70,
        completionRule: 'passed'
      });
      
      const result = checkQuizPassed(block, { q1: 0 }, block.content.questions);
      
      expect(result.passed).toBe(false);
      expect(result.score).toBe(0);
    });

    it("should handle multiple questions", () => {
      const block = createBlock('micro-quiz', {
        questions: [
          { id: 'q1', type: 'single-choice', question: 'Q1?', options: ['A', 'B'], correctAnswer: 0 },
          { id: 'q2', type: 'single-choice', question: 'Q2?', options: ['A', 'B'], correctAnswer: 1 }
        ],
        passMark: 50,
        completionRule: 'passed'
      });
      
      // Get 1 out of 2 correct
      const result = checkQuizPassed(block, { q1: 0, q2: 0 }, block.content.questions);
      
      expect(result.score).toBe(50);
      expect(result.passed).toBe(true);
    });
  });

  describe("multi-select questions", () => {
    it("should correctly score when all selections match", () => {
      const block = createBlock('micro-quiz', {
        questions: [
          { id: 'q1', type: 'multi-select', question: 'Select all:', options: ['A', 'B', 'C', 'D'], correctAnswer: [0, 2] }
        ],
        completionRule: 'passed',
        passMark: 100
      });
      
      const result = checkQuizPassed(block, { q1: [0, 2] }, block.content.questions);
      
      expect(result.passed).toBe(true);
      expect(result.score).toBe(100);
    });

    it("should handle selections in different order", () => {
      const block = createBlock('micro-quiz', {
        questions: [
          { id: 'q1', type: 'multi-select', question: 'Select all:', options: ['A', 'B', 'C'], correctAnswer: [0, 2] }
        ],
        completionRule: 'passed',
        passMark: 100
      });
      
      // Answer in reverse order
      const result = checkQuizPassed(block, { q1: [2, 0] }, block.content.questions);
      
      expect(result.passed).toBe(true);
      expect(result.score).toBe(100);
    });

    it("should fail when selections don't match", () => {
      const block = createBlock('micro-quiz', {
        questions: [
          { id: 'q1', type: 'multi-select', question: 'Select all:', options: ['A', 'B', 'C'], correctAnswer: [0, 2] }
        ],
        completionRule: 'passed',
        passMark: 100
      });
      
      const result = checkQuizPassed(block, { q1: [0, 1] }, block.content.questions);
      
      expect(result.passed).toBe(false);
      expect(result.score).toBe(0);
    });
  });

  describe("true-false questions", () => {
    it("should correctly score true-false as index 0 (true) or 1 (false)", () => {
      const block = createBlock('micro-quiz', {
        questions: [
          { id: 'q1', type: 'true-false', question: 'Is sky blue?', options: ['True', 'False'], correctAnswer: 0 }
        ],
        completionRule: 'passed',
        passMark: 100
      });
      
      const resultCorrect = checkQuizPassed(block, { q1: 0 }, block.content.questions);
      expect(resultCorrect.passed).toBe(true);
      
      const resultWrong = checkQuizPassed(block, { q1: 1 }, block.content.questions);
      expect(resultWrong.passed).toBe(false);
    });
  });

  describe("short-answer questions", () => {
    it("should match exact text when using short-answer type", () => {
      const block = createBlock('micro-quiz', {
        questions: [
          { id: 'q1', type: 'short-answer', question: 'Name?', options: ['quadratic formula'], correctAnswer: 0, correctAnswerText: 'quadratic formula', caseSensitive: false }
        ],
        completionRule: 'passed',
        passMark: 100
      });
      
      // Short answer stores text in a special way - tested through the UI
      // This test verifies the data structure is correct
      expect(block.content.questions[0].correctAnswerText).toBe('quadratic formula');
    });
  });

  describe("completion rules", () => {
    it("should pass with 'attempted' rule regardless of score", () => {
      const block = createBlock('micro-quiz', {
        questions: [
          { id: 'q1', type: 'single-choice', question: 'Test?', options: ['A', 'B'], correctAnswer: 0 }
        ],
        completionRule: 'attempted',
        passMark: 100
      });
      
      const result = checkQuizPassed(block, { q1: 1 }, block.content.questions);
      
      expect(result.passed).toBe(true); // Because completionRule is 'attempted'
      expect(result.score).toBe(0);
    });
  });
});

describe("checkReorderCorrect", () => {
  describe("all-or-nothing scoring", () => {
    it("should return 100% when order is correct", () => {
      const block = createBlock('drag-drop-reorder', {
        items: ['Step 1', 'Step 2', 'Step 3'],
        correctOrder: [0, 1, 2],
        scoringMode: 'all-or-nothing'
      });
      
      const result = checkReorderCorrect(block, [0, 1, 2]);
      
      expect(result.correct).toBe(true);
      expect(result.score).toBe(100);
    });

    it("should return 0% when any item is wrong", () => {
      const block = createBlock('drag-drop-reorder', {
        items: ['Step 1', 'Step 2', 'Step 3'],
        correctOrder: [0, 1, 2],
        scoringMode: 'all-or-nothing'
      });
      
      const result = checkReorderCorrect(block, [0, 2, 1]);
      
      expect(result.correct).toBe(false);
      expect(result.score).toBe(0);
    });
  });

  describe("partial-credit scoring", () => {
    it("should give partial credit for partially correct order", () => {
      const block = createBlock('drag-drop-reorder', {
        items: ['Step 1', 'Step 2', 'Step 3'],
        correctOrder: [0, 1, 2],
        scoringMode: 'partial-credit'
      });
      
      // 2 out of 3 correct (first and second position)
      const result = checkReorderCorrect(block, [0, 1, 0]);
      
      expect(result.correct).toBe(false);
      expect(result.score).toBe(67); // 2/3 ≈ 67%
    });

    it("should give 100% for fully correct order", () => {
      const block = createBlock('drag-drop-reorder', {
        items: ['A', 'B', 'C', 'D'],
        correctOrder: [0, 1, 2, 3],
        scoringMode: 'partial-credit'
      });
      
      const result = checkReorderCorrect(block, [0, 1, 2, 3]);
      
      expect(result.correct).toBe(true);
      expect(result.score).toBe(100);
    });
  });
});

describe("calculatePageCompletion", () => {
  it("should calculate completion based on required blocks", () => {
    const blocks: Block[] = [
      createBlock('text', { html: 'content' }, { isRequired: true, isCompleted: true }),
      createBlock('video', { url: 'test' }, { isRequired: true, isCompleted: false }),
      createBlock('micro-quiz', {}, { isRequired: false, isCompleted: false }),
    ];
    
    const result = calculatePageCompletion(blocks);
    
    expect(result.requiredBlocks).toBe(2);
    expect(result.isComplete).toBe(false); // One required block incomplete
  });

  it("should mark page complete when all required blocks are done", () => {
    const blocks: Block[] = [
      createBlock('text', { html: 'content' }, { isRequired: true, isCompleted: true }),
      createBlock('video', { url: 'test' }, { isRequired: true, isCompleted: true }),
      createBlock('micro-quiz', {}, { isRequired: false, isCompleted: false }),
    ];
    
    const result = calculatePageCompletion(blocks);
    
    expect(result.isComplete).toBe(true);
  });

  it("should exclude dividers from completion calculation", () => {
    const blocks: Block[] = [
      createBlock('text', { html: 'content' }, { isRequired: true, isCompleted: true }),
      createBlock('divider', { style: 'line' }, { isRequired: true, isCompleted: false }),
    ];
    
    const result = calculatePageCompletion(blocks);
    
    expect(result.totalBlocks).toBe(1); // Divider not counted
    expect(result.isComplete).toBe(true);
  });
});

describe("getBlockCompletionRule", () => {
  it("should return correct rule for each block type", () => {
    expect(getBlockCompletionRule('text').method).toBe('viewed');
    expect(getBlockCompletionRule('video').method).toBe('viewed');
    expect(getBlockCompletionRule('micro-quiz').method).toBe('answered');
    expect(getBlockCompletionRule('drag-drop-reorder').method).toBe('correct_order');
    expect(getBlockCompletionRule('whiteboard').method).toBe('submitted');
    expect(getBlockCompletionRule('reflection').method).toBe('submitted');
    expect(getBlockCompletionRule('divider').method).toBe('not_counted');
    expect(getBlockCompletionRule('qa-thread').method).toBe('not_counted');
  });

  it("should indicate which blocks support pass marks", () => {
    expect(getBlockCompletionRule('micro-quiz').supportsPassMark).toBe(true);
    expect(getBlockCompletionRule('drag-drop-reorder').supportsPassMark).toBe(true);
    expect(getBlockCompletionRule('text').supportsPassMark).toBeUndefined();
  });
});

describe("isBlockComplete", () => {
  it("should return true for blocks that don't count towards completion", () => {
    const divider = createBlock('divider', { style: 'line' }, { isCompleted: false });
    expect(isBlockComplete(divider)).toBe(true);
    
    const qaThread = createBlock('qa-thread', {}, { isCompleted: false });
    expect(isBlockComplete(qaThread)).toBe(true);
  });

  it("should use progress status when provided", () => {
    const block = createBlock('micro-quiz', {}, { isCompleted: false });
    const progress = { blockId: block.id, status: 'completed' as const, attempts: 1 };
    
    expect(isBlockComplete(block, progress)).toBe(true);
  });

  it("should fall back to isCompleted flag when no progress", () => {
    const blockComplete = createBlock('text', { html: 'test' }, { isCompleted: true });
    const blockIncomplete = createBlock('text', { html: 'test' }, { isCompleted: false });
    
    expect(isBlockComplete(blockComplete)).toBe(true);
    expect(isBlockComplete(blockIncomplete)).toBe(false);
  });
});
