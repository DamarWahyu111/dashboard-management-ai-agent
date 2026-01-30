'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';

interface DateRange {
  start: Date;
  end: Date;
}

interface DateRangePickerProps {
  onRangeSelect: (range: DateRange) => void;
  onClose?: () => void;
}

export function DateRangePicker({ onRangeSelect, onClose }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [error, setError] = useState('');

  const handleApply = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setError('Start date must be before end date');
      return;
    }

    onRangeSelect({ start, end });
    setError('');
  };

  const renderCalendar = (date: string, onChange: (date: string) => void, label: string) => {
    const today = new Date();
    const currentMonth = date ? new Date(date) : today;
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const monthName = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <p className="text-white text-sm font-semibold mb-3">{label}</p>
        <p className="text-slate-400 text-xs mb-3">{monthName}</p>
        <div className="grid grid-cols-7 gap-1 mb-3">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="text-center text-xs text-slate-500 font-medium py-1">
              {d}
            </div>
          ))}
          {days.map((day, i) => (
            <button
              key={i}
              onClick={() => {
                if (day) {
                  const d = String(day).padStart(2, '0');
                  const m = String(month + 1).padStart(2, '0');
                  onChange(`${year}-${m}-${d}`);
                }
              }}
              className={`text-xs py-1 rounded ${
                day === null
                  ? ''
                  : date === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 text-white text-xs px-2 py-1 rounded"
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Calendar size={18} />
            Select Date Range
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 mb-4">
          {renderCalendar(startDate, setStartDate, 'Start Date')}
          {renderCalendar(endDate, setEndDate, 'End Date')}
        </div>

        {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

        <div className="flex gap-2">
          <Button
            onClick={handleApply}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
