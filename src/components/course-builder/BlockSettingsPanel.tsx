import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Block, BlockType } from "@/lib/demo-data";
import { getBlockCompletionRule } from "@/lib/completion-rules";
import { cn } from "@/lib/utils";

interface BlockSettingsPanelProps {
  block: Partial<Block>;
  isRequired: boolean;
  setIsRequired: (value: boolean) => void;
  points: number | undefined;
  setPoints: (value: number | undefined) => void;
  maxAttempts: number | undefined;
  setMaxAttempts: (value: number | undefined) => void;
  visibilityCondition: 'always' | 'after_prev_complete' | 'score_threshold';
  setVisibilityCondition: (value: 'always' | 'after_prev_complete' | 'score_threshold') => void;
  visibilityThreshold: number | undefined;
  setVisibilityThreshold: (value: number | undefined) => void;
  availabilityStart?: string;
  setAvailabilityStart?: (value: string) => void;
  availabilityEnd?: string;
  setAvailabilityEnd?: (value: string) => void;
  showAttempts?: boolean;
}

// Block types that support attempts
const attemptSupportedTypes: BlockType[] = [
  'micro-quiz',
  'drag-drop-reorder',
  'whiteboard',
  'reflection',
];

// Block types that support points
const pointSupportedTypes: BlockType[] = [
  'micro-quiz',
  'drag-drop-reorder',
  'whiteboard',
  'reflection',
];

export function BlockSettingsPanel({
  block,
  isRequired,
  setIsRequired,
  points,
  setPoints,
  maxAttempts,
  setMaxAttempts,
  visibilityCondition,
  setVisibilityCondition,
  visibilityThreshold,
  setVisibilityThreshold,
  availabilityStart,
  setAvailabilityStart,
  availabilityEnd,
  setAvailabilityEnd,
  showAttempts = true,
}: BlockSettingsPanelProps) {
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [visibilityOpen, setVisibilityOpen] = useState(false);

  const completionRule = block.type ? getBlockCompletionRule(block.type) : null;
  const supportsAttempts = block.type && attemptSupportedTypes.includes(block.type);
  const supportsPoints = block.type && pointSupportedTypes.includes(block.type);

  return (
    <div className="space-y-6 border-t pt-6 mt-6">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Block Settings
      </h4>

      {/* Completion Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              id="required"
              checked={isRequired}
              onCheckedChange={setIsRequired}
            />
            <Label htmlFor="required">Required to complete page</Label>
          </div>
        </div>

        {completionRule && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Completion: {completionRule.description}</span>
          </div>
        )}

        {supportsPoints && (
          <div className="space-y-2">
            <Label htmlFor="points">Points (optional)</Label>
            <Input
              id="points"
              type="number"
              min={0}
              value={points || ""}
              onChange={(e) => setPoints(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g., 10"
              className="w-32"
            />
          </div>
        )}
      </div>

      {/* Attempts (for interactive blocks) */}
      {showAttempts && supportsAttempts && (
        <div className="space-y-2">
          <Label htmlFor="maxAttempts">Maximum Attempts</Label>
          <Select
            value={maxAttempts?.toString() || "unlimited"}
            onValueChange={(val) => setMaxAttempts(val === "unlimited" ? undefined : parseInt(val))}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Unlimited" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unlimited">Unlimited</SelectItem>
              <SelectItem value="1">1 attempt</SelectItem>
              <SelectItem value="2">2 attempts</SelectItem>
              <SelectItem value="3">3 attempts</SelectItem>
              <SelectItem value="5">5 attempts</SelectItem>
              <SelectItem value="10">10 attempts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Visibility Rules (Collapsible) */}
      <Collapsible open={visibilityOpen} onOpenChange={setVisibilityOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
          <span>Visibility Rules</span>
          {visibilityOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Visibility Condition</Label>
            <Select
              value={visibilityCondition}
              onValueChange={(val: 'always' | 'after_prev_complete' | 'score_threshold') => 
                setVisibilityCondition(val)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Always visible</SelectItem>
                <SelectItem value="after_prev_complete">After previous block complete</SelectItem>
                <SelectItem value="score_threshold">When score threshold met</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {visibilityCondition === 'score_threshold' && (
            <div className="space-y-2">
              <Label htmlFor="threshold">Score Threshold (%)</Label>
              <Input
                id="threshold"
                type="number"
                min={0}
                max={100}
                value={visibilityThreshold || ""}
                onChange={(e) => setVisibilityThreshold(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g., 70"
                className="w-32"
              />
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Availability (Collapsible) */}
      {setAvailabilityStart && setAvailabilityEnd && (
        <Collapsible open={availabilityOpen} onOpenChange={setAvailabilityOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
            <span>Availability Window</span>
            {availabilityOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availStart">Available From</Label>
                <Input
                  id="availStart"
                  type="datetime-local"
                  value={availabilityStart || ""}
                  onChange={(e) => setAvailabilityStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availEnd">Available Until</Label>
                <Input
                  id="availEnd"
                  type="datetime-local"
                  value={availabilityEnd || ""}
                  onChange={(e) => setAvailabilityEnd(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Leave empty for always available
            </p>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
