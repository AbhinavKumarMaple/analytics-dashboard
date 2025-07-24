import React, { useState, useRef, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MarketFilterProps {
  title: string;
  options: { label: string; value: string }[];
  onOptionSelect: (value: string) => void;
  onDateSelect?: (date: Date | undefined) => void;
  initialDate?: Date;
}

const MarketFilter: React.FC<MarketFilterProps> = ({
  title,
  options,
  onOptionSelect,
  onDateSelect,
  initialDate = new Date(),
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(options[0]?.value || "");
  const [date, setDate] = useState<Date>(initialDate);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(initialDate));
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (value: string) => {
    setSelectedOption(value);
    onOptionSelect(value);
  };

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    if (onDateSelect) {
      onDateSelect(selectedDate);
    }
    setIsOpen(false);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Generate days for the current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Create week rows
  const weeks: Date[][] = [];
  let week: Date[] = [];

  // Add empty slots for days before the first of the month
  const firstDayOfMonth = monthStart.getDay();
  for (let i = 0; i < firstDayOfMonth; i++) {
    week.push(new Date(0)); // placeholder
  }

  // Add the actual days
  days.forEach((day) => {
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    week.push(day);
  });

  // Add empty slots for days after the last day of the month
  while (week.length < 7) {
    week.push(new Date(0)); // placeholder
  }

  if (week.length > 0) {
    weeks.push(week);
  }

  return (
    <div className="p- flex items-center justify-between rounded-lg md:p-4">
      <h2 className="max-w-[50px] text-[12px] font-semibold md:w-full md:text-xl ">{title}</h2>
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2">
          {options.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              className={cn(
                "line-clamp-1 w-[70px] rounded-full px-4 py-2 font-dmsans  text-sm font-medium md:w-full",
                selectedOption === option.value
                  ? "bg-white text-blue-700 dark:bg-gray-700 dark:text-white"
                  : "text-text-options hover:bg-gray-50 dark:text-gray-500 dark:hover:bg-gray-400 dark:hover:text-gray-500"
              )}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="relative" ref={calendarRef}>
          <Button
            variant="outline"
            className="h-10 w-[122px] justify-between border-white bg-white px-3 text-left shadow-sm  dark:border-gray-500 dark:bg-gray-600 dark:hover:bg-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="12"
              viewBox="0 0 11 12"
              fill="none"
            >
              <rect
                x="0.511597"
                y="1.4668"
                width="9.97652"
                height="10.0332"
                rx="1"
                stroke="#2B3674"
                stroke-width="0.8"
              />
              <path
                d="M0.511597 4.81989H10.4881V10.4992C10.4881 11.0515 10.0404 11.4992 9.48812 11.4992H1.5116C0.959311 11.4992 0.511597 11.0515 0.511597 10.4992V4.81989Z"
                fill="#2B3674"
                stroke="#2B3674"
                stroke-width="0.8"
              />
              <path
                d="M8.26746 0.5V2.31905"
                stroke="#2B3674"
                stroke-width="0.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.81042 0.5V2.31905"
                stroke="#2B3674"
                stroke-width="0.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span className="font-dmsans text-sm font-semibold ">{format(date, "MMM yyyy")}</span>
            <span className="">
              <svg
                width="11"
                height="11"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue-800"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Button>

          {isOpen && (
            <div className="absolute right-0 z-50 mt-2 w-[280px] rounded-md bg-white p-2 shadow-lg dark:bg-gray-700">
              <div className="mb-2 flex items-center justify-between">
                <button onClick={prevMonth} className="rounded-full p-1 hover:bg-gray-100">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="font-medium">{format(currentMonth, "MMMM yyyy")}</div>
                <button onClick={nextMonth} className="rounded-full p-1 hover:bg-gray-100">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 dark:bg-gray-700">
                <div>Su</div>
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
              </div>

              <div className="mt-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1 dark:bg-gray-700">
                    {week.map((day, dayIndex) => {
                      const isCurrentMonth = isSameMonth(day, currentMonth);
                      const isSelected = isSameDay(day, date);
                      const isValidDate = day.getTime() !== 0;

                      return (
                        <button
                          key={dayIndex}
                          onClick={() => isValidDate && isCurrentMonth && handleDateSelect(day)}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-sm",
                            isValidDate && isCurrentMonth
                              ? "hover:bg-gray-100"
                              : "cursor-default text-gray-300 ",
                            isSelected && "bg-blue-600 text-white hover:bg-blue-700"
                          )}
                          disabled={!isValidDate || !isCurrentMonth}
                        >
                          {isValidDate ? day.getDate() : ""}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketFilter;
