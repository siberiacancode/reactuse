"use client"

import { Calendar } from "@/examples/radix/ui/calendar"

function CalendarCaption() {
  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      className="rounded-lg border"
    />
  )
}
