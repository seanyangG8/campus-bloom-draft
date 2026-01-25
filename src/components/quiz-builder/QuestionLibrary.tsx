import { motion } from 'framer-motion';
import {
  CircleDot,
  CheckSquare,
  ToggleLeft,
  Type,
  TextCursorInput,
  ArrowRightLeft,
  GripVertical,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useQuizBuilder } from '@/contexts/QuizBuilderContext';
import { QuestionType, questionTypes } from '@/lib/quiz-types';

const iconMap: Record<string, any> = {
  CircleDot,
  CheckSquare,
  ToggleLeft,
  Type,
  TextCursorInput,
  ArrowRightLeft,
};

export function QuestionLibrary() {
  const { addQuestion } = useQuizBuilder();

  const handleDragStart = (e: React.DragEvent, type: QuestionType) => {
    e.dataTransfer.setData('questionType', type);
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-muted/30">
        <h3 className="font-semibold text-sm">Question Types</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Drag to add or click to append
        </p>
      </div>

      {/* Question Types */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
            {questionTypes.map((qt, index) => {
              const Icon = iconMap[qt.icon];
              return (
                <div
                  key={qt.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, qt.type)}
                  onClick={() => addQuestion(qt.type)}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border cursor-grab transition-all',
                    'bg-background hover:bg-muted/50 hover:border-primary/30',
                    'active:cursor-grabbing active:scale-[0.98]'
                )}
              >
                <div className="flex items-center gap-2 shrink-0">
                  <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{qt.label}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {qt.description}
                  </p>
                </div>
                </div>
              );
          })}
        </div>
      </ScrollArea>

      {/* Tips */}
      <div className="p-3 border-t bg-muted/20">
        <p className="text-xs text-muted-foreground text-center">
          💡 Click to add at the end
        </p>
      </div>
    </div>
  );
}
