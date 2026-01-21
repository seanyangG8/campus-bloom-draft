import { useState } from "react";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
  Plus,
  Settings,
  GripVertical,
  Trash2,
  MoreVertical,
  Type,
  Play,
  Image,
  HelpCircle,
  ListOrdered,
  PenTool,
  MessageSquare,
  FileText,
  Minus,
  Copy,
  Edit,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Block, BlockType, Page } from "@/lib/demo-data";
import { useCourseBuilder } from "@/contexts/CourseBuilderContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BlockEditorDialog } from "./BlockEditorDialog";

const iconMap: Record<BlockType, any> = {
  text: Type,
  video: Play,
  image: Image,
  "micro-quiz": HelpCircle,
  "drag-drop-reorder": ListOrdered,
  whiteboard: PenTool,
  reflection: MessageSquare,
  "qa-thread": MessageSquare,
  resource: FileText,
  divider: Minus,
};

interface PageEditorProps {
  pageId: string;
  isAdmin: boolean;
}

export function PageEditor({ pageId, isAdmin }: PageEditorProps) {
  const { pages, getBlocksByPage, updatePage, reorderBlocks } = useCourseBuilder();
  const page = pages.find((p) => p.id === pageId);
  const blocks = getBlocksByPage(pageId);

  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [pageSettingsOpen, setPageSettingsOpen] = useState(false);

  if (!page) return null;

  const handleReorder = (newOrder: Block[]) => {
    reorderBlocks(
      pageId,
      newOrder.map((b) => b.id)
    );
  };

  const completedBlocks = blocks.filter((b) => b.isCompleted).length;
  const requiredBlocks = blocks.filter((b) => b.isRequired).length;

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">{page.title}</h2>
            <p className="text-sm text-muted-foreground">
              {blocks.length} blocks • {requiredBlocks} required
            </p>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="gating"
                  checked={page.isLocked}
                  onCheckedChange={(checked) => updatePage(pageId, { isLocked: checked })}
                />
                <Label htmlFor="gating" className="text-sm cursor-pointer">
                  Gate page
                </Label>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPageSettingsOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Blocks List */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {blocks.length > 0 ? (
          <Reorder.Group
            axis="y"
            values={blocks}
            onReorder={handleReorder}
            className="space-y-3"
          >
            {blocks.map((block) => (
              <BlockCard
                key={block.id}
                block={block}
                isAdmin={isAdmin}
                onEdit={() => setEditingBlock(block)}
              />
            ))}
          </Reorder.Group>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center py-12 border-2 border-dashed rounded-xl w-full">
              <p className="text-muted-foreground mb-2">No blocks yet</p>
              <p className="text-sm text-muted-foreground">
                Drag blocks from the library to add content
              </p>
            </div>
          </div>
        )}

        {isAdmin && blocks.length > 0 && (
          <DropZone pageId={pageId} />
        )}
      </div>

      {/* Page Footer - Progress for students */}
      {!isAdmin && (
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden w-32">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{
                    width: blocks.length > 0 ? `${(completedBlocks / blocks.length) * 100}%` : "0%",
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {completedBlocks} of {blocks.length} blocks complete
              </span>
            </div>
            <Button
              className="gradient-accent text-accent-foreground"
              disabled={page.isCompleted}
            >
              {page.isCompleted ? "Completed" : "Mark as Complete"}
            </Button>
          </div>
        </div>
      )}

      {/* Block Editor Dialog */}
      <BlockEditorDialog
        block={editingBlock}
        open={!!editingBlock}
        onOpenChange={(open) => !open && setEditingBlock(null)}
      />

      {/* Page Settings Dialog */}
      <PageSettingsDialog
        page={page}
        open={pageSettingsOpen}
        onOpenChange={setPageSettingsOpen}
      />
    </div>
  );
}

// Drop Zone Component
function DropZone({ pageId }: { pageId: string }) {
  const { addBlock } = useCourseBuilder();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const blockType = e.dataTransfer.getData("blockType") as BlockType;
    if (blockType) {
      addBlock(pageId, blockType);
    }
  };

  return (
    <div
      className={cn(
        "mt-4 py-8 border-2 border-dashed rounded-xl flex items-center justify-center transition-all",
        isDraggingOver
          ? "border-primary bg-primary/5"
          : "border-muted hover:border-muted-foreground/30"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <p className="text-sm text-muted-foreground">
        {isDraggingOver ? "Drop to add block" : "Drop blocks here"}
      </p>
    </div>
  );
}

// Block Card Component
function BlockCard({
  block,
  isAdmin,
  onEdit,
}: {
  block: Block;
  isAdmin: boolean;
  onEdit: () => void;
}) {
  const { updateBlock, deleteBlock, duplicateBlock, reorderBlocks, getBlocksByPage } =
    useCourseBuilder();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const dragControls = useDragControls();

  const Icon = iconMap[block.type] || Type;
  const isActiveBlock = [
    "micro-quiz",
    "drag-drop-reorder",
    "whiteboard",
    "reflection",
    "qa-thread",
  ].includes(block.type);

  const blocks = getBlocksByPage(block.pageId);
  const currentIndex = blocks.findIndex((b) => b.id === block.id);

  const moveBlock = (direction: "up" | "down") => {
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newOrder = [...blocks];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
    reorderBlocks(
      block.pageId,
      newOrder.map((b) => b.id)
    );
  };

  return (
    <>
      <Reorder.Item
        value={block}
        dragListener={false}
        dragControls={dragControls}
        className={cn(
          "rounded-xl border shadow-card transition-all",
          isActiveBlock ? "bg-accent/5 border-accent/20" : "bg-card",
          block.isCompleted && "ring-2 ring-success/20"
        )}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            {isAdmin && (
              <div
                className="pt-1 cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                isActiveBlock ? "bg-accent/10" : "bg-primary/10"
              )}
            >
              <Icon
                className={cn("h-5 w-5", isActiveBlock ? "text-accent" : "text-primary")}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">{block.title}</h3>
                  {block.isRequired && (
                    <span className="text-xs text-accent font-medium">Required</span>
                  )}
                  {block.isCompleted && (
                    <span className="text-xs text-success font-medium">✓ Complete</span>
                  )}
                </div>
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={onEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Block
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateBlock(block.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateBlock(block.id, { isRequired: !block.isRequired })
                        }
                      >
                        {block.isRequired ? "Mark as Optional" : "Mark as Required"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => moveBlock("up")}
                        disabled={currentIndex === 0}
                      >
                        <ChevronUp className="mr-2 h-4 w-4" />
                        Move Up
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => moveBlock("down")}
                        disabled={currentIndex === blocks.length - 1}
                      >
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Move Down
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteConfirmOpen(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <p className="text-sm text-muted-foreground capitalize mt-1">
                {block.type.replace("-", " ")}
                {block.content?.questions?.length &&
                  ` • ${block.content.questions.length} questions`}
                {block.content?.duration && ` • ${block.content.duration}`}
              </p>
            </div>
          </div>

          {/* Block Preview Content */}
          <BlockPreview block={block} isAdmin={isAdmin} />
        </div>
      </Reorder.Item>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Block?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{block.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteBlock(block.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Block Preview Component
function BlockPreview({ block, isAdmin }: { block: Block; isAdmin: boolean }) {
  if (block.type === "divider") {
    return <div className="mt-4 ml-11 border-t" />;
  }

  return (
    <div className="mt-4 ml-11">
      {block.type === "text" && (
        <div className="p-3 bg-muted/30 rounded-lg text-sm prose prose-sm max-w-none">
          {block.content?.html ? (
            <div dangerouslySetInnerHTML={{ __html: block.content.html }} />
          ) : (
            <p className="text-muted-foreground italic">No content yet</p>
          )}
        </div>
      )}

      {block.type === "video" && (
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          {block.content?.url ? (
            <div className="text-center">
              <Play className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{block.content.duration || "Video"}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No video URL set</p>
          )}
        </div>
      )}

      {block.type === "image" && (
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {block.content?.url ? (
            <img
              src={block.content.url}
              alt={block.content.alt || ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image className="h-12 w-12 text-muted-foreground/50" />
          )}
        </div>
      )}

      {block.type === "micro-quiz" && (
        <div className="space-y-2">
          {block.content?.questions?.length > 0 ? (
            <>
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                Q1: {block.content.questions[0].question || "Enter question..."}
              </div>
              <div className="flex gap-2 flex-wrap">
                {block.content.questions[0].options?.slice(0, 2).map((opt: string, i: number) => (
                  <Button key={i} variant="outline" size="sm" className="flex-1">
                    {String.fromCharCode(65 + i)}) {opt || `Option ${i + 1}`}
                  </Button>
                ))}
              </div>
              {block.content.questions.length > 1 && (
                <p className="text-xs text-muted-foreground">
                  +{block.content.questions.length - 1} more questions
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground italic">No questions configured</p>
          )}
        </div>
      )}

      {block.type === "drag-drop-reorder" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {block.content?.instruction || "Reorder the items:"}
          </p>
          {block.content?.items?.length > 0 ? (
            <div className="space-y-1">
              {block.content.items.slice(0, 3).map((item: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 bg-muted/50 rounded border"
                >
                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{item || `Item ${i + 1}`}</span>
                </div>
              ))}
              {block.content.items.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{block.content.items.length - 3} more items
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No items configured</p>
          )}
        </div>
      )}

      {block.type === "whiteboard" && (
        <div className="h-32 bg-muted/30 border-2 border-dashed rounded-lg flex items-center justify-center">
          <div className="text-center">
            <PenTool className="h-6 w-6 mx-auto text-muted-foreground/50 mb-1" />
            <p className="text-sm text-muted-foreground">
              {block.content?.prompt || "Draw or write your answer"}
            </p>
          </div>
        </div>
      )}

      {block.type === "reflection" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {block.content?.prompt || "Share your thoughts..."}
          </p>
          <textarea
            className="w-full h-20 p-3 bg-muted/30 border rounded-lg text-sm resize-none"
            placeholder="Type your reflection..."
            disabled={isAdmin}
          />
          {block.content?.minWords && (
            <p className="text-xs text-muted-foreground">
              Minimum {block.content.minWords} words
            </p>
          )}
        </div>
      )}

      {block.type === "resource" && (
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium">
              {block.content?.fileName || "Resource file"}
            </p>
            <p className="text-xs text-muted-foreground">
              {block.content?.fileSize || "Click to download"}
            </p>
          </div>
        </div>
      )}

      {block.type === "qa-thread" && (
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Q&A Thread</p>
          <Button variant="outline" size="sm" className="w-full">
            Ask a Question
          </Button>
        </div>
      )}
    </div>
  );
}

// Page Settings Dialog
function PageSettingsDialog({
  page,
  open,
  onOpenChange,
}: {
  page: Page;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { updatePage } = useCourseBuilder();
  const [title, setTitle] = useState(page.title);

  const handleSave = () => {
    updatePage(page.id, { title });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Page Settings</DialogTitle>
          <DialogDescription>Configure the settings for this page.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pageTitle">Page Title</Label>
            <Input
              id="pageTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Required Page</Label>
              <p className="text-xs text-muted-foreground">
                Students must complete this page to progress
              </p>
            </div>
            <Switch
              checked={page.isRequired}
              onCheckedChange={(checked) => updatePage(page.id, { isRequired: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Gate Next Page</Label>
              <p className="text-xs text-muted-foreground">
                Lock the next page until this one is complete
              </p>
            </div>
            <Switch
              checked={page.isLocked}
              onCheckedChange={(checked) => updatePage(page.id, { isLocked: checked })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
