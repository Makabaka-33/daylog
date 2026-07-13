"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/Tabs";
import { createPackage, deletePackage, updatePackageStatus } from "@/actions/packages";
import { packageStatusLabels } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Package, Trash2 } from "lucide-react";

interface Pkg {
  id: string;
  trackingNumber: string;
  carrier: string | null;
  direction: "send" | "receive";
  description: string | null;
  status: string;
  estimatedDelivery: string | null;
}

interface Props {
  packages: Pkg[];
}

const tabs = [
  { value: "all", label: "全部" },
  { value: "receive", label: "待取" },
  { value: "send", label: "待寄" },
];

export function PackageTabs({ packages }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState("all");
  const [showAdd, setShowAdd] = useState(false);

  const filtered =
    tab === "all"
      ? packages
      : packages.filter((p) => p.direction === tab);

  async function handleDelete(id: string) {
    await deletePackage(id);
    router.refresh();
  }

  async function handleStatusChange(packageId: string, newStatus: string) {
    await updatePackageStatus(packageId, newStatus);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs tabs={tabs} value={tab} onChange={setTab} />
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={14} className="mr-1" />
          添加快递
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="暂无快递"
          description="点击按钮添加快递信息"
          icon={<Package size={32} />}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((pkg) => (
            <div
              key={pkg.id}
              className="group flex items-center gap-3 rounded-lg border px-4 py-3 hover:bg-gray-50"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">
                    {pkg.carrier ? `${pkg.carrier} ` : ""}{pkg.trackingNumber}
                  </span>
                  <span className="text-xs text-gray-400">
                    {pkg.direction === "send" ? "寄" : "取"}
                  </span>
                </div>
                {pkg.description && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {pkg.description}
                  </p>
                )}
                {pkg.estimatedDelivery && (
                  <p className="text-xs text-gray-400">
                    预计: {pkg.estimatedDelivery}
                  </p>
                )}
              </div>
              <select
                value={pkg.status}
                onChange={(e) => handleStatusChange(pkg.id, e.target.value)}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 outline-none"
              >
                {Object.entries(packageStatusLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <button
                onClick={() => handleDelete(pkg.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <AddPackageModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={() => {
          setShowAdd(false);
          router.refresh();
        }}
      />
    </div>
  );
}

function AddPackageModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [direction, setDirection] = useState<"send" | "receive">("receive");
  const [description, setDescription] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trackingNumber || loading) return;
    setLoading(true);

    const formData = new FormData();
    formData.set("trackingNumber", trackingNumber);
    formData.set("carrier", carrier);
    formData.set("direction", direction);
    formData.set("description", description);
    formData.set("estimatedDelivery", estimatedDelivery);
    await createPackage(formData);

    setLoading(false);
    onCreated();
  }

  return (
    <Modal open={open} onClose={onClose} title="添加快递">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            类型
          </label>
          <div className="flex gap-2">
            {[
              { value: "receive", label: "取件" },
              { value: "send", label: "寄件" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDirection(opt.value as "send" | "receive")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  direction === opt.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            快递单号
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="请输入快递单号"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            快递公司
          </label>
          <input
            type="text"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="顺丰/中通/圆通..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            描述
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="网购衣服/寄文件..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            预计送达
          </label>
          <input
            type="date"
            value={estimatedDelivery}
            onChange={(e) => setEstimatedDelivery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "保存中..." : "保存"}
        </Button>
      </form>
    </Modal>
  );
}
