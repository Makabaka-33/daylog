import {
  CheckSquare,
  Calendar,
  Kanban,
  Package,
  Wallet,
  PiggyBank,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "每日任务", href: "/tasks", icon: CheckSquare },
  { label: "近期任务", href: "/tasks/near-term", icon: Calendar },
  { label: "短期计划", href: "/plans", icon: Kanban },
  { label: "快递追踪", href: "/packages", icon: Package },
  { label: "花费记录", href: "/expenses", icon: Wallet },
  { label: "资金汇总", href: "/money", icon: PiggyBank },
  { label: "简历", href: "/resume", icon: FileText },
  { label: "设置", href: "/settings", icon: Settings },
];

export const expenseCategories = [
  { value: "breakfast", label: "早饭" },
  { value: "lunch", label: "午饭" },
  { value: "dinner", label: "晚饭" },
  { value: "snack", label: "小食" },
  { value: "other", label: "其他" },
] as const;

export const packageStatusLabels: Record<string, string> = {
  pending: "待处理",
  in_transit: "运输中",
  out_for_delivery: "派送中",
  delivered: "已送达",
  received: "已签收",
  sent: "已寄出",
  returned: "已退回",
};

export const accountTypeLabels: Record<string, string> = {
  bank: "银行卡",
  alipay: "支付宝",
  wechat: "微信",
  cash: "现金",
  investment: "投资",
  other: "其他",
};
