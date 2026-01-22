import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Chapter, Page, Block, BlockType, demoChapters, demoPages, demoBlocks } from '@/lib/demo-data';
import { toast } from 'sonner';

interface CourseBuilderContextType {
  // Data
  chapters: Chapter[];
  pages: Page[];
  blocks: Block[];
  selectedPageId: string | null;
  selectedBlockId: string | null;
  
  // Selection
  setSelectedPageId: (id: string | null) => void;
  setSelectedBlockId: (id: string | null) => void;
  
  // Chapter CRUD
  addChapter: (courseId: string, title: string) => void;
  updateChapter: (id: string, updates: Partial<Chapter>) => void;
  deleteChapter: (id: string) => void;
  reorderChapters: (courseId: string, orderedIds: string[]) => void;
  
  // Page CRUD
  addPage: (chapterId: string, title: string) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  reorderPages: (chapterId: string, orderedIds: string[]) => void;
  
  // Block CRUD
  addBlock: (pageId: string, type: BlockType, title?: string, insertAtIndex?: number) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (pageId: string, orderedIds: string[]) => void;
  duplicateBlock: (id: string) => void;
  
  // Page helpers
  getPagesByChapter: (chapterId: string) => Page[];
  getBlocksByPage: (pageId: string) => Block[];
  getChaptersByCourse: (courseId: string) => Chapter[];
}

const CourseBuilderContext = createContext<CourseBuilderContextType | undefined>(undefined);

// Helper to generate unique IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function CourseBuilderProvider({ children, courseId }: { children: ReactNode; courseId: string }) {
  const [chapters, setChapters] = useState<Chapter[]>(
    demoChapters.filter(c => c.courseId === courseId)
  );
  const [pages, setPages] = useState<Page[]>(demoPages);
  const [blocks, setBlocks] = useState<Block[]>(demoBlocks);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Chapter operations
  const addChapter = useCallback((courseId: string, title: string) => {
    const newChapter: Chapter = {
      id: generateId('ch'),
      courseId,
      title,
      order: chapters.filter(c => c.courseId === courseId).length + 1,
      pagesCount: 0,
      isLocked: false,
    };
    setChapters(prev => [...prev, newChapter]);
    toast.success('Chapter added');
  }, [chapters]);

  const updateChapter = useCallback((id: string, updates: Partial<Chapter>) => {
    setChapters(prev => prev.map(ch => 
      ch.id === id ? { ...ch, ...updates } : ch
    ));
  }, []);

  const deleteChapter = useCallback((id: string) => {
    // Also delete all pages and blocks in this chapter
    const chapterPages = pages.filter(p => p.chapterId === id);
    const pageIds = chapterPages.map(p => p.id);
    
    setBlocks(prev => prev.filter(b => !pageIds.includes(b.pageId)));
    setPages(prev => prev.filter(p => p.chapterId !== id));
    setChapters(prev => prev.filter(ch => ch.id !== id));
    
    if (selectedPageId && pageIds.includes(selectedPageId)) {
      setSelectedPageId(null);
    }
    toast.success('Chapter deleted');
  }, [pages, selectedPageId]);

  const reorderChapters = useCallback((courseId: string, orderedIds: string[]) => {
    setChapters(prev => {
      const courseChapters = prev.filter(c => c.courseId === courseId);
      const otherChapters = prev.filter(c => c.courseId !== courseId);
      
      const reordered = orderedIds.map((id, index) => {
        const chapter = courseChapters.find(c => c.id === id);
        return chapter ? { ...chapter, order: index + 1 } : null;
      }).filter(Boolean) as Chapter[];
      
      return [...otherChapters, ...reordered];
    });
  }, []);

  // Page operations
  const addPage = useCallback((chapterId: string, title: string) => {
    const chapterPages = pages.filter(p => p.chapterId === chapterId);
    const newPage: Page = {
      id: generateId('pg'),
      chapterId,
      title,
      order: chapterPages.length + 1,
      blocksCount: 0,
      isRequired: true,
      isCompleted: false,
      isLocked: false,
    };
    setPages(prev => [...prev, newPage]);
    
    // Update chapter page count
    setChapters(prev => prev.map(ch => 
      ch.id === chapterId ? { ...ch, pagesCount: ch.pagesCount + 1 } : ch
    ));
    
    toast.success('Page added');
    return newPage.id;
  }, [pages]);

  const updatePage = useCallback((id: string, updates: Partial<Page>) => {
    setPages(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  }, []);

  const deletePage = useCallback((id: string) => {
    const page = pages.find(p => p.id === id);
    if (!page) return;
    
    // Delete all blocks in this page
    setBlocks(prev => prev.filter(b => b.pageId !== id));
    setPages(prev => prev.filter(p => p.id !== id));
    
    // Update chapter page count
    setChapters(prev => prev.map(ch => 
      ch.id === page.chapterId ? { ...ch, pagesCount: Math.max(0, ch.pagesCount - 1) } : ch
    ));
    
    if (selectedPageId === id) {
      setSelectedPageId(null);
    }
    toast.success('Page deleted');
  }, [pages, selectedPageId]);

  const reorderPages = useCallback((chapterId: string, orderedIds: string[]) => {
    setPages(prev => {
      const chapterPages = prev.filter(p => p.chapterId === chapterId);
      const otherPages = prev.filter(p => p.chapterId !== chapterId);
      
      const reordered = orderedIds.map((id, index) => {
        const page = chapterPages.find(p => p.id === id);
        return page ? { ...page, order: index + 1 } : null;
      }).filter(Boolean) as Page[];
      
      return [...otherPages, ...reordered];
    });
  }, []);

  // Block operations
  const addBlock = useCallback((pageId: string, type: BlockType, title?: string, insertAtIndex?: number) => {
    const pageBlocks = blocks.filter(b => b.pageId === pageId).sort((a, b) => a.order - b.order);
    const blockLabel: Record<BlockType, string> = {
      'text': 'Text Block',
      'video': 'Video',
      'image': 'Image',
      'micro-quiz': 'Micro-Quiz',
      'drag-drop-reorder': 'Reorder Activity',
      'whiteboard': 'Whiteboard Activity',
      'reflection': 'Reflection',
      'qa-thread': 'Q&A Thread',
      'resource': 'Resource',
      'divider': 'Divider',
    };
    
    const newBlock: Block = {
      id: generateId('blk'),
      pageId,
      type,
      title: title || blockLabel[type] || 'New Block',
      content: getDefaultContent(type),
      order: insertAtIndex !== undefined ? insertAtIndex + 1 : pageBlocks.length + 1,
      isRequired: false,
      isCompleted: false,
    };
    
    // If inserting at a specific index, update orders of existing blocks
    if (insertAtIndex !== undefined && insertAtIndex < pageBlocks.length) {
      setBlocks(prev => {
        const otherBlocks = prev.filter(b => b.pageId !== pageId);
        const updatedPageBlocks = pageBlocks.map((b, i) => ({
          ...b,
          order: i >= insertAtIndex ? b.order + 1 : b.order
        }));
        return [...otherBlocks, ...updatedPageBlocks, newBlock];
      });
    } else {
      setBlocks(prev => [...prev, newBlock]);
    }
    
    // Update page block count
    setPages(prev => prev.map(p => 
      p.id === pageId ? { ...p, blocksCount: p.blocksCount + 1 } : p
    ));
    
    toast.success(`${blockLabel[type]} added`);
    return newBlock.id;
  }, [blocks]);

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(b => 
      b.id === id ? { ...b, ...updates } : b
    ));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    const block = blocks.find(b => b.id === id);
    if (!block) return;
    
    setBlocks(prev => prev.filter(b => b.id !== id));
    
    // Update page block count
    setPages(prev => prev.map(p => 
      p.id === block.pageId ? { ...p, blocksCount: Math.max(0, p.blocksCount - 1) } : p
    ));
    
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
    toast.success('Block deleted');
  }, [blocks, selectedBlockId]);

  const reorderBlocks = useCallback((pageId: string, orderedIds: string[]) => {
    setBlocks(prev => {
      const pageBlocks = prev.filter(b => b.pageId === pageId);
      const otherBlocks = prev.filter(b => b.pageId !== pageId);
      
      const reordered = orderedIds.map((id, index) => {
        const block = pageBlocks.find(b => b.id === id);
        return block ? { ...block, order: index + 1 } : null;
      }).filter(Boolean) as Block[];
      
      return [...otherBlocks, ...reordered];
    });
  }, []);

  const duplicateBlock = useCallback((id: string) => {
    const block = blocks.find(b => b.id === id);
    if (!block) return;
    
    const newBlock: Block = {
      ...block,
      id: generateId('blk'),
      title: `${block.title} (Copy)`,
      order: blocks.filter(b => b.pageId === block.pageId).length + 1,
      isCompleted: false,
    };
    
    setBlocks(prev => [...prev, newBlock]);
    
    // Update page block count
    setPages(prev => prev.map(p => 
      p.id === block.pageId ? { ...p, blocksCount: p.blocksCount + 1 } : p
    ));
    
    toast.success('Block duplicated');
  }, [blocks]);

  // Helpers
  const getPagesByChapter = useCallback((chapterId: string) => {
    return pages
      .filter(p => p.chapterId === chapterId)
      .sort((a, b) => a.order - b.order);
  }, [pages]);

  const getBlocksByPage = useCallback((pageId: string) => {
    return blocks
      .filter(b => b.pageId === pageId)
      .sort((a, b) => a.order - b.order);
  }, [blocks]);

  const getChaptersByCourse = useCallback((courseId: string) => {
    return chapters
      .filter(c => c.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }, [chapters]);

  return (
    <CourseBuilderContext.Provider
      value={{
        chapters,
        pages,
        blocks,
        selectedPageId,
        selectedBlockId,
        setSelectedPageId,
        setSelectedBlockId,
        addChapter,
        updateChapter,
        deleteChapter,
        reorderChapters,
        addPage,
        updatePage,
        deletePage,
        reorderPages,
        addBlock,
        updateBlock,
        deleteBlock,
        reorderBlocks,
        duplicateBlock,
        getPagesByChapter,
        getBlocksByPage,
        getChaptersByCourse,
      }}
    >
      {children}
    </CourseBuilderContext.Provider>
  );
}

export function useCourseBuilder() {
  const context = useContext(CourseBuilderContext);
  if (!context) {
    throw new Error('useCourseBuilder must be used within CourseBuilderProvider');
  }
  return context;
}

// Helper to get default content for different block types
function getDefaultContent(type: BlockType): any {
  switch (type) {
    case 'text':
      return { html: '<p>Enter your content here...</p>' };
    case 'video':
      return { url: '', duration: '0:00' };
    case 'image':
      return { url: '', alt: '', caption: '' };
    case 'micro-quiz':
      return { 
        questions: [
          {
            id: generateId('q'),
            question: 'Enter your question here',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
          }
        ]
      };
    case 'drag-drop-reorder':
      return {
        instruction: 'Drag and drop to reorder the steps:',
        items: ['Step 1', 'Step 2', 'Step 3'],
        correctOrder: [0, 1, 2],
      };
    case 'whiteboard':
      return { prompt: 'Show your work here:', allowImage: true };
    case 'reflection':
      return { prompt: 'Reflect on what you learned:', minWords: 50 };
    case 'qa-thread':
      return { allowAnonymous: true, questions: [] };
    case 'resource':
      return { url: '', fileName: '', fileSize: '' };
    case 'divider':
      return { style: 'line' };
    default:
      return {};
  }
}
