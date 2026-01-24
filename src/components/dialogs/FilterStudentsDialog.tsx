import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { demoCourses } from "@/lib/demo-data";

export interface StudentFilters {
  status: string[];
  course: string;
  progressMin: string;
  progressMax: string;
}

interface FilterStudentsPopoverProps {
  filters: StudentFilters;
  onFiltersChange: (filters: StudentFilters) => void;
  onClear: () => void;
}

export function FilterStudentsPopover({ filters, onFiltersChange, onClear }: FilterStudentsPopoverProps) {
  const [open, setOpen] = useState(false);

  const toggleStatus = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatus });
  };

  const hasActiveFilters = filters.status.length > 0 || filters.course || filters.progressMin || filters.progressMax;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {filters.status.length + (filters.course ? 1 : 0)}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter Students</h4>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={onClear}>
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm">Status</Label>
            <div className="space-y-2">
              {["active", "at-risk", "inactive"].map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.status.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm font-normal capitalize">
                    {status.replace("-", " ")}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Course */}
          <div className="space-y-2">
            <Label className="text-sm">Course</Label>
            <Select
              value={filters.course}
              onValueChange={(value) => onFiltersChange({ ...filters, course: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {demoCourses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Progress Range */}
          <div className="space-y-2">
            <Label className="text-sm">Progress Range</Label>
            <div className="flex items-center gap-2">
              <Select
                value={filters.progressMin}
                onValueChange={(value) => onFiltersChange({ ...filters, progressMin: value })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0%</SelectItem>
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="75">75%</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">to</span>
              <Select
                value={filters.progressMax}
                onValueChange={(value) => onFiltersChange({ ...filters, progressMax: value })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Max" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="75">75%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full" onClick={() => setOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
