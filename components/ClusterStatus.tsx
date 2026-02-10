"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const STATUS_URL =
  "https://gist.githubusercontent.com/JustinLinKK/486d872f27f8aa46e69978a869f669b6/raw/status.json";

type ClusterNode = {
  name: string;
  role: string;
  reachable: boolean;
  cpu: { usage_percent: number };
  memory: { used_percent: number };
  os: { cpu_temp_c: number };
};

type ClusterSnapshot = {
  thresholds: {
    cpu_usage_percent: { warn: number; crit: number };
    mem_used_percent: { warn: number; crit: number };
    temp_c: { warn: number; crit: number };
  };
  summary: { nodes: { total: number; reachable: number; unreachable: number } };
  nodes: ClusterNode[];
};

type StatusLevel = "ok" | "warn" | "crit" | "unknown";

const levelForUsage = (value: number | null, warn: number, crit: number): StatusLevel => {
  if (value === null || !Number.isFinite(value)) return "unknown";
  if (value >= crit) return "crit";
  if (value >= warn) return "warn";
  return "ok";
};

const levelDotClass = (level: StatusLevel) => {
  if (level === "crit") return "bg-red-500";
  if (level === "warn") return "bg-amber-400";
  if (level === "unknown") return "bg-ink/30";
  return "bg-emerald-500";
};

export default function ClusterStatus() {
  const [snapshot, setSnapshot] = useState<ClusterSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await fetch(STATUS_URL, { cache: "no-store" });
        if (!response.ok) throw new Error("bad-status");
        const data = (await response.json()) as ClusterSnapshot;
        if (isMounted) setSnapshot(data);
      } catch {
        if (isMounted) setSnapshot(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 60_000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const derived = useMemo(() => {
    if (!snapshot) return null;
    const nodes = snapshot.nodes ?? [];
    const masterNode = nodes.find((node) => node.role.toLowerCase().includes("master"));
    const workerNodes = nodes.filter((node) => node.role.toLowerCase().includes("worker"));
    const average = (values: number[]) =>
      values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;

    return {
      masterNode,
      workerCpuUsage: average(workerNodes.map((node) => node.cpu.usage_percent)),
      workerMemUsage: average(workerNodes.map((node) => node.memory.used_percent)),
      workerTemp: average(workerNodes.map((node) => node.os.cpu_temp_c)),
      cpuWarn: snapshot.thresholds.cpu_usage_percent.warn ?? 70,
      cpuCrit: snapshot.thresholds.cpu_usage_percent.crit ?? 90,
      memWarn: snapshot.thresholds.mem_used_percent.warn ?? 70,
      memCrit: snapshot.thresholds.mem_used_percent.crit ?? 90,
      tempWarn: snapshot.thresholds.temp_c.warn ?? 70,
      tempCrit: snapshot.thresholds.temp_c.crit ?? 90
    };
  }, [snapshot]);

  const nodeStatusLevel: StatusLevel =
    snapshot && snapshot.summary.nodes.unreachable > 0 ? "crit" : "ok";

  if (isLoading) {
    return (
      <article className="content-card rounded-2xl border border-ink/10 bg-white/80 p-5 text-sm text-ink/60 shadow-xl">
        Fetching live cluster status…
      </article>
    );
  }

  if (!snapshot || !derived) {
    return (
      <article className="content-card rounded-2xl border border-ink/10 bg-white/80 p-5 text-sm text-ink/60 shadow-xl">
        Unable to load live status. Check <Link href="/cluster-status" className="text-accent">cluster status</Link>.
      </article>
    );
  }

  const {
    masterNode,
    workerCpuUsage,
    workerMemUsage,
    workerTemp,
    cpuWarn,
    cpuCrit,
    memWarn,
    memCrit,
    tempWarn,
    tempCrit
  } = derived;

  return (
    <article className="content-card group rounded-2xl border border-ink/10 bg-white/80 p-5 shadow-xl transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display text-lg font-semibold text-ink group-hover:text-accent">
            <Link href="/cluster-status" className="content-card__title text-ink hover:text-accent">
              Live cluster status
            </Link>
          </h3>
          <span className={`h-2.5 w-2.5 rounded-full ${levelDotClass(nodeStatusLevel)}`} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/70">
            <span>Master CPU usage</span>
            <span className={`h-2.5 w-2.5 rounded-full ${levelDotClass(levelForUsage(masterNode ? masterNode.cpu.usage_percent : null, cpuWarn, cpuCrit))}`} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/70">
            <span>Worker CPU usage</span>
            <span className={`h-2.5 w-2.5 rounded-full ${levelDotClass(levelForUsage(workerCpuUsage, cpuWarn, cpuCrit))}`} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/70">
            <span>Master memory usage</span>
            <span className={`h-2.5 w-2.5 rounded-full ${levelDotClass(levelForUsage(masterNode ? masterNode.memory.used_percent : null, memWarn, memCrit))}`} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/70">
            <span>Worker memory usage</span>
            <span className={`h-2.5 w-2.5 rounded-full ${levelDotClass(levelForUsage(workerMemUsage, memWarn, memCrit))}`} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/70">
            <span>Master CPU temp</span>
            <span className={`h-2.5 w-2.5 rounded-full ${levelDotClass(levelForUsage(masterNode ? masterNode.os.cpu_temp_c : null, tempWarn, tempCrit))}`} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/70">
            <span>Worker CPU temp</span>
            <span className={`h-2.5 w-2.5 rounded-full ${levelDotClass(levelForUsage(workerTemp, tempWarn, tempCrit))}`} />
          </div>
        </div>
        <p className="text-xs text-ink/50">Auto-refreshes every 60s.</p>
      </div>
      <Link href="/cluster-status" className="mt-6 inline-flex text-sm text-accent">
        View full status
      </Link>
    </article>
  );
}
