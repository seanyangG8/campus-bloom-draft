import { useEffect, useRef, useState, useCallback } from "react";
import { 
  CheckCircle2,
  Circle,
  GripVertical,
  SquareCheck,
  ToggleLeft,
  Type,
  ListOrdered,
  Plus,
} from "lucide-react";

const QUESTION_TEXT = "Select all the prime numbers:";

export function TutorAssessmentPreview() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [showNewEditor, setShowNewEditor] = useState(false);
  const [editorStage, setEditorStage] = useState(0);
  
  // Typing animation state
  const [typedText, setTypedText] = useState("");
  const [showCaret, setShowCaret] = useState(false);
  
  // Drag animation state (percentage-based for responsiveness)
  const [dragPhase, setDragPhase] = useState<"idle" | "appearing" | "moving" | "dropped">("idle");
  
  // Selection click cursor state
  const [selectionPhase, setSelectionPhase] = useState<"idle" | "moving1" | "click1" | "moving2" | "click2" | "done">("idle");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Add timeout with tracking
  const addTimeout = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // Typing effect
  useEffect(() => {
    if (editorStage === 2 && typedText === "") {
      setShowCaret(true);
      let charIndex = 0;
      intervalRef.current = setInterval(() => {
        charIndex++;
        setTypedText(QUESTION_TEXT.substring(0, charIndex));
        if (charIndex >= QUESTION_TEXT.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          // Keep caret blinking for a moment then hide
          addTimeout(() => setShowCaret(false), 600);
        }
      }, 70); // Slower typing speed
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [editorStage, typedText, addTimeout]);

  useEffect(() => {
    const handleScroll = () => {
      if (hasAnimated || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
      
      if (isVisible && window.scrollY > 50) {
        setIsAnimating(true);
        setHasAnimated(true);
        
        // Phase 1: Drag animation
        addTimeout(() => setDragPhase("appearing"), 600);
        addTimeout(() => setDragPhase("moving"), 1000);
        addTimeout(() => setDragPhase("dropped"), 2400);
        
        // Show new question after drag animation completes
        addTimeout(() => setShowNewQuestion(true), 2600);
        
        // Update editor to show new question type with progressive reveal
        addTimeout(() => {
          setShowNewEditor(true);
          // Progressive editor build-out - much slower pacing
          addTimeout(() => setEditorStage(1), 100);     // Header
          addTimeout(() => setEditorStage(2), 400);     // Start typing
          addTimeout(() => setEditorStage(3), 2800);    // Option 1 (after typing done ~2.2s)
          addTimeout(() => setEditorStage(4), 3500);    // Option 2
          addTimeout(() => setEditorStage(5), 4200);    // Option 3
          addTimeout(() => setEditorStage(6), 4900);    // Option 4
          addTimeout(() => setEditorStage(7), 5700);    // Points input
          addTimeout(() => setEditorStage(8), 6400);    // Add option button
          
          // Phase 2: Selection animation (separate, clear phase)
          addTimeout(() => {
            setSelectionPhase("moving1");
          }, 7200);
          addTimeout(() => {
            setSelectionPhase("click1");
            setEditorStage(9); // Select first correct answer
          }, 7800);
          addTimeout(() => {
            setSelectionPhase("moving2");
          }, 8400);
          addTimeout(() => {
            setSelectionPhase("click2");
            setEditorStage(10); // Select second correct answer
          }, 9000);
          addTimeout(() => {
            setSelectionPhase("done");
          }, 9600);
        }, 2800);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearAllTimeouts();
    };
  }, [hasAnimated, addTimeout, clearAllTimeouts]);

  return (
    <div 
      ref={containerRef}
      className={`tutor-preview-container relative w-full h-full bg-gradient-to-br from-muted/30 to-muted/50 overflow-hidden ${isAnimating ? 'animate' : 'paused'}`}
    >
      {/* Browser Chrome - Always visible, entire UI static from start */}
      <div className="absolute inset-3 bg-background rounded-lg shadow-lg border overflow-hidden flex flex-col">
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
        <div className="px-3 py-2 border-b flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Chapter 5 Quiz</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[9px] text-muted-foreground anim-count ${showNewQuestion ? 'updated' : ''}`}>
                {showNewQuestion ? '4' : '3'} questions
              </span>
              <span className="text-[9px] text-muted-foreground">•</span>
              <span className={`text-[9px] text-muted-foreground anim-count ${showNewQuestion ? 'updated' : ''}`}>
                {showNewQuestion ? '35' : '25'} pts
              </span>
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="px-2 py-1 bg-muted text-muted-foreground rounded text-[9px]">Preview</div>
            <div className="px-2 py-1 bg-primary text-primary-foreground rounded text-[9px]">Publish</div>
          </div>
        </div>

        {/* 3-Column Layout - Entirely visible from start */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left: Question List */}
          <div className="w-[140px] border-r p-2 bg-muted/20 relative">
            <p className="text-[9px] font-medium text-muted-foreground mb-2">Questions</p>
            
            <div className="space-y-1">
              <div className={`flex items-center gap-1.5 p-1.5 rounded border text-[9px] ${!showNewEditor ? 'bg-primary/10 border-primary/30' : 'bg-background'}`}>
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
              
              {/* New Question - expands after drop */}
              <div className={`anim-new-question flex items-center gap-1.5 p-1.5 rounded border text-[9px] ${showNewQuestion ? 'bg-primary/10 border-primary/30' : 'bg-background'}`}>
                <GripVertical className="h-2.5 w-2.5 text-muted-foreground" />
                <SquareCheck className="h-2.5 w-2.5 text-success" />
                <span className="flex-1 truncate">Multi-select</span>
                <span className="text-[8px] text-muted-foreground">10</span>
              </div>
            </div>
          </div>

          {/* Center: Question Editor */}
          <div className="flex-1 p-3 relative">
            {/* Drop Zone Highlight */}
            <div className={`anim-drop-zone absolute inset-3 rounded-lg pointer-events-none ${dragPhase === "moving" ? "active" : ""} ${dragPhase === "dropped" ? "success" : ""}`} />
            
            <div className={`anim-editor bg-card rounded-lg border p-3 transition-all duration-300 relative ${showNewEditor ? 'ring-2 ring-primary/20' : ''}`}>
              {showNewEditor ? (
                // New Multi-select question editor with progressive reveal
                <>
                  <div className={`flex items-center gap-2 mb-3 anim-editor-item ${editorStage >= 1 ? 'visible' : ''}`}>
                    <SquareCheck className="h-4 w-4 text-success" />
                    <span className="text-[10px] font-medium">Multi-select</span>
                    <span className="ml-auto text-[9px] text-muted-foreground">10 points</span>
                  </div>
                  
                  <div className={`mb-3 anim-editor-item ${editorStage >= 2 ? 'visible' : ''}`}>
                    <p className="text-[11px] font-medium mb-2">
                      {typedText}
                      {showCaret && <span className="anim-caret">|</span>}
                    </p>
                  </div>
                  
                  <div className="space-y-1.5 mb-3">
                    {/* Option 1: "2" - initially unchecked, becomes correct at stage 9 */}
                    <div 
                      className={`flex items-center gap-2 p-2 rounded border anim-editor-item anim-option ${editorStage >= 3 ? 'visible' : ''} ${editorStage >= 9 ? 'selected' : ''}`}
                      data-option="1"
                    >
                      {editorStage >= 9 ? (
                        <SquareCheck className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded border border-muted-foreground" />
                      )}
                      <span className="text-[10px]">2</span>
                      {editorStage >= 9 && <span className="ml-auto text-[8px] text-success">Correct</span>}
                    </div>
                    {/* Option 2: "4" - always unchecked */}
                    <div className={`flex items-center gap-2 p-2 rounded border anim-editor-item ${editorStage >= 4 ? 'visible' : ''}`}>
                      <div className="h-3.5 w-3.5 rounded border border-muted-foreground" />
                      <span className="text-[10px]">4</span>
                    </div>
                    {/* Option 3: "7" - initially unchecked, becomes correct at stage 10 */}
                    <div 
                      className={`flex items-center gap-2 p-2 rounded border anim-editor-item anim-option ${editorStage >= 5 ? 'visible' : ''} ${editorStage >= 10 ? 'selected' : ''}`}
                      data-option="3"
                    >
                      {editorStage >= 10 ? (
                        <SquareCheck className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded border border-muted-foreground" />
                      )}
                      <span className="text-[10px]">7</span>
                      {editorStage >= 10 && <span className="ml-auto text-[8px] text-success">Correct</span>}
                    </div>
                    {/* Option 4: "9" - always unchecked */}
                    <div className={`flex items-center gap-2 p-2 rounded border anim-editor-item ${editorStage >= 6 ? 'visible' : ''}`}>
                      <div className="h-3.5 w-3.5 rounded border border-muted-foreground" />
                      <span className="text-[10px]">9</span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 pt-2 border-t anim-editor-item ${editorStage >= 7 ? 'visible' : ''}`}>
                    <span className="text-[9px] text-muted-foreground">Points:</span>
                    <div className="w-12 h-6 rounded border bg-background flex items-center justify-center text-[10px]">10</div>
                  </div>
                  
                  {/* Add Option Button */}
                  <div className={`flex items-center gap-1.5 mt-3 anim-editor-item anim-add-option ${editorStage >= 8 ? 'visible' : ''}`}>
                    <button className="flex items-center gap-1 px-2 py-1 rounded border border-dashed border-muted-foreground/50 text-[9px] text-muted-foreground">
                      <Plus className="h-3 w-3" />
                      Add option
                    </button>
                  </div>
                </>
              ) : (
                // Original True/False question editor
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Right: Question Library */}
          <div className="w-[130px] border-l p-2 bg-muted/20 relative">
            <p className="text-[9px] font-medium text-muted-foreground mb-1.5">Question Types</p>
            <p className="text-[8px] text-muted-foreground mb-2 anim-drag-hint">Drag to add</p>
            
            <div className="space-y-1">
              <div className="text-[8px] text-muted-foreground mb-1">Auto-Graded</div>
              <div className="flex items-center gap-1.5 p-1.5 rounded border bg-background text-[9px]">
                <Circle className="h-2.5 w-2.5 text-muted-foreground" />
                <span>Multiple choice</span>
              </div>
              
              {/* Multi-select - the dragged item */}
              <div className={`anim-drag-source flex items-center gap-1.5 p-1.5 rounded border bg-background text-[9px] relative ${dragPhase !== "idle" && dragPhase !== "dropped" ? "dimmed" : ""}`}>
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
          </div>

          {/* OVERLAY LAYER - Cursor and Ghost that move across entire preview */}
          <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 100 }}>
            {/* Drag Cursor */}
            <div 
              className={`anim-cursor absolute w-7 h-7 ${dragPhase}`}
              style={{
                transition: dragPhase === "moving" ? "left 1.2s cubic-bezier(0.4, 0, 0.2, 1), top 1.2s cubic-bezier(0.4, 0, 0.2, 1)" : "none"
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-lg">
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.85a.5.5 0 0 0-.85.36Z" fill="white" stroke="black" strokeWidth="1.5"/>
              </svg>
            </div>
            
            {/* Drag Ghost */}
            <div 
              className={`anim-drag-ghost absolute flex items-center gap-1.5 p-1.5 rounded border-2 border-primary bg-primary/10 text-[9px] shadow-lg whitespace-nowrap ${dragPhase}`}
              style={{
                transition: dragPhase === "moving" ? "left 1.2s cubic-bezier(0.4, 0, 0.2, 1), top 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease" : "opacity 0.2s ease"
              }}
            >
              <SquareCheck className="h-2.5 w-2.5 text-primary" />
              <span className="font-medium">Multi-select</span>
            </div>
            
            {/* Selection Click Cursor */}
            <div 
              className={`anim-click-cursor absolute w-6 h-6 ${selectionPhase}`}
              style={{
                transition: selectionPhase.startsWith("moving") ? "left 0.5s cubic-bezier(0.4, 0, 0.2, 1), top 0.5s cubic-bezier(0.4, 0, 0.2, 1)" : "none"
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-md">
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.85a.5.5 0 0 0-.85.36Z" fill="white" stroke="black" strokeWidth="1.5"/>
              </svg>
              {/* Click ripple */}
              <div className="click-ripple absolute inset-0 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Drag source dims during drag */
        .anim-drag-source.dimmed {
          opacity: 0.3;
        }
        
        /* DRAG CURSOR STATES - positions relative to the 3-column area */
        .anim-cursor {
          opacity: 0;
          /* Start position: right side library area */
          right: 20px;
          top: 75px;
        }
        
        .anim-cursor.appearing {
          opacity: 1;
          right: 20px;
          top: 75px;
          animation: cursor-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .anim-cursor.moving {
          opacity: 1;
          /* End position: center of editor area (roughly 50% from left, offset for sidebar) */
          left: calc(50% - 40px);
          top: 110px;
          right: auto;
        }
        
        .anim-cursor.dropped {
          opacity: 0;
          left: calc(50% - 40px);
          top: 110px;
          right: auto;
        }
        
        @keyframes cursor-pop {
          from { opacity: 0; transform: scale(0.6); }
          to { opacity: 1; transform: scale(1); }
        }
        
        /* DRAG GHOST STATES */
        .anim-drag-ghost {
          opacity: 0;
          right: 15px;
          top: 70px;
        }
        
        .anim-drag-ghost.appearing {
          opacity: 0.95;
          right: 15px;
          top: 70px;
          animation: ghost-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .anim-drag-ghost.moving {
          opacity: 0.95;
          left: calc(50% - 60px);
          top: 105px;
          right: auto;
        }
        
        .anim-drag-ghost.dropped {
          opacity: 0;
          left: calc(50% - 60px);
          top: 105px;
          right: auto;
          transform: scale(0.9);
        }
        
        @keyframes ghost-pop {
          from { opacity: 0; transform: scale(0.9) rotate(-2deg); }
          to { opacity: 0.95; transform: scale(1) rotate(0deg); }
        }
        
        /* DROP ZONE */
        .anim-drop-zone {
          border: 2px dashed transparent;
          background: transparent;
          transition: all 0.3s ease;
        }
        
        .anim-drop-zone.active {
          border: 3px dashed hsl(var(--primary));
          background: hsl(var(--primary) / 0.08);
          box-shadow: 0 0 20px hsl(var(--primary) / 0.15);
        }
        
        .anim-drop-zone.success {
          border: 3px solid hsl(var(--success));
          background: hsl(var(--success) / 0.1);
          box-shadow: 0 0 30px hsl(var(--success) / 0.2);
          animation: drop-success 0.4s ease-out forwards;
        }
        
        @keyframes drop-success {
          0% { border: 3px solid hsl(var(--success)); background: hsl(var(--success) / 0.15); }
          100% { border: 2px dashed transparent; background: transparent; box-shadow: none; }
        }
        
        /* CLICK CURSOR FOR SELECTIONS */
        .anim-click-cursor {
          opacity: 0;
          /* Start hidden */
          left: calc(50% - 80px);
          top: 140px;
        }
        
        .anim-click-cursor.moving1 {
          opacity: 1;
          left: 170px;
          top: 140px;
        }
        
        .anim-click-cursor.click1 {
          opacity: 1;
          left: 170px;
          top: 140px;
        }
        
        .anim-click-cursor.click1 .click-ripple {
          animation: click-ring 0.4s ease-out;
        }
        
        .anim-click-cursor.moving2 {
          opacity: 1;
          left: 170px;
          top: 200px;
        }
        
        .anim-click-cursor.click2 {
          opacity: 1;
          left: 170px;
          top: 200px;
        }
        
        .anim-click-cursor.click2 .click-ripple {
          animation: click-ring 0.4s ease-out;
        }
        
        .anim-click-cursor.done {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        @keyframes click-ring {
          0% { 
            box-shadow: 0 0 0 0 hsl(var(--success) / 0.6);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 0 12px hsl(var(--success) / 0);
            transform: scale(0.95);
          }
          100% { 
            box-shadow: 0 0 0 0 hsl(var(--success) / 0);
            transform: scale(1);
          }
        }
        
        /* New question expands after drop */
        .anim-new-question {
          opacity: 0;
          max-height: 0;
          padding-top: 0;
          padding-bottom: 0;
          margin: 0;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .tutor-preview-container.animate .anim-new-question {
          opacity: 1;
          max-height: 36px;
          padding-top: 6px;
          padding-bottom: 6px;
          margin-top: 4px;
        }
        
        /* Count badges pulse when updating */
        .anim-count.updated {
          animation: count-pulse 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes count-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); color: hsl(var(--success)); }
          100% { transform: scale(1); }
        }
        
        /* Progressive editor item reveal */
        .anim-editor-item {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.35s ease-out, transform 0.35s ease-out;
        }
        
        .anim-editor-item.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Typing caret */
        .anim-caret {
          color: hsl(var(--primary));
          animation: blink-caret 0.5s step-end infinite;
          margin-left: 1px;
        }
        
        @keyframes blink-caret {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
        
        /* Add option button special animation */
        .anim-add-option.visible {
          animation: add-option-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        @keyframes add-option-pop {
          0% { opacity: 0; transform: translateY(8px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        /* Option selection animation */
        .anim-option.selected {
          animation: option-select 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          background: hsl(var(--success) / 0.05);
          border-color: hsl(var(--success) / 0.3);
        }
        
        @keyframes option-select {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); box-shadow: 0 0 0 3px hsl(var(--success) / 0.2); }
          100% { transform: scale(1); box-shadow: none; }
        }
        
        /* Drag hint pulse */
        .tutor-preview-container.animate .anim-drag-hint {
          animation: hint-pulse 0.6s ease-in-out 0.3s;
        }
        
        @keyframes hint-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; color: hsl(var(--primary)); }
        }
      `}</style>
    </div>
  );
}
