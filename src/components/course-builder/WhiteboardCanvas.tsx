import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { 
  Pencil, 
  Eraser, 
  Undo2, 
  Redo2, 
  Trash2, 
  Check,
  Palette,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  size: number;
  tool: 'pen' | 'eraser';
}

interface WhiteboardCanvasProps {
  blockId: string;
  canvasSize?: 'a4' | 'square' | 'wide';
  background?: 'blank' | 'grid' | 'ruled';
  enabledTools?: {
    pen?: boolean;
    highlighter?: boolean;
    eraser?: boolean;
    shapes?: boolean;
    text?: boolean;
    undo?: boolean;
  };
  multiPage?: boolean;
  onSubmit: (data: { pngDataUrl: string; strokesJson: string; pageCount: number }) => void;
  disabled?: boolean;
}

const COLORS = [
  '#000000', '#374151', '#dc2626', '#ea580c', '#ca8a04', 
  '#16a34a', '#0891b2', '#2563eb', '#7c3aed', '#db2777'
];

export function WhiteboardCanvas({
  blockId,
  canvasSize = 'a4',
  background = 'blank',
  enabledTools = { pen: true, eraser: true, undo: true },
  multiPage = false,
  onSubmit,
  disabled = false,
}: WhiteboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Multi-page state
  const [pages, setPages] = useState<Stroke[][]>([[]]);
  const [currentPage, setCurrentPage] = useState(0);
  
  // History for undo/redo
  const [history, setHistory] = useState<Stroke[][][]>([[[]]]); 
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Current stroke being drawn
  const currentStrokeRef = useRef<Stroke | null>(null);
  
  // Get canvas dimensions based on size
  const getDimensions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return { width: 400, height: 400 };
    
    const containerWidth = container.clientWidth - 32; // padding
    let ratio = 1;
    
    switch (canvasSize) {
      case 'a4':
        ratio = 1.4142; // A4 ratio (height/width)
        break;
      case 'square':
        ratio = 1;
        break;
      case 'wide':
        ratio = 9 / 16; // 16:9 landscape
        break;
    }
    
    const width = Math.min(containerWidth, 600);
    const height = width * ratio;
    
    return { width, height: Math.min(height, 500) };
  }, [canvasSize]);

  // Draw background
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    if (background === 'grid') {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      const gridSize = 20;
      
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (background === 'ruled') {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      const lineHeight = 24;
      
      for (let y = lineHeight; y <= height; y += lineHeight) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
  }, [background]);

  // Redraw canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = getDimensions();
    canvas.width = width;
    canvas.height = height;
    
    drawBackground(ctx, width, height);
    
    // Draw all strokes for current page
    const currentStrokes = pages[currentPage] || [];
    currentStrokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      
      ctx.beginPath();
      ctx.strokeStyle = stroke.tool === 'eraser' ? '#ffffff' : stroke.color;
      ctx.lineWidth = stroke.tool === 'eraser' ? stroke.size * 3 : stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.forEach((point, i) => {
        if (i > 0) {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });
  }, [pages, currentPage, getDimensions, drawBackground]);

  // Initial setup and resize handling
  useEffect(() => {
    redrawCanvas();
    
    const handleResize = () => redrawCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [redrawCanvas]);

  // Get pointer position relative to canvas
  const getPointerPos = useCallback((e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  // Drawing handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return;
    
    setIsDrawing(true);
    const pos = getPointerPos(e);
    
    currentStrokeRef.current = {
      points: [pos],
      color,
      size: brushSize,
      tool,
    };
    
    // Start drawing immediately
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
        ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(pos.x, pos.y);
      }
    }
    
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  }, [disabled, getPointerPos, color, brushSize, tool]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || disabled || !currentStrokeRef.current) return;
    
    const pos = getPointerPos(e);
    currentStrokeRef.current.points.push(pos);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      }
    }
  }, [isDrawing, disabled, getPointerPos]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || !currentStrokeRef.current) return;
    
    setIsDrawing(false);
    
    // Add stroke to current page
    if (currentStrokeRef.current.points.length > 1) {
      const newPages = [...pages];
      newPages[currentPage] = [...(newPages[currentPage] || []), currentStrokeRef.current];
      setPages(newPages);
      
      // Add to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newPages)));
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    
    currentStrokeRef.current = null;
    (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId);
  }, [isDrawing, pages, currentPage, history, historyIndex]);

  // Undo/Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPages(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPages(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  }, [historyIndex, history]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const newPages = [...pages];
    newPages[currentPage] = [];
    setPages(newPages);
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newPages)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [pages, currentPage, history, historyIndex]);

  // Add/navigate pages
  const addPage = useCallback(() => {
    const newPages = [...pages, []];
    setPages(newPages);
    setCurrentPage(newPages.length - 1);
  }, [pages]);

  const goToPage = useCallback((index: number) => {
    if (index >= 0 && index < pages.length) {
      setCurrentPage(index);
    }
  }, [pages.length]);

  // Submit
  const handleSubmit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const pngDataUrl = canvas.toDataURL('image/png');
    const strokesJson = JSON.stringify(pages);
    
    onSubmit({ pngDataUrl, strokesJson, pageCount: pages.length });
    toast.success("Whiteboard submitted!");
  }, [pages, onSubmit]);

  const { width, height } = getDimensions();

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-muted/30 rounded-lg">
        {enabledTools.pen !== false && (
          <Button
            variant={tool === 'pen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('pen')}
            disabled={disabled}
            className="gap-1"
          >
            <Pencil className="h-4 w-4" />
            Pen
          </Button>
        )}
        
        {enabledTools.eraser !== false && (
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
            disabled={disabled}
            className="gap-1"
          >
            <Eraser className="h-4 w-4" />
            Eraser
          </Button>
        )}
        
        <div className="w-px h-6 bg-border" />
        
        {/* Color picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" disabled={disabled} className="gap-1">
              <div 
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: color }}
              />
              <Palette className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-5 gap-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                    color === c ? "border-primary" : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Brush size */}
        <div className="flex items-center gap-2 min-w-[100px]">
          <span className="text-xs text-muted-foreground">Size</span>
          <Slider
            value={[brushSize]}
            onValueChange={([v]) => setBrushSize(v)}
            min={1}
            max={20}
            step={1}
            className="w-16"
            disabled={disabled}
          />
          <span className="text-xs w-4">{brushSize}</span>
        </div>
        
        <div className="w-px h-6 bg-border" />
        
        {enabledTools.undo !== false && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={undo}
              disabled={disabled || historyIndex <= 0}
              className="h-8 w-8"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={redo}
              disabled={disabled || historyIndex >= history.length - 1}
              className="h-8 w-8"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          size="icon"
          onClick={clearCanvas}
          disabled={disabled}
          className="h-8 w-8 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Canvas */}
      <div 
        className={cn(
          "border-2 rounded-lg overflow-hidden bg-white mx-auto",
          disabled && "opacity-60 pointer-events-none"
        )}
        style={{ width: width + 4, maxWidth: '100%' }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="touch-none cursor-crosshair"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </div>
      
      {/* Multi-page navigation */}
      {multiPage && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0 || disabled}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage + 1} of {pages.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === pages.length - 1 || disabled}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={addPage}
            disabled={disabled}
          >
            + Add Page
          </Button>
        </div>
      )}
      
      {/* Submit button */}
      {!disabled && (
        <Button onClick={handleSubmit} className="w-full gap-2">
          <Check className="h-4 w-4" />
          Submit Drawing
        </Button>
      )}
    </div>
  );
}
