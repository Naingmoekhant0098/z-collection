import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({ date, setDate }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-9 justify-start text-left font-normal border-slate-200 rounded-lg px-2",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-3.5 w-3.5 text-slate-500" />
            <span className="text-[11px] font-semibold uppercase tracking-tight truncate">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "MMM dd")} - {format(date.to, "MMM dd")}
                  </>
                ) : (
                  format(date.from, "MMM dd")
                )
              ) : (
                "Select Dates"
              )}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 rounded-xl shadow-lg border-slate-100"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={isDesktop ? 2 : 1}
            // Applying "Small" styling to the internal calendar
            className="p-2"
            classNames={{
              month: "space-y-3",
              caption: "flex justify-center pt-1 relative items-center px-8",
              caption_label: "text-xs font-bold uppercase tracking-widest",
              head_cell:
                "text-slate-400 rounded-md w-8 font-normal text-[10px] uppercase",
              cell: "h-8 w-8 text-center text-xs p-0 relative",
              day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 rounded-md transition-all",
              day_selected:
                "bg-pink-500 text-white hover:bg-pink-600 focus:bg-pink-500",
              day_today: "bg-slate-100 text-slate-900",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
