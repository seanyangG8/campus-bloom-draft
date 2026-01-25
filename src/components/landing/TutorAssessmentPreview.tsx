import { useEffect, useRef, useState } from "react";
import { 
  CheckCircle2,
  Circle,
  GripVertical,
  SquareCheck,
  ToggleLeft,
  Type,
  ListOrdered,
} from "lucide-react";

export function TutorAssessmentPreview() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (hasAnimated || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
      
      if (isVisible && window.scrollY > 50) {
        setIsAnimating(true);
        setHasAnimated(true);
        
        // Show new question after drag animation completes
        setTimeout(() => {
          setShowNewQuestion(true);
        }, 2800);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated]);

  return (
    <div 
      ref={containerRef}
      className={`tutor-preview-container relative w-full h-full bg-gradient-to-br from-muted/30 to-muted/50 overflow-hidden ${isAnimating ? 'animate' : 'paused'}`}
    >
      {/* Browser Chrome */}
      <div className="absolute inset-3 bg-background rounded-lg shadow-lg border overflow-hidden flex flex-col anim-chrome">
        {/* Status Bar */}
        <div className="h-8 bg-muted/50 border-b flex items-center px-3 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-background/80 rounded px-3 py-0.5 text-[10px] text-muted-foreground">
              app.learncampus.com/assessments/new
            </div>
          </div>
        </div>

        {/* Assessment Builder Header */}
        <div className="px-3 py-2 border-b flex items-center justify-between anim-section-header">
          <div>
            <h2 className="text-sm font-semibold">Chapter 5 Quiz</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] text-muted-foreground anim-question-count">
                {showNewQuestion ? '6' : '5'} questions
              </span>
              <span className="text-[9px] text-muted-foreground">•</span>
              <span className="text-[9px] text-muted-foreground anim-points-count">
                {showNewQuestion ? '50' : '40'} pts
              </span>
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="px-2 py-1 bg-muted text-muted-foreground rounded text-[9px]">Preview</div>
            <div className="px-2 py-1 bg-primary text-primary-foreground rounded text-[9px]">Publish</div>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="flex-1 flex overflow-hidden anim-section-content">
          {/* Left: Question List */}
          <div className="w-[140px] border-r p-2 bg-muted/20">
            <p className="text-[9px] font-medium text-muted-foreground mb-2">Questions</p>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-background border text-[9px]">
                <GripVertical className="h-2.5 w-2.5 text-muted-foreground" />
                <Circle className="h-2.5 w-2.5 text-primary" />
                <span className="flex-1 truncate">Multiple choice</span>
                <span className="text-[8px] text-muted-foreground">5</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-primary/10 border-primary/30 border text-[9px]">
                <GripVertical className="h-2.5 w-2.5 text-muted-foreground" />
                <ToggleLeft className="h-2.5 w-2.5 text-primary" />
                <span className="flex-1 truncate">True / False</span>
                <span className="text-[8px] text-muted-foreground">5</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-background border text-[9px]">
                <GripVertical className="h-2.5 w-2.5 text-muted-foreground" />
                <Type className="h-2.5 w-2.5 text-primary" />
                <span className="flex-1 truncate">Fill in blank</span>
                <span className="text-[8px] text-muted-foreground">10</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-background border text-[9px]">
                <GripVertical className="h-2.5 w-2.5 text-muted-foreground" />
                <ListOrdered className="h-2.5 w-2.5 text-primary" />
                <span className="flex-1 truncate">Ordering</span>
                <span className="text-[8px] text-muted-foreground">10</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-background border text-[9px]">
                <GripVertical className="h-2.5 w-2.5 text-muted-foreground" />
                <Circle className="h-2.5 w-2.5 text-primary" />
                <span className="flex-1 truncate">Multiple choice</span>
                <span className="text-[8px] text-muted-foreground">10</span>
              </div>
              
              {/* New Question - appears after drag */}
              <div className={`anim-new-question flex items-center gap-1.5 p-1.5 rounded border text-[9px] ${showNewQuestion ? 'bg-success/10 border-success/30' : ''}`}>
                <GripVertical className="h-2.5 w-2.5 text-muted-foreground" />
                <SquareCheck className="h-2.5 w-2.5 text-success" />
                <span className="flex-1 truncate">Multi-select</span>
                <span className="text-[8px] text-muted-foreground">10</span>
              </div>
            </div>
          </div>

          {/* Center: Question Editor */}
          <div className="flex-1 p-3">
            <div className="bg-card rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-3">
                <ToggleLeft className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-medium">True / False</span>
                <span className="ml-auto text-[9px] text-muted-foreground">5 points</span>
              </div>
              
              <div className="mb-3">
                <p className="text-[11px] font-medium mb-2">All quadrilaterals have exactly 4 sides.</p>
              </div>
              
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 p-2 rounded border bg-success/5 border-success/30">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  <span className="text-[10px]">True</span>
                  <span className="ml-auto text-[8px] text-success">Correct</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded border">
                  <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px]">False</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2 border-t">
                <span className="text-[9px] text-muted-foreground">Points:</span>
                <div className="w-12 h-6 rounded border bg-background flex items-center justify-center text-[10px]">5</div>
              </div>
            </div>
          </div>

          {/* Right: Question Library */}
          <div className="w-[130px] border-l p-2 bg-muted/20 relative">
            <p className="text-[9px] font-medium text-muted-foreground mb-1.5">Question Types</p>
            <p className="text-[8px] text-muted-foreground mb-2">Drag to add</p>
            
            {/* Drop Zone Highlight */}
            <div className="anim-drop-zone absolute -left-[144px] top-[70px] w-[136px] h-[100px] rounded-lg pointer-events-none" />
            
            <div className="space-y-1">
              <div className="text-[8px] text-muted-foreground mb-1">Auto-Graded</div>
              <div className="flex items-center gap-1.5 p-1.5 rounded border bg-background text-[9px]">
                <Circle className="h-2.5 w-2.5 text-muted-foreground" />
                <span>Multiple choice</span>
              </div>
              
              {/* Multi-select - the dragged item */}
              <div className="anim-drag-source flex items-center gap-1.5 p-1.5 rounded border bg-background text-[9px] relative">
                <SquareCheck className="h-2.5 w-2.5 text-muted-foreground" />
                <span>Multi-select</span>
              </div>
              
              <div className="flex items-center gap-1.5 p-1.5 rounded border bg-background text-[9px]">
                <ToggleLeft className="h-2.5 w-2.5 text-muted-foreground" />
                <span>True / False</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded border bg-background text-[9px]">
                <Type className="h-2.5 w-2.5 text-muted-foreground" />
                <span>Fill in blank</span>
              </div>
            </div>
            
            {/* Dragging Ghost Element */}
            <div className="anim-drag-ghost absolute flex items-center gap-1.5 p-1.5 rounded border-2 border-primary bg-primary/10 text-[9px] shadow-lg pointer-events-none">
              <SquareCheck className="h-2.5 w-2.5 text-primary" />
              <span className="font-medium">Multi-select</span>
            </div>
            
            {/* Cursor */}
            <div className="anim-cursor absolute w-4 h-4 pointer-events-none">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-md">
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.85a.5.5 0 0 0-.85.36Z" fill="white" stroke="black" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tutor-preview-container.paused .anim-chrome,
        .tutor-preview-container.paused .anim-section-header,
        .tutor-preview-container.paused .anim-section-content {
          opacity: 0;
        }
        
        .tutor-preview-container.paused .anim-cursor,
        .tutor-preview-container.paused .anim-drag-ghost,
        .tutor-preview-container.paused .anim-new-question {
          opacity: 0;
        }
        
        .tutor-preview-container.paused .anim-drop-zone {
          opacity: 0;
        }
        
        /* Chrome and content fade in together */
        .tutor-preview-container.animate .anim-chrome {
          animation: tutor-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .tutor-preview-container.animate .anim-section-header {
          animation: tutor-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
        }
        
        .tutor-preview-container.animate .anim-section-content {
          animation: tutor-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
        }
        
        /* Cursor appears and moves to multi-select */
        .tutor-preview-container.animate .anim-cursor {
          opacity: 0;
          right: 8px;
          top: 95px;
          animation: 
            tutor-cursor-appear 0.3s cubic-bezier(0.16, 1, 0.3, 1) 1s forwards,
            tutor-cursor-move 1.2s cubic-bezier(0.4, 0, 0.2, 1) 1.6s forwards;
        }
        
        /* Ghost appears when drag starts */
        .tutor-preview-container.animate .anim-drag-ghost {
          opacity: 0;
          right: 8px;
          top: 90px;
          animation: 
            tutor-ghost-appear 0.2s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards,
            tutor-ghost-move 1.2s cubic-bezier(0.4, 0, 0.2, 1) 1.6s forwards;
        }
        
        /* Drop zone highlight during drag */
        .tutor-preview-container.animate .anim-drop-zone {
          animation: tutor-drop-zone 1.2s ease-in-out 1.6s forwards;
        }
        
        /* Source item dims during drag */
        .tutor-preview-container.animate .anim-drag-source {
          animation: tutor-source-dim 0.2s ease-out 1.5s forwards;
        }
        
        /* New question appears after drop */
        .tutor-preview-container.animate .anim-new-question {
          opacity: 0;
          max-height: 0;
          padding: 0;
          margin: 0;
          overflow: hidden;
          animation: tutor-new-question 0.4s cubic-bezier(0.16, 1, 0.3, 1) 2.8s forwards;
        }
        
        @keyframes tutor-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes tutor-cursor-appear {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes tutor-cursor-move {
          0% { right: 8px; top: 95px; }
          30% { right: 8px; top: 95px; }
          100% { right: 160px; top: 170px; }
        }
        
        @keyframes tutor-ghost-appear {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 0.9; transform: scale(1.02); }
        }
        
        @keyframes tutor-ghost-move {
          0% { right: 8px; top: 90px; opacity: 0.9; }
          30% { right: 8px; top: 90px; opacity: 0.9; }
          90% { right: 160px; top: 165px; opacity: 0.9; }
          100% { right: 160px; top: 165px; opacity: 0; }
        }
        
        @keyframes tutor-drop-zone {
          0% { opacity: 0; border: 2px dashed transparent; background: transparent; }
          20% { opacity: 1; border: 2px dashed hsl(var(--primary)); background: hsl(var(--primary) / 0.05); }
          80% { opacity: 1; border: 2px dashed hsl(var(--primary)); background: hsl(var(--primary) / 0.05); }
          100% { opacity: 0; border: 2px dashed transparent; background: transparent; }
        }
        
        @keyframes tutor-source-dim {
          from { opacity: 1; }
          to { opacity: 0.4; }
        }
        
        @keyframes tutor-new-question {
          from { 
            opacity: 0; 
            max-height: 0; 
            padding: 0 6px; 
            margin: 0;
          }
          to { 
            opacity: 1; 
            max-height: 32px; 
            padding: 6px; 
            margin-top: 4px;
          }
        }
      `}</style>
    </div>
  );
}
