import { Info, CheckCircle, HelpCircle, ListOrdered, PenTool, MessageSquare } from "lucide-react";
import { Block } from "@/lib/demo-data";
import { 
  getPageCompletionSummary, 
  blockCompletionRules, 
  getBlockCompletionRule 
} from "@/lib/completion-rules";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CompletionRulesSummaryProps {
  blocks: Block[];
  isGated: boolean;
}

export function CompletionRulesSummary({ blocks, isGated }: CompletionRulesSummaryProps) {
  const summary = getPageCompletionSummary(blocks);
  
  const requiredBlocks = blocks.filter(b => {
    const rule = getBlockCompletionRule(b.type);
    return b.isRequired && rule.countsTowardsCompletion;
  });
  
  const completedRequired = requiredBlocks.filter(b => b.isCompleted);
  
  // Get unique required block types with their completion icons
  const blockTypeIcons: Record<string, React.ReactNode> = {
    'micro-quiz': <HelpCircle className="h-3.5 w-3.5" />,
    'drag-drop-reorder': <ListOrdered className="h-3.5 w-3.5" />,
    'whiteboard': <PenTool className="h-3.5 w-3.5" />,
    'reflection': <MessageSquare className="h-3.5 w-3.5" />,
  };
  
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg text-xs",
      isGated ? "bg-warning/10 border border-warning/30" : "bg-muted/50 border border-border/50"
    )}>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {isGated ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  <Info className="h-3.5 w-3.5 text-warning" />
                  <span className="font-medium text-warning">Gate:</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[250px]">
                <p className="text-xs">
                  Students must complete this page before accessing the next page.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <>
            <CheckCircle className="h-3.5 w-3.5" />
            <span className="font-medium">Complete when:</span>
          </>
        )}
      </div>
      
      <span className={cn(
        "flex-1 truncate",
        isGated ? "text-warning" : "text-foreground"
      )}>
        {summary}
      </span>
      
      {requiredBlocks.length > 0 && (
        <div className="flex items-center gap-1 text-muted-foreground shrink-0">
          <span className="font-medium">
            {completedRequired.length}/{requiredBlocks.length}
          </span>
        </div>
      )}
    </div>
  );
}

// Compact version for inline display
export function CompletionRulesBadge({ blocks, isGated }: CompletionRulesSummaryProps) {
  const requiredBlocks = blocks.filter(b => {
    const rule = getBlockCompletionRule(b.type);
    return b.isRequired && rule.countsTowardsCompletion;
  });
  
  if (requiredBlocks.length === 0 && !isGated) {
    return null;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] cursor-help",
            isGated 
              ? "bg-warning/10 text-warning border border-warning/30" 
              : "bg-muted text-muted-foreground"
          )}>
            {isGated && <Info className="h-3 w-3" />}
            <span>{requiredBlocks.length} required</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[200px]">
          <p className="text-xs font-medium mb-1">
            {isGated ? 'Gated Page' : 'Completion Rules'}
          </p>
          <p className="text-xs text-muted-foreground">
            {getPageCompletionSummary(blocks)}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
