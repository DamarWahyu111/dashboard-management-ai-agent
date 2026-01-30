'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type TimeframeType } from '@/lib/dashboard';

interface TimeframeSelectorProps {
  value: TimeframeType;
  onChange: (value: TimeframeType) => void;
}

export function TimeframeSelector({ value, onChange }: TimeframeSelectorProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as TimeframeType)}>
      <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-slate-700 border-slate-600">
        <SelectItem value="thisWeek">This Week</SelectItem>
        <SelectItem value="thisMonth">This Month</SelectItem>
        <SelectItem value="custom">Custom Range</SelectItem>
      </SelectContent>
    </Select>
  );
}
