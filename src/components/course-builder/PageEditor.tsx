import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Settings, 
  GripVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Type,
  Play,
  Image,
  HelpCircle,
  ListOrdered,
  PenTool,
  MessageSquare,
  Lock,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { demoPages, demoBlocks, Block, BlockType } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const iconMap: Record<BlockType, any> = {
  'text': Type,
  'video': Play,
  'image': Image,
  'micro-quiz': HelpCircle,
  'drag-drop-reorder': ListOrdered,
  'whiteboard': PenTool,
  'reflection': MessageSquare,
  'qa-thread': MessageSquare,
  'resource': Type,
  'divider': Type,
};

interface PageEditorProps {
  pageId: string;
  isAdmin: boolean;
}

export function PageEditor({ pageId, isAdmin }: PageEditorProps) {
  const page = demoPages.find(p => p.id === pageId);
  const blocks = demoBlocks.filter(b => b.pageId === pageId);
  const [isGatingEnabled, setIsGatingEnabled] = useState(false);

  if (!page) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">{page.title}</h2>
            <p className="text-sm text-muted-foreground">
              {blocks.length} blocks • {blocks.filter(b => b.isRequired).length} required
            </p>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch 
                  id="gating" 
                  checked={isGatingEnabled}
                  onCheckedChange={setIsGatingEnabled}
                />
                <Label htmlFor="gating" className="text-sm cursor-pointer">
                  Lock next page
                </Label>
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Blocks List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {blocks.length > 0 ? (
          blocks.map((block, index) => (
            <BlockCard key={block.id} block={block} isAdmin={isAdmin} />
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center py-12 border-2 border-dashed rounded-xl w-full">
              <p className="text-muted-foreground mb-2">No blocks yet</p>
              <p className="text-sm text-muted-foreground">Drag blocks from the library to add content</p>
            </div>
          </div>
        )}
        
        {isAdmin && blocks.length > 0 && (
          <div className="py-8 border-2 border-dashed border-muted rounded-xl flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Drop blocks here or click + to add</p>
          </div>
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
                  style={{ width: '40%' }}
                />
              </div>
              <span className="text-sm text-muted-foreground">2 of 5 blocks complete</span>
            </div>
            <Button className="gradient-accent text-accent-foreground">
              Mark as Complete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function BlockCard({ block, isAdmin }: { block: Block; isAdmin: boolean }) {
  const Icon = iconMap[block.type] || Type;
  
  const isActiveBlock = ['micro-quiz', 'drag-drop-reorder', 'whiteboard', 'reflection', 'qa-thread'].includes(block.type);

  return (
    <motion.div
      className={cn(
        "rounded-xl border shadow-card transition-all",
        isActiveBlock ? "bg-accent/5 border-accent/20" : "bg-card",
        block.isCompleted && "ring-2 ring-success/20"
      )}
      layout
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {isAdmin && (
            <div className="pt-1">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            </div>
          )}
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            isActiveBlock ? "bg-accent/10" : "bg-primary/10"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              isActiveBlock ? "text-accent" : "text-primary"
            )} />
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
                    <DropdownMenuItem>Edit Block</DropdownMenuItem>
                    <DropdownMenuItem>
                      {block.isRequired ? 'Mark as Optional' : 'Mark as Required'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <p className="text-sm text-muted-foreground capitalize mt-1">
              {block.type.replace('-', ' ')}
              {block.content?.questions && ` • ${block.content.questions} questions`}
              {block.content?.duration && ` • ${block.content.duration}`}
            </p>
          </div>
        </div>

        {/* Block Preview Content */}
        <div className="mt-4 ml-11">
          {block.type === 'video' && (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <Play className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
          {block.type === 'micro-quiz' && (
            <div className="space-y-2">
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                Q1: What is the quadratic formula?
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">A) x = -b ± √(b²-4ac) / 2a</Button>
                <Button variant="outline" size="sm" className="flex-1">B) x = b² - 4ac</Button>
              </div>
            </div>
          )}
          {block.type === 'whiteboard' && (
            <div className="h-32 bg-muted/30 border-2 border-dashed rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PenTool className="h-6 w-6 mx-auto text-muted-foreground/50 mb-1" />
                <p className="text-sm text-muted-foreground">Draw or write your answer</p>
              </div>
            </div>
          )}
          {block.type === 'reflection' && (
            <div className="space-y-2">
              <textarea 
                className="w-full h-20 p-3 bg-muted/30 border rounded-lg text-sm resize-none"
                placeholder="Share your thoughts..."
              />
              <p className="text-xs text-muted-foreground">Your reflection will be shared anonymously with peers</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
