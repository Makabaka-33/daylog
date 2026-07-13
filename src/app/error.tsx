"use client";

import { Button } from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold text-gray-900">出错了</h1>
      <p className="mt-2 text-sm text-gray-500">请稍后再试</p>
      <Button onClick={reset} className="mt-6" variant="secondary">
        重试
      </Button>
    </div>
  );
}
