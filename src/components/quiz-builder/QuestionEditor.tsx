import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  GripVertical,
  Check,
  X,
  CircleDot,
  CheckSquare,
  ToggleLeft,
  Type,
  TextCursorInput,
  ArrowRightLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useQuizBuilder } from '@/contexts/QuizBuilderContext';
import {
  Question,
  QuestionType,
  MultipleChoiceContent,
  MultipleSelectContent,
  TrueFalseContent,
  ShortAnswerContent,
  FillBlankContent,
  MatchingContent,
  generateId,
  questionTypes,
} from '@/lib/quiz-types';

const iconMap: Record<string, any> = {
  CircleDot,
  CheckSquare,
  ToggleLeft,
  Type,
  TextCursorInput,
  ArrowRightLeft,
};

export function QuestionEditor() {
  const { questions, selectedQuestionId, updateQuestion } = useQuizBuilder();

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  if (!selectedQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card rounded-xl border shadow-card">
        <div className="text-center text-muted-foreground">
          <CircleDot className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">No question selected</p>
          <p className="text-sm">Select a question or add a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-card rounded-xl border shadow-card overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Question Header */}
          <QuestionHeader question={selectedQuestion} />

          {/* Question Text */}
          <div className="space-y-2">
            <Label>Question Text</Label>
            <Textarea
              value={selectedQuestion.text}
              onChange={(e) => updateQuestion(selectedQuestion.id, { text: e.target.value })}
              placeholder="Enter your question here..."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Type-specific Editor */}
          <TypeSpecificEditor question={selectedQuestion} />

          {/* Explanation */}
          <div className="space-y-2">
            <Label>Explanation (shown after answer)</Label>
            <Textarea
              value={selectedQuestion.explanation || ''}
              onChange={(e) =>
                updateQuestion(selectedQuestion.id, { explanation: e.target.value })
              }
              placeholder="Explain the correct answer..."
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Settings */}
          <Card className="p-4">
            <h4 className="font-medium mb-4">Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Points</Label>
                  <p className="text-xs text-muted-foreground">Score for correct answer</p>
                </div>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={selectedQuestion.points}
                  onChange={(e) =>
                    updateQuestion(selectedQuestion.id, { points: parseInt(e.target.value) || 1 })
                  }
                  className="w-20 text-center"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Required</Label>
                  <p className="text-xs text-muted-foreground">Must be answered to submit</p>
                </div>
                <Switch
                  checked={selectedQuestion.required}
                  onCheckedChange={(checked) =>
                    updateQuestion(selectedQuestion.id, { required: checked })
                  }
                />
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}

function QuestionHeader({ question }: { question: Question }) {
  const questionType = questionTypes.find((qt) => qt.type === question.type);
  const Icon = iconMap[questionType?.icon || 'CircleDot'];

  return (
    <div className="flex items-center gap-3 pb-4 border-b">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold">{questionType?.label || 'Question'}</h3>
        <p className="text-sm text-muted-foreground">{questionType?.description}</p>
      </div>
    </div>
  );
}

function TypeSpecificEditor({ question }: { question: Question }) {
  switch (question.type) {
    case 'multiple-choice':
      return <MultipleChoiceEditor question={question} />;
    case 'multiple-select':
      return <MultipleSelectEditor question={question} />;
    case 'true-false':
      return <TrueFalseEditor question={question} />;
    case 'short-answer':
      return <ShortAnswerEditor question={question} />;
    case 'fill-blank':
      return <FillBlankEditor question={question} />;
    case 'matching':
      return <MatchingEditor question={question} />;
    default:
      return null;
  }
}

function MultipleChoiceEditor({ question }: { question: Question }) {
  const { updateQuestion } = useQuizBuilder();
  const content = question.content as MultipleChoiceContent;

  const handleOptionChange = (optionId: string, text: string) => {
    const newOptions = content.options.map((opt) =>
      opt.id === optionId ? { ...opt, text } : opt
    );
    updateQuestion(question.id, {
      content: { ...content, options: newOptions },
    });
  };

  const handleCorrectChange = (optionId: string) => {
    const newOptions = content.options.map((opt) => ({
      ...opt,
      isCorrect: opt.id === optionId,
    }));
    updateQuestion(question.id, {
      content: { ...content, options: newOptions },
    });
  };

  const addOption = () => {
    const newOptions = [
      ...content.options,
      { id: generateId('opt'), text: `Option ${content.options.length + 1}`, isCorrect: false },
    ];
    updateQuestion(question.id, {
      content: { ...content, options: newOptions },
    });
  };

  const removeOption = (optionId: string) => {
    if (content.options.length <= 2) return;
    const newOptions = content.options.filter((opt) => opt.id !== optionId);
    // If we removed the correct answer, make the first one correct
    if (!newOptions.some((opt) => opt.isCorrect)) {
      newOptions[0].isCorrect = true;
    }
    updateQuestion(question.id, {
      content: { ...content, options: newOptions },
    });
  };

  return (
    <div className="space-y-3">
      <Label>Answer Options</Label>
      <div className="space-y-2">
        {content.options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCorrectChange(option.id)}
              className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                option.isCorrect
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/30 hover:border-primary/50'
              )}
            >
              {option.isCorrect && <Check className="h-3 w-3" />}
            </button>
            <Input
              value={option.text}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => removeOption(option.id)}
              disabled={content.options.length <= 2}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={addOption} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Option
      </Button>
    </div>
  );
}

function MultipleSelectEditor({ question }: { question: Question }) {
  const { updateQuestion } = useQuizBuilder();
  const content = question.content as MultipleSelectContent;

  const handleOptionChange = (optionId: string, text: string) => {
    const newOptions = content.options.map((opt) =>
      opt.id === optionId ? { ...opt, text } : opt
    );
    updateQuestion(question.id, {
      content: { ...content, options: newOptions },
    });
  };

  const handleCorrectToggle = (optionId: string) => {
    const newOptions = content.options.map((opt) =>
      opt.id === optionId ? { ...opt, isCorrect: !opt.isCorrect } : opt
    );
    updateQuestion(question.id, {
      content: { ...content, options: newOptions },
    });
  };

  const addOption = () => {
    const newOptions = [
      ...content.options,
      { id: generateId('opt'), text: `Option ${content.options.length + 1}`, isCorrect: false },
    ];
    updateQuestion(question.id, {
      content: { ...content, options: newOptions },
    });
  };

  const removeOption = (optionId: string) => {
    if (content.options.length <= 2) return;
    const newOptions = content.options.filter((opt) => opt.id !== optionId);
    updateQuestion(question.id, {
      content: { ...content, options: newOptions },
    });
  };

  return (
    <div className="space-y-3">
      <Label>Answer Options (select all correct)</Label>
      <div className="space-y-2">
        {content.options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCorrectToggle(option.id)}
              className={cn(
                'w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors',
                option.isCorrect
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/30 hover:border-primary/50'
              )}
            >
              {option.isCorrect && <Check className="h-3 w-3" />}
            </button>
            <Input
              value={option.text}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => removeOption(option.id)}
              disabled={content.options.length <= 2}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={addOption} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Option
      </Button>
    </div>
  );
}

function TrueFalseEditor({ question }: { question: Question }) {
  const { updateQuestion } = useQuizBuilder();
  const content = question.content as TrueFalseContent;

  return (
    <div className="space-y-3">
      <Label>Correct Answer</Label>
      <div className="flex gap-3">
        <Button
          type="button"
          variant={content.correctAnswer ? 'default' : 'outline'}
          className="flex-1 gap-2"
          onClick={() =>
            updateQuestion(question.id, {
              content: { ...content, correctAnswer: true },
            })
          }
        >
          <Check className="h-4 w-4" />
          True
        </Button>
        <Button
          type="button"
          variant={!content.correctAnswer ? 'default' : 'outline'}
          className="flex-1 gap-2"
          onClick={() =>
            updateQuestion(question.id, {
              content: { ...content, correctAnswer: false },
            })
          }
        >
          <X className="h-4 w-4" />
          False
        </Button>
      </div>
    </div>
  );
}

function ShortAnswerEditor({ question }: { question: Question }) {
  const { updateQuestion } = useQuizBuilder();
  const content = question.content as ShortAnswerContent;

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...content.acceptedAnswers];
    newAnswers[index] = value;
    updateQuestion(question.id, {
      content: { ...content, acceptedAnswers: newAnswers },
    });
  };

  const addAnswer = () => {
    updateQuestion(question.id, {
      content: { ...content, acceptedAnswers: [...content.acceptedAnswers, ''] },
    });
  };

  const removeAnswer = (index: number) => {
    if (content.acceptedAnswers.length <= 1) return;
    const newAnswers = content.acceptedAnswers.filter((_, i) => i !== index);
    updateQuestion(question.id, {
      content: { ...content, acceptedAnswers: newAnswers },
    });
  };

  return (
    <div className="space-y-3">
      <Label>Accepted Answers</Label>
      <div className="space-y-2">
        {content.acceptedAnswers.map((answer, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder={`Accepted answer ${index + 1}`}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => removeAnswer(index)}
              disabled={content.acceptedAnswers.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={addAnswer} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Answer
        </Button>
        <div className="flex items-center gap-2">
          <Switch
            checked={content.caseSensitive}
            onCheckedChange={(checked) =>
              updateQuestion(question.id, {
                content: { ...content, caseSensitive: checked },
              })
            }
          />
          <Label className="text-sm">Case sensitive</Label>
        </div>
      </div>
    </div>
  );
}

function FillBlankEditor({ question }: { question: Question }) {
  const { updateQuestion } = useQuizBuilder();
  const content = question.content as FillBlankContent;

  const handleBlankAnswerChange = (blankId: string, answers: string[]) => {
    const newBlanks = content.blanks.map((b) =>
      b.id === blankId ? { ...b, acceptedAnswers: answers } : b
    );
    updateQuestion(question.id, {
      content: { ...content, blanks: newBlanks },
    });
  };

  return (
    <div className="space-y-3">
      <Label>Text with Blanks</Label>
      <Textarea
        value={content.textWithBlanks}
        onChange={(e) =>
          updateQuestion(question.id, {
            content: { ...content, textWithBlanks: e.target.value },
          })
        }
        placeholder="Use {{1}}, {{2}}, etc. for blanks"
        className="min-h-[80px] resize-none font-mono text-sm"
      />
      <p className="text-xs text-muted-foreground">
        Use {'{{1}}'}, {'{{2}}'}, etc. to mark blanks in your text.
      </p>

      {content.blanks.length > 0 && (
        <div className="space-y-3 pt-2">
          <Label>Accepted Answers for Each Blank</Label>
          {content.blanks.map((blank, index) => (
            <div key={blank.id} className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Blank {index + 1} ({`{{${index + 1}}}`})
              </Label>
              <Input
                value={blank.acceptedAnswers.join(', ')}
                onChange={(e) =>
                  handleBlankAnswerChange(
                    blank.id,
                    e.target.value.split(',').map((s) => s.trim())
                  )
                }
                placeholder="Enter accepted answers, separated by commas"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MatchingEditor({ question }: { question: Question }) {
  const { updateQuestion } = useQuizBuilder();
  const content = question.content as MatchingContent;

  const handlePairChange = (pairId: string, field: 'left' | 'right', value: string) => {
    const newPairs = content.pairs.map((p) =>
      p.id === pairId ? { ...p, [field]: value } : p
    );
    updateQuestion(question.id, {
      content: { ...content, pairs: newPairs },
    });
  };

  const addPair = () => {
    const newPairs = [
      ...content.pairs,
      { id: generateId('pair'), left: '', right: '' },
    ];
    updateQuestion(question.id, {
      content: { ...content, pairs: newPairs },
    });
  };

  const removePair = (pairId: string) => {
    if (content.pairs.length <= 2) return;
    const newPairs = content.pairs.filter((p) => p.id !== pairId);
    updateQuestion(question.id, {
      content: { ...content, pairs: newPairs },
    });
  };

  return (
    <div className="space-y-3">
      <Label>Matching Pairs</Label>
      <div className="space-y-2">
        {content.pairs.map((pair, index) => (
          <div key={pair.id} className="flex items-center gap-2">
            <Input
              value={pair.left}
              onChange={(e) => handlePairChange(pair.id, 'left', e.target.value)}
              placeholder={`Item ${index + 1}`}
              className="flex-1"
            />
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              value={pair.right}
              onChange={(e) => handlePairChange(pair.id, 'right', e.target.value)}
              placeholder={`Match ${index + 1}`}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => removePair(pair.id)}
              disabled={content.pairs.length <= 2}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={addPair} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Pair
      </Button>
    </div>
  );
}
