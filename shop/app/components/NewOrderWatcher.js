"use client";
import { useEffect, useRef, useState } from "react";

export default function NewOrderWatcher({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  const audio = useRef(null);

  useEffect(() => {
    audio.current = new Audio("/chime.wav");
    const interval = setInterval(async () => {
      const res = await fetch("/api/admin/order-count");
      const data = await res.json();
      if (data.count > count) {
        audio.current.play().catch(() => {});
        setCount(data.count);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [count]);

  return null;
}