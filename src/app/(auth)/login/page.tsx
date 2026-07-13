"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("用户名或密码错误");
      setLoading(false);
    } else {
      router.push("/tasks");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-2">DayLog</h1>
      <p className="text-gray-500 text-center text-sm mb-8">
        个人生活管理中心
      </p>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            用户名
          </label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            密码
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            required
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "登录中..." : "登录"}
        </Button>
      </form>
    </div>
  );
}
