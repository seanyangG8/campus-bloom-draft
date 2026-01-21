import { useState } from "react";
import { Block, BlockType } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useCourseBuilder } from "@/contexts/CourseBuilderContext";

interface BlockEditorDialogProps {
  block: Block | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlockEditorDialog({ block, open, onOpenChange }: BlockEditorDialogProps) {
  const { updateBlock } = useCourseBuilder();
  const [title, setTitle] = useState(block?.title || "");
  const [content, setContent] = useState<any>(block?.content || {});
  const [isRequired, setIsRequired] = useState(block?.isRequired || false);

  // Reset state when block changes
  useState(() => {
    if (block) {
      setTitle(block.title);
      setContent(block.content);
      setIsRequired(block.isRequired);
    }
  });

  const handleSave = () => {
    if (block) {
      updateBlock(block.id, { title, content, isRequired });
      onOpenChange(false);
    }
  };

  if (!block) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {getBlockTypeLabel(block.type)}</DialogTitle>
          <DialogDescription>
            Configure the content and settings for this block.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Common Fields */}
          <div className="space-y-2">
            <Label htmlFor="title">Block Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter block title..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="required"
              checked={isRequired}
              onCheckedChange={setIsRequired}
            />
            <Label htmlFor="required">Required to complete page</Label>
          </div>

          {/* Block-specific editors */}
          {block.type === "text" && (
            <TextBlockEditor content={content} onChange={setContent} />
          )}
          {block.type === "video" && (
            <VideoBlockEditor content={content} onChange={setContent} />
          )}
          {block.type === "image" && (
            <ImageBlockEditor content={content} onChange={setContent} />
          )}
          {block.type === "micro-quiz" && (
            <MicroQuizEditor content={content} onChange={setContent} />
          )}
          {block.type === "drag-drop-reorder" && (
            <ReorderBlockEditor content={content} onChange={setContent} />
          )}
          {block.type === "whiteboard" && (
            <WhiteboardBlockEditor content={content} onChange={setContent} />
          )}
          {block.type === "reflection" && (
            <ReflectionBlockEditor content={content} onChange={setContent} />
          )}
          {block.type === "resource" && (
            <ResourceBlockEditor content={content} onChange={setContent} />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Text Block Editor
function TextBlockEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-2">
      <Label>Content</Label>
      <Textarea
        value={content.html || ""}
        onChange={(e) => onChange({ ...content, html: e.target.value })}
        placeholder="Enter your text content here..."
        className="min-h-[200px]"
      />
      <p className="text-xs text-muted-foreground">
        Supports basic HTML formatting.
      </p>
    </div>
  );
}

// Video Block Editor
function VideoBlockEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Video URL</Label>
        <Input
          value={content.url || ""}
          onChange={(e) => onChange({ ...content, url: e.target.value })}
          placeholder="https://youtube.com/watch?v=... or Vimeo link"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Duration</Label>
          <Input
            value={content.duration || ""}
            onChange={(e) => onChange({ ...content, duration: e.target.value })}
            placeholder="e.g., 12:34"
          />
        </div>
        <div className="space-y-2">
          <Label>Thumbnail URL (optional)</Label>
          <Input
            value={content.thumbnail || ""}
            onChange={(e) => onChange({ ...content, thumbnail: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>
    </div>
  );
}

// Image Block Editor
function ImageBlockEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input
          value={content.url || ""}
          onChange={(e) => onChange({ ...content, url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label>Alt Text</Label>
        <Input
          value={content.alt || ""}
          onChange={(e) => onChange({ ...content, alt: e.target.value })}
          placeholder="Describe the image..."
        />
      </div>
      <div className="space-y-2">
        <Label>Caption (optional)</Label>
        <Input
          value={content.caption || ""}
          onChange={(e) => onChange({ ...content, caption: e.target.value })}
          placeholder="Image caption..."
        />
      </div>
    </div>
  );
}

// Micro-Quiz Editor
function MicroQuizEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const questions = content.questions || [];

  const addQuestion = () => {
    onChange({
      ...content,
      questions: [
        ...questions,
        {
          id: `q-${Date.now()}`,
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    });
  };

  const updateQuestion = (index: number, updates: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onChange({ ...content, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    onChange({
      ...content,
      questions: questions.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Questions</Label>
        <Button variant="outline" size="sm" onClick={addQuestion}>
          <Plus className="h-4 w-4 mr-1" />
          Add Question
        </Button>
      </div>

      {questions.map((q: any, qIndex: number) => (
        <div key={q.id} className="p-4 border rounded-lg space-y-4 bg-muted/30">
          <div className="flex items-start justify-between">
            <span className="text-sm font-medium">Question {qIndex + 1}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive"
              onClick={() => removeQuestion(qIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <Textarea
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
            placeholder="Enter your question..."
            className="min-h-[60px]"
          />

          <div className="space-y-2">
            <Label>Answer Options</Label>
            {q.options.map((opt: string, optIndex: number) => (
              <div key={optIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${q.id}`}
                  checked={q.correctAnswer === optIndex}
                  onChange={() => updateQuestion(qIndex, { correctAnswer: optIndex })}
                  className="h-4 w-4"
                />
                <Input
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...q.options];
                    newOptions[optIndex] = e.target.value;
                    updateQuestion(qIndex, { options: newOptions });
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                  className="flex-1"
                />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Select the radio button next to the correct answer.
            </p>
          </div>
        </div>
      ))}

      {questions.length === 0 && (
        <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
          No questions yet. Click "Add Question" to create one.
        </div>
      )}
    </div>
  );
}

// Reorder Block Editor
function ReorderBlockEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const items = content.items || [];

  const addItem = () => {
    onChange({
      ...content,
      items: [...items, ""],
      correctOrder: [...(content.correctOrder || []), items.length],
    });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange({ ...content, items: newItems });
  };

  const removeItem = (index: number) => {
    onChange({
      ...content,
      items: items.filter((_: any, i: number) => i !== index),
      correctOrder: (content.correctOrder || [])
        .filter((i: number) => i !== index)
        .map((i: number) => (i > index ? i - 1 : i)),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Instruction</Label>
        <Input
          value={content.instruction || ""}
          onChange={(e) => onChange({ ...content, instruction: e.target.value })}
          placeholder="e.g., Drag and drop to reorder the steps:"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Items (in correct order)</Label>
        <Button variant="outline" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="w-6 text-sm text-muted-foreground">{index + 1}.</span>
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => removeItem(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Enter items in the correct order. Students will see them shuffled.
      </p>
    </div>
  );
}

// Whiteboard Block Editor
function WhiteboardBlockEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Prompt</Label>
        <Textarea
          value={content.prompt || ""}
          onChange={(e) => onChange({ ...content, prompt: e.target.value })}
          placeholder="What should students draw or write?"
          className="min-h-[80px]"
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="allowImage"
          checked={content.allowImage !== false}
          onCheckedChange={(checked) => onChange({ ...content, allowImage: checked })}
        />
        <Label htmlFor="allowImage">Allow image upload</Label>
      </div>
    </div>
  );
}

// Reflection Block Editor
function ReflectionBlockEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Reflection Prompt</Label>
        <Textarea
          value={content.prompt || ""}
          onChange={(e) => onChange({ ...content, prompt: e.target.value })}
          placeholder="What should students reflect on?"
          className="min-h-[80px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Minimum Words (optional)</Label>
          <Input
            type="number"
            value={content.minWords || ""}
            onChange={(e) => onChange({ ...content, minWords: parseInt(e.target.value) || 0 })}
            placeholder="e.g., 50"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="showPeers"
          checked={content.showPeerReflections !== false}
          onCheckedChange={(checked) => onChange({ ...content, showPeerReflections: checked })}
        />
        <Label htmlFor="showPeers">Show peer reflections after submission</Label>
      </div>
    </div>
  );
}

// Resource Block Editor
function ResourceBlockEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>File URL</Label>
        <Input
          value={content.url || ""}
          onChange={(e) => onChange({ ...content, url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>File Name</Label>
          <Input
            value={content.fileName || ""}
            onChange={(e) => onChange({ ...content, fileName: e.target.value })}
            placeholder="worksheet.pdf"
          />
        </div>
        <div className="space-y-2">
          <Label>File Size</Label>
          <Input
            value={content.fileSize || ""}
            onChange={(e) => onChange({ ...content, fileSize: e.target.value })}
            placeholder="2.5 MB"
          />
        </div>
      </div>
    </div>
  );
}

// Helper function
function getBlockTypeLabel(type: BlockType): string {
  const labels: Record<BlockType, string> = {
    text: "Text Block",
    video: "Video",
    image: "Image",
    "micro-quiz": "Micro-Quiz",
    "drag-drop-reorder": "Reorder Activity",
    whiteboard: "Whiteboard Activity",
    reflection: "Reflection",
    "qa-thread": "Q&A Thread",
    resource: "Resource",
    divider: "Divider",
  };
  return labels[type] || "Block";
}
