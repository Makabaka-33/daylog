"use client";

import { useState } from "react";
import { upsertProfile } from "@/actions/resume";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Briefcase } from "lucide-react";

interface Profile {
  id: string;
  desiredJob: string | null;
  desiredIndustry: string | null;
  desiredSalary: string | null;
  desiredLocation: string | null;
  notes: string | null;
}

interface Props {
  profile: Profile | null | undefined;
}

export function WhatIWantSection({ profile }: Props) {
  const [editing, setEditing] = useState(false);
  const [desiredJob, setDesiredJob] = useState(profile?.desiredJob || "");
  const [desiredIndustry, setDesiredIndustry] = useState(profile?.desiredIndustry || "");
  const [desiredSalary, setDesiredSalary] = useState(profile?.desiredSalary || "");
  const [desiredLocation, setDesiredLocation] = useState(profile?.desiredLocation || "");
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.set("desiredJob", desiredJob);
    formData.set("desiredIndustry", desiredIndustry);
    formData.set("desiredSalary", desiredSalary);
    formData.set("desiredLocation", desiredLocation);
    await upsertProfile(formData);

    setLoading(false);
    setEditing(false);
  }

  if (!editing && !profile?.desiredJob) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
          我想要
        </h2>
        <EmptyState
          title="未填写目标"
          description="写下你想要的职位和方向"
          icon={<Briefcase size={32} />}
        />
        <Button size="sm" onClick={() => setEditing(true)}>
          填写目标
        </Button>
      </div>
    );
  }

  if (!editing && profile) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
            我想要
          </h2>
          <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
            编辑
          </Button>
        </div>
        <Card className="p-4 space-y-2">
          {profile.desiredJob && (
            <div>
              <span className="text-xs text-gray-400">目标职位</span>
              <p className="text-sm font-medium">{profile.desiredJob}</p>
            </div>
          )}
          {profile.desiredIndustry && (
            <div>
              <span className="text-xs text-gray-400">目标行业</span>
              <p className="text-sm">{profile.desiredIndustry}</p>
            </div>
          )}
          {profile.desiredSalary && (
            <div>
              <span className="text-xs text-gray-400">期望薪资</span>
              <p className="text-sm">{profile.desiredSalary}</p>
            </div>
          )}
          {profile.desiredLocation && (
            <div>
              <span className="text-xs text-gray-400">期望地点</span>
              <p className="text-sm">{profile.desiredLocation}</p>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
        我想要
      </h2>
      <form onSubmit={handleSave} className="space-y-3">
        <input
          type="text"
          value={desiredJob}
          onChange={(e) => setDesiredJob(e.target.value)}
          placeholder="目标职位"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
        <input
          type="text"
          value={desiredIndustry}
          onChange={(e) => setDesiredIndustry(e.target.value)}
          placeholder="目标行业"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
        <input
          type="text"
          value={desiredSalary}
          onChange={(e) => setDesiredSalary(e.target.value)}
          placeholder="期望薪资"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
        <input
          type="text"
          value={desiredLocation}
          onChange={(e) => setDesiredLocation(e.target.value)}
          placeholder="期望地点"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "保存中..." : "保存"}
          </Button>
          <Button type="button" size="sm" variant="secondary" onClick={() => setEditing(false)}>
            取消
          </Button>
        </div>
      </form>
    </div>
  );
}
