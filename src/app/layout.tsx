import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DayLog - 个人生活管理中心",
  description: "任务、计划、快递、花费、资金、简历一站式管理",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased text-gray-900 bg-white">
        {children}
      </body>
    </html>
  );
}
