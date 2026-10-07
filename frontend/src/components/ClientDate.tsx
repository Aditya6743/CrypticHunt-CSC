"use client";
import { useEffect, useState } from "react";

export default function ClientDate({ date }: { date: Date | string }) {
  const [formatted, setFormatted] = useState("Loading...");

  useEffect(() => {
    const d = new Date(date);
    setFormatted(d.toLocaleString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }));
  }, [date]);

  return <span>{formatted}</span>;
}
