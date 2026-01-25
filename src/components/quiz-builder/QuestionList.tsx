import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  GripVertical,
  CircleDot,
  CheckSquare,
  ToggleLeft,
  Type,
  TextCursorInput,
  ArrowRightLeft,
  Trash2,
  Copy,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

export function QuestionList() {
  const {
    questions,
    selectedQuestionId,
    setSelectedQuestionId,
    addQuestion,
    deleteQuestion,
    duplicateQuestion,
    getTotalPoints,
  } = useQuizBuilder();

  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);
  const totalPoints = getTotalPoints();

  const getIcon = (type: QuestionType) => {
    const questionType = questionTypes.find((qt) => qt.type === type);
    const IconComponent = iconMap[questionType?.icon || 'CircleDot'];
    return IconComponent;
  };

  const getTypeLabel = (type: QuestionType) => {
    const questionType = questionTypes.find((qt) => qt.type === type);
    return questionType?.label || type;
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Questions</h3>
          <span className="text-xs text-muted-foreground">
            {questions.length} {questions.length === 1 ? 'question' : 'questions'}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Total Points</span>
          <span className="font-medium text-foreground">{totalPoints}</span>
        </div>
      </div>

      {/* Questions List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sortedQuestions.map((question, index) => {
            const Icon = getIcon(question.type);
            const isSelected = selectedQuestionId === question.id;

            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'group flex items-start gap-2 p-2.5 rounded-lg cursor-pointer transition-colors',
                  isSelected
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted/50'
                )}
                onClick={() => setSelectedQuestionId(question.id)}
              >
                <div className="flex items-center gap-1.5 shrink-0">
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 cursor-grab" />
                  <div
                    className={cn(
                      'w-6 h-6 rounded-md flex items-center justify-center text-xs font-medium',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="text-[10px] text-muted-foreground truncate">
                      {getTypeLabel(question.type)}
                    </span>
                  </div>
                  <p className="text-xs truncate font-medium">{question.text}</p>
                  <span className="text-[10px] text-muted-foreground">
                    {question.points} {question.points === 1 ? 'pt' : 'pts'}
                  </span>
                </div>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateQuestion(question.id);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestion(question.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            );
          })}

          {questions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No questions yet</p>
              <p className="text-xs">Add your first question to get started</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Add Question Button */}
      <div className="p-3 border-t bg-muted/30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Add Question
              <ChevronDown className="h-3 w-3 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-popover">
            {questionTypes.map((qt) => {
              const Icon = iconMap[qt.icon];
              return (
                <DropdownMenuItem
                  key={qt.type}
                  onClick={() => addQuestion(qt.type)}
                  className="gap-3"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{qt.label}</p>
                    <p className="text-xs text-muted-foreground">{qt.description}</p>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
