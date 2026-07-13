"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAccount, deleteAccount, updateAccountBalance } from "@/actions/money";
import { accountTypeLabels } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, PiggyBank, Trash2, Edit3 } from "lucide-react";

interface Account {
  id: string;
  name: string;
  accountType: string;
  balance: number;
}

interface Props {
  accounts: Account[];
  totalBalance: number;
}

export function AccountsOverview({ accounts, totalBalance }: Props) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState("");

  async function handleDelete(id: string) {
    await deleteAccount(id);
    router.refresh();
  }

  function startEdit(account: Account) {
    setEditingId(account.id);
    setEditBalance(String(account.balance));
  }

  async function handleSaveBalance(accountId: string) {
    const balance = parseFloat(editBalance);
    if (isNaN(balance)) return;
    setEditingId(null);
    await updateAccountBalance(accountId, balance);
    router.refresh();
  }

  async function handleAdd(formData: FormData) {
    await createAccount(formData);
    router.refresh();
    setShowAdd(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
          账户汇总
        </h2>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={14} className="mr-1" />
          添加账户
        </Button>
      </div>

      <Card className="p-4 bg-gray-900 text-white">
        <p className="text-sm text-gray-400">总资产</p>
        <p className="text-2xl font-bold mt-1">{formatCurrency(totalBalance)}</p>
      </Card>

      {accounts.length === 0 ? (
        <EmptyState
          title="暂无账户"
          description="添加你的银行卡、支付宝等账户"
          icon={<PiggyBank size={32} />}
        />
      ) : (
        <div className="space-y-2">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="group flex items-center gap-3 rounded-lg border px-4 py-3 hover:bg-gray-50"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{account.name}</p>
                <p className="text-xs text-gray-400">
                  {accountTypeLabels[account.accountType] || account.accountType}
                </p>
              </div>
              {editingId === account.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editBalance}
                    onChange={(e) => setEditBalance(e.target.value)}
                    className="w-24 rounded border px-2 py-1 text-sm text-right"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveBalance(account.id);
                    }}
                  />
                  <Button size="sm" onClick={() => handleSaveBalance(account.id)}>
                    保存
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-sm font-medium">
                    {formatCurrency(account.balance)}
                  </span>
                  <button
                    onClick={() => startEdit(account)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <AddAccountModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}

function AddAccountModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (formData: FormData) => void;
}) {
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState("bank");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !balance || loading) return;
    setLoading(true);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("accountType", accountType);
    formData.set("balance", balance);
    await onAdd(formData);

    setLoading(false);
    setName("");
    setBalance("");
  }

  return (
    <Modal open={open} onClose={onClose} title="添加账户">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            账户名称
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="工商银行储蓄卡"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            类型
          </label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
          >
            {Object.entries(accountTypeLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            余额
          </label>
          <input
            type="number"
            step="0.01"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="0.00"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "保存中..." : "保存"}
        </Button>
      </form>
    </Modal>
  );
}
