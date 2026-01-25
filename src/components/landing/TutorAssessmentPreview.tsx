import { useEffect, useRef, useState } from "react";
import { 
  CheckCircle,
  Circle,
  ToggleLeft,
  Type,
  ListChecks,
  GripVertical,
  MousePointer2,
} from "lucide-react";

export function TutorAssessmentPreview() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (hasAnimated || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
      
      if (isVisible && window.scrollY > 50) {
        setIsAnimating(true);
        setHasAnimated(true);
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
      <div className="absolute inset-3 bg-background rounded-lg shadow-lg border overflow-hidden flex flex-col anim-fade-in">
        {/* Status Bar */}
        <div className="h-8 bg-muted/50 border-b flex items-center px-3 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-background/80 rounded px-3 py-0.5 text-[10px] text-muted-foreground">
              app.learncampus.com/assessments/math-quiz
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="h-10 border-b flex items-center justify-between px-3 anim-header">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold">Mathematics Mid-Term Quiz</span>
            <span className="text-[8px] bg-muted px-1.5 py-0.5 rounded anim-count-badge">
              <span className="question-count">5</span> questions
            </span>
            <span className="text-[8px] bg-muted px-1.5 py-0.5 rounded anim-points-badge">
              <span className="points-count">40</span> pts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] bg-warning/10 text-warning px-1.5 py-0.5 rounded">Draft</span>
            <button className="text-[8px] bg-primary text-primary-foreground px-2 py-1 rounded">Publish</button>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Question List */}
          <div className="w-[140px] border-r bg-muted/20 p-2 anim-col-left">
            <p className="text-[9px] font-medium text-muted-foreground mb-2">Questions</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-background border text-[9px] anim-q-1">
                <Circle className="h-3 w-3 text-muted-foreground" />
                <span className="flex-1 truncate">Multiple-choice</span>
                <span className="text-[8px] text-muted-foreground">5pts</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-primary/10 border-primary/30 border text-[9px] anim-q-2">
                <ToggleLeft className="h-3 w-3 text-primary" />
                <span className="flex-1 truncate">True/False</span>
                <span className="text-[8px] text-muted-foreground">5pts</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-background border text-[9px] anim-q-3">
                <Type className="h-3 w-3 text-muted-foreground" />
                <span className="flex-1 truncate">Fill-blank</span>
                <span className="text-[8px] text-muted-foreground">10pts</span>
              </div>
              
              {/* New question that appears after drag */}
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-background border text-[9px] anim-new-question">
                <ListChecks className="h-3 w-3 text-success" />
                <span className="flex-1 truncate">Multiple-select</span>
                <span className="text-[8px] text-muted-foreground">10pts</span>
              </div>
            </div>
          </div>

          {/* Center: Question Editor */}
          <div className="flex-1 p-3 anim-col-center">
            <div className="bg-card rounded-md border p-3 h-full">
              <div className="flex items-center gap-2 mb-3">
                <ToggleLeft className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-medium">True/False Question</span>
              </div>
              
              <div className="mb-3">
                <label className="text-[9px] text-muted-foreground block mb-1">Question</label>
                <div className="bg-muted/50 rounded p-2 text-[10px] anim-question-text">
                  All quadrilaterals have exactly 4 sides.
                </div>
              </div>
              
              <div className="mb-3">
                <label className="text-[9px] text-muted-foreground block mb-1">Answer Options</label>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 p-2 rounded border bg-success/5 border-success/30 anim-opt-true">
                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                    <span className="text-[10px]">True</span>
                    <span className="text-[8px] text-success ml-auto">Correct</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded border anim-opt-false">
                    <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[10px]">False</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="anim-points-input">
                  <label className="text-[9px] text-muted-foreground block mb-1">Points</label>
                  <div className="bg-muted/50 rounded px-2 py-1 text-[10px] w-12 text-center">5</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Question Library */}
          <div className="w-[130px] border-l bg-muted/20 p-2 anim-col-right">
            <p className="text-[9px] font-medium text-muted-foreground mb-2">Question Types</p>
            <p className="text-[8px] text-muted-foreground mb-1.5">Auto-Graded</p>
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-1.5 p-1.5 rounded border bg-background text-[9px] cursor-grab anim-lib-1">
                <GripVertical className="h-3 w-3 text-muted-foreground" />
                <Circle className="h-3 w-3 text-muted-foreground" />
                <span>Multiple-choice</span>
              </div>
              
              {/* Dragging element */}
              <div className="flex items-center gap-1.5 p-1.5 rounded border bg-background text-[9px] cursor-grab anim-lib-drag relative">
                <GripVertical className="h-3 w-3 text-muted-foreground" />
                <ListChecks className="h-3 w-3 text-muted-foreground" />
                <span>Multiple-select</span>
                
                {/* Cursor */}
                <div className="absolute anim-cursor">
                  <MousePointer2 className="h-4 w-4 text-foreground drop-shadow-md" />
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 p-1.5 rounded border bg-background text-[9px] cursor-grab anim-lib-3">
                <GripVertical className="h-3 w-3 text-muted-foreground" />
                <ToggleLeft className="h-3 w-3 text-muted-foreground" />
                <span>True/False</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tutor-preview-container.paused * {
          animation-play-state: paused !important;
          opacity: 0;
        }
        .tutor-preview-container.paused .anim-fade-in {
          opacity: 1;
        }
        
        .tutor-preview-container.animate .anim-fade-in {
          animation: tutor-fade-in 0.4s ease-out forwards;
        }
        .tutor-preview-container.animate .anim-header {
          animation: tutor-slide-down 0.3s ease-out 0.3s forwards;
        }
        
        .tutor-preview-container.animate .anim-col-left {
          animation: tutor-slide-right 0.3s ease-out 0.5s forwards;
        }
        .tutor-preview-container.animate .anim-col-center {
          animation: tutor-fade-in 0.3s ease-out 0.7s forwards;
        }
        .tutor-preview-container.animate .anim-col-right {
          animation: tutor-slide-left 0.3s ease-out 0.5s forwards;
        }
        
        .tutor-preview-container.animate .anim-q-1 {
          animation: tutor-fade-in 0.2s ease-out 0.8s forwards;
        }
        .tutor-preview-container.animate .anim-q-2 {
          animation: tutor-fade-in 0.2s ease-out 1s forwards;
        }
        .tutor-preview-container.animate .anim-q-3 {
          animation: tutor-fade-in 0.2s ease-out 1.2s forwards;
        }
        
        .tutor-preview-container.animate .anim-question-text {
          animation: tutor-fade-in 0.3s ease-out 1.4s forwards;
        }
        .tutor-preview-container.animate .anim-opt-true {
          animation: tutor-fade-in 0.2s ease-out 1.6s forwards;
        }
        .tutor-preview-container.animate .anim-opt-false {
          animation: tutor-fade-in 0.2s ease-out 1.8s forwards;
        }
        .tutor-preview-container.animate .anim-points-input {
          animation: tutor-fade-in 0.2s ease-out 2s forwards;
        }
        
        .tutor-preview-container.animate .anim-lib-1 {
          animation: tutor-fade-in 0.2s ease-out 0.9s forwards;
        }
        .tutor-preview-container.animate .anim-lib-drag {
          animation: tutor-fade-in 0.2s ease-out 1.1s forwards, tutor-drag-lift 0.3s ease-out 2.5s forwards, tutor-drag-move 0.8s ease-in-out 2.8s forwards, tutor-drag-fade 0.3s ease-out 3.6s forwards;
        }
        .tutor-preview-container.animate .anim-lib-3 {
          animation: tutor-fade-in 0.2s ease-out 1.3s forwards;
        }
        
        .tutor-preview-container.animate .anim-cursor {
          animation: tutor-cursor-appear 0.3s ease-out 2.3s forwards, tutor-cursor-move 0.8s ease-in-out 2.8s forwards;
        }
        
        .tutor-preview-container.animate .anim-new-question {
          animation: tutor-new-item 0.4s ease-out 3.8s forwards;
        }
        
        .tutor-preview-container.animate .anim-count-badge .question-count {
          animation: tutor-text-update 0.1s step-end 4.2s forwards;
        }
        .tutor-preview-container.animate .anim-points-badge .points-count {
          animation: tutor-points-update 0.1s step-end 4.2s forwards;
        }
        
        .anim-cursor {
          opacity: 0;
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .anim-new-question {
          opacity: 0;
          height: 0;
          padding: 0;
          margin: 0;
          overflow: hidden;
        }
        
        @keyframes tutor-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes tutor-slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes tutor-slide-right {
          from { opacity: 0; transform: translateX(-15px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes tutor-slide-left {
          from { opacity: 0; transform: translateX(15px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes tutor-drag-lift {
          from { 
            transform: translateY(0); 
            box-shadow: none;
            z-index: 1;
          }
          to { 
            transform: translateY(-3px); 
            box-shadow: 0 8px 20px -4px rgba(0,0,0,0.2);
            z-index: 50;
          }
        }
        
        @keyframes tutor-drag-move {
          0% { 
            transform: translateY(-3px) translateX(0); 
          }
          100% { 
            transform: translateY(-3px) translateX(-180px); 
          }
        }
        
        @keyframes tutor-drag-fade {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes tutor-cursor-appear {
          from { opacity: 0; transform: translateY(-50%) scale(0.8); }
          to { opacity: 1; transform: translateY(-50%) scale(1); }
        }
        
        @keyframes tutor-cursor-move {
          0% { 
            transform: translateY(-50%) translateX(0); 
          }
          100% { 
            transform: translateY(-50%) translateX(-180px);
          }
        }
        
        @keyframes tutor-new-item {
          0% { 
            opacity: 0; 
            height: 0; 
            padding: 0;
            margin: 0;
          }
          50% {
            opacity: 0;
            height: 28px;
            padding: 6px;
            margin-top: 6px;
          }
          100% { 
            opacity: 1; 
            height: 28px;
            padding: 6px;
            margin-top: 6px;
            background: hsl(var(--success) / 0.1);
            border-color: hsl(var(--success) / 0.3);
          }
        }
        
        @keyframes tutor-text-update {
          from { content: '5'; }
          to { content: '6'; }
        }
        
        @keyframes tutor-points-update {
          from { content: '40'; }
          to { content: '50'; }
        }
        
        .tutor-preview-container.animate .question-count::after {
          content: '5';
          animation: none;
        }
        .tutor-preview-container.animate .question-count {
          display: none;
        }
        .tutor-preview-container.animate .anim-count-badge::after {
          content: '5 questions';
          animation: tutor-count-text 0.1s step-end 4.2s forwards;
        }
        .tutor-preview-container.animate .anim-count-badge > .question-count {
          display: inline;
        }
        
        .tutor-preview-container.animate .anim-points-badge::after {
          content: '';
        }
      `}</style>
    </div>
  );
}
