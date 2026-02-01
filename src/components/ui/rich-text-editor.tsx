import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link, 
  Heading2, 
  Heading3,
  Undo,
  Redo,
  Table,
  RemoveFormatting,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start typing...",
  minHeight = "200px",
  className 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showHtml, setShowHtml] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  
  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const formatBlock = useCallback((tag: string) => {
    document.execCommand('formatBlock', false, tag);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const insertLink = useCallback(() => {
    if (linkUrl) {
      // Validate URL
      let url = linkUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:')) {
        url = 'https://' + url;
      }
      execCommand('createLink', url);
      setLinkUrl("");
      setLinkPopoverOpen(false);
    }
  }, [linkUrl, execCommand]);

  const insertTable = useCallback((rows: number, cols: number) => {
    let tableHtml = '<table style="border-collapse: collapse; width: 100%; margin: 1rem 0;">';
    for (let i = 0; i < rows; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHtml += `<td style="border: 1px solid #ccc; padding: 8px;">${i === 0 ? 'Header' : 'Cell'}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</table>';
    
    document.execCommand('insertHTML', false, tableHtml);
    handleInput();
  }, [handleInput]);

  const removeFormatting = useCallback(() => {
    execCommand('removeFormat');
  }, [execCommand]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleInput();
  }, [handleInput]);

  const ToolbarButton = ({ 
    onClick, 
    icon: Icon, 
    title,
    active = false 
  }: { 
    onClick: () => void; 
    icon: React.ComponentType<{ className?: string }>; 
    title: string;
    active?: boolean;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              active && "bg-muted"
            )}
            onClick={onClick}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (showHtml) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-xs font-medium text-muted-foreground">HTML View</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowHtml(false)}
            className="h-7 gap-1"
          >
            <Eye className="h-3.5 w-3.5" />
            Visual Editor
          </Button>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full font-mono text-sm p-3 border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-ring"
          style={{ minHeight }}
          placeholder="Enter HTML..."
        />
      </div>
    );
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1 border-b bg-muted/30">
        {/* Text formatting */}
        <ToolbarButton onClick={() => execCommand('bold')} icon={Bold} title="Bold (Ctrl+B)" />
        <ToolbarButton onClick={() => execCommand('italic')} icon={Italic} title="Italic (Ctrl+I)" />
        <ToolbarButton onClick={() => execCommand('underline')} icon={Underline} title="Underline (Ctrl+U)" />
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Headings */}
        <ToolbarButton onClick={() => formatBlock('h2')} icon={Heading2} title="Heading 2" />
        <ToolbarButton onClick={() => formatBlock('h3')} icon={Heading3} title="Heading 3" />
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Lists */}
        <ToolbarButton onClick={() => execCommand('insertUnorderedList')} icon={List} title="Bullet List" />
        <ToolbarButton onClick={() => execCommand('insertOrderedList')} icon={ListOrdered} title="Numbered List" />
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Block formatting */}
        <ToolbarButton onClick={() => formatBlock('blockquote')} icon={Quote} title="Quote" />
        <ToolbarButton onClick={() => execCommand('formatBlock', 'pre')} icon={Code} title="Code Block" />
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Link */}
        <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Link className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-2">
              <p className="text-sm font-medium">Insert Link</p>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                onKeyDown={(e) => e.key === 'Enter' && insertLink()}
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setLinkPopoverOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={insertLink}>
                  Insert
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Table */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Table className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="start">
            <div className="space-y-2">
              <p className="text-sm font-medium">Insert Table</p>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => insertTable(2, 2)}>
                  2×2
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertTable(3, 3)}>
                  3×3
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertTable(3, 2)}>
                  3×2
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertTable(4, 3)}>
                  4×3
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Undo/Redo */}
        <ToolbarButton onClick={() => execCommand('undo')} icon={Undo} title="Undo (Ctrl+Z)" />
        <ToolbarButton onClick={() => execCommand('redo')} icon={Redo} title="Redo (Ctrl+Y)" />
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Clear formatting */}
        <ToolbarButton onClick={removeFormatting} icon={RemoveFormatting} title="Clear Formatting" />
        
        {/* Toggle HTML view */}
        <div className="ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowHtml(true)}
            className="h-7 gap-1 text-xs"
          >
            <EyeOff className="h-3.5 w-3.5" />
            HTML
          </Button>
        </div>
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className={cn(
          "p-4 focus:outline-none prose prose-sm max-w-none",
          "prose-headings:font-semibold prose-h2:text-xl prose-h3:text-lg",
          "prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4",
          "prose-blockquote:border-l-4 prose-blockquote:border-muted-foreground prose-blockquote:pl-4 prose-blockquote:italic",
          "prose-pre:bg-muted prose-pre:p-2 prose-pre:rounded",
          "prose-a:text-primary prose-a:underline",
          "[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-muted-foreground"
        )}
        style={{ minHeight }}
        data-placeholder={placeholder}
        onInput={handleInput}
        onPaste={handlePaste}
        suppressContentEditableWarning
      />
    </div>
  );
}
