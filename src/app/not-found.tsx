import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-500">页面未找到</p>
      <Link href="/tasks" className="mt-6">
        <Button variant="secondary">返回首页</Button>
      </Link>
    </div>
  );
}
