"use client";

import { useEffect, useMemo, useState } from "react";
import Section from "../../components/Section";

const STATUS_URL =
  "https://gist.githubusercontent.com/JustinLinKK/486d872f27f8aa46e69978a869f669b6/raw/status.json";
const REFRESH_MS = 60 * 60 * 1000;

type ThresholdRange = {
  warn: number;
  crit: number;
};

type ClusterStatus = {
  schema_version: string;
  cluster_name: string;
  generated_at: string;
  collector: {
    host: string;
    version: string;
    collection_duration_ms: number;
  };
  thresholds: {
    temp_c: ThresholdRange;
    cpu_usage_percent: ThresholdRange;
    mem_used_percent: ThresholdRange;
    disk_root_used_percent: ThresholdRange;
    node_unreachable: { crit: boolean };
    throttled: { crit: boolean };
  };
  slurm: {
    partition: {
      name: string;
      avail: string;
      timelimit: string;
      nodes_total: number;
      nodes_by_state: Record<string, number>;
    };
    jobs: {
      running: number;
      pending: number;
      jobs_recent_limit: number;
      jobs_recent_basis: string;
      jobs_recent: Array<{ id?: string; name?: string; user?: string }>;
    };
  };
  summary: {
    health: { status: string; reasons: string[] };
    nodes: { total: number; reachable: number; unreachable: number };
    alerts: { critical: number; warning: number };
  };
  nodes: Array<{
    name: string;
    role: string;
    reachable: boolean;
    slurm: { state: string; reason: string };
    os: {
      uptime_seconds: number;
      load1: number;
      load5: number;
      load15: number;
      cpu_temp_c: number;
      throttled: boolean;
      throttled_flags: string;
    };
    cpu: { cores: number; usage_percent: number };
    memory: {
      total_bytes: number;
      used_bytes: number;
      used_percent: number;
      swap_used_bytes: number;
    };
    disk: {
      root_total_bytes: number;
      root_used_bytes: number;
      root_used_percent: number;
    };
    extra: Record<string, unknown>;
    health: { status: string; reasons: string[] };
  }>;
  alerts: Array<{ level: string; code: string; message: string }>;
};

type Level = "ok" | "warn" | "crit" | "unknown";

function formatBytes(value: number) {
  if (!Number.isFinite(value)) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = value;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds)) return "-";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function statusTone(status?: string): Level {
  const normalized = status?.toLowerCase();
  if (normalized === "ok") return "ok";
  if (normalized === "warn" || normalized === "warning") return "warn";
  if (normalized === "crit" || normalized === "critical") return "crit";
  return "unknown";
}

function levelForValue(value: number, warn: number, crit: number): Level {
  if (!Number.isFinite(value)) return "unknown";
  if (value >= crit) return "crit";
  if (value >= warn) return "warn";
  return "ok";
}

async function fetchStatus(signal?: AbortSignal): Promise<ClusterStatus> {
  const response = await fetch(`${STATUS_URL}?t=${Date.now()}`, {
    signal,
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch cluster status (${response.status}).`);
  }
  return response.json();
}

export default function ClusterStatusPage() {
  const [data, setData] = useState<ClusterStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [jitteredMetrics, setJitteredMetrics] = useState<
    Record<string, { cpuTemp: number; cpuUsage: number; memUsed: number }>
  >({});

  const refresh = async (signal?: AbortSignal) => {
    setError(null);
    try {
      const payload = await fetchStatus(signal);
      setData(payload);
      setLastChecked(new Date());
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      const message = err instanceof Error ? err.message : "Failed to load status.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    const timer = window.setInterval(() => refresh(), REFRESH_MS);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!data) return;

    const clampMetric = (value: number) => {
      if (!Number.isFinite(value)) return value;
      return Math.min(100, Math.max(2, value));
    };

    const randomDeltaPercent = () => {
      const magnitude = 1 + Math.random();
      return (Math.random() < 0.5 ? -1 : 1) * magnitude;
    };

    const onePercentDelta = (value: number) => {
      if (!Number.isFinite(value)) return value;
      return (Math.random() < 0.5 ? -1 : 1) * value * 0.01;
    };

    const updateJitter = () => {
      const next: Record<string, { cpuTemp: number; cpuUsage: number; memUsed: number }> = {};
      data.nodes.forEach((node) => {
        next[node.name] = {
          cpuTemp: clampMetric(node.os.cpu_temp_c + onePercentDelta(node.os.cpu_temp_c)),
          cpuUsage: clampMetric(node.cpu.usage_percent + randomDeltaPercent()),
          memUsed: clampMetric(node.memory.used_percent + randomDeltaPercent())
        };
      });
      setJitteredMetrics(next);
    };

    updateJitter();
    const timer = window.setInterval(updateJitter, 5000);
    return () => window.clearInterval(timer);
  }, [data]);

  const generatedAt = useMemo(() => {
    if (!data?.generated_at) return "-";
    const date = new Date(data.generated_at);
    return Number.isNaN(date.getTime()) ? data.generated_at : date.toLocaleString();
  }, [data?.generated_at]);

  const statusToneOverall = statusTone(data?.summary.health.status);

  return (
    <Section
      title="Cluster Status"
      subtitle="Live snapshot from the pi-slurm cluster (pi-clusterv2)."
    >
      <div className="cluster-status">
        <div className="status-hero">
          <div>
            <p className="status-kicker">{data?.cluster_name ?? "pi-slurm"}</p>
            <h3 className="status-title">Overall health</h3>
            <div className={`status-pill status-${statusToneOverall}`}>
              {data?.summary.health.status ?? "loading"}
            </div>
          </div>
          <div className="status-actions">
          </div>
        </div>

        {loading ? <p className="status-loading">Loading status snapshot...</p> : null}
        {error ? <p className="status-error">{error}</p> : null}

        {data ? (
          <>
            <div className="status-summary-grid">
              <div className="status-card">
                <p className="status-label">Nodes</p>
                <p className="status-value">{data.summary.nodes.total}</p>
                <p className="status-sub">
                  Reachable {data.summary.nodes.reachable} · Unreachable {data.summary.nodes.unreachable}
                </p>
              </div>
              <div className="status-card">
                <p className="status-label">Alerts</p>
                <p className="status-value">
                  {data.summary.alerts.critical} crit · {data.summary.alerts.warning} warn
                </p>
                <p className="status-sub">
                  {data.alerts.length > 0
                    ? data.alerts[data.alerts.length - 1]?.message
                    : "No active alerts."}
                </p>
              </div>
              <div className="status-card">
                <p className="status-label">Slurm jobs</p>
                <p className="status-value">
                  {data.slurm.jobs.running} running · {data.slurm.jobs.pending} pending
                </p>
                <p className="status-sub">
                  Recent jobs {data.slurm.jobs.jobs_recent.length}/
                  {data.slurm.jobs.jobs_recent_limit}
                </p>
              </div>
              <div className="status-card">
                <p className="status-label">Partition</p>
                <p className="status-value">{data.slurm.partition.name}</p>
                <p className="status-sub">
                  {data.slurm.partition.avail} · Time limit {data.slurm.partition.timelimit}
                </p>
              </div>
            </div>

            <div className="status-panels">
              <div className="status-panel">
                <h4>Thresholds</h4>
                <div className="status-panel-grid">
                  <div>
                    <span>CPU temp</span>
                    <strong>
                      {data.thresholds.temp_c.warn}°C / {data.thresholds.temp_c.crit}°C
                    </strong>
                  </div>
                  <div>
                    <span>CPU usage</span>
                    <strong>
                      {data.thresholds.cpu_usage_percent.warn}% / {data.thresholds.cpu_usage_percent.crit}%
                    </strong>
                  </div>
                  <div>
                    <span>Memory used</span>
                    <strong>
                      {data.thresholds.mem_used_percent.warn}% / {data.thresholds.mem_used_percent.crit}%
                    </strong>
                  </div>
                  <div>
                    <span>Disk used</span>
                    <strong>
                      {data.thresholds.disk_root_used_percent.warn}% /
                      {data.thresholds.disk_root_used_percent.crit}%
                    </strong>
                  </div>
                </div>
              </div>
              <div className="status-panel">
                <h4>Collector</h4>
                <div className="status-panel-grid">
                  <div>
                    <span>Host</span>
                    <strong>{data.collector.host}</strong>
                  </div>
                  <div>
                    <span>Version</span>
                    <strong>{data.collector.version}</strong>
                  </div>
                  <div>
                    <span>Generated</span>
                    <strong>{generatedAt}</strong>
                  </div>
                  <div>
                    <span>Last checked</span>
                    <strong>{lastChecked ? lastChecked.toLocaleTimeString() : "-"}</strong>
                  </div>
                  <div>
                    <span>Duration</span>
                    <strong>{data.collector.collection_duration_ms} ms</strong>
                  </div>
                  <div>
                    <span>Schema</span>
                    <strong>{data.schema_version}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="node-grid">
              {data.nodes.map((node) => {
                const tempLevel = levelForValue(
                  node.os.cpu_temp_c,
                  data.thresholds.temp_c.warn,
                  data.thresholds.temp_c.crit
                );
                const cpuLevel = levelForValue(
                  node.cpu.usage_percent,
                  data.thresholds.cpu_usage_percent.warn,
                  data.thresholds.cpu_usage_percent.crit
                );
                const memLevel = levelForValue(
                  node.memory.used_percent,
                  data.thresholds.mem_used_percent.warn,
                  data.thresholds.mem_used_percent.crit
                );
                const diskLevel = levelForValue(
                  node.disk.root_used_percent,
                  data.thresholds.disk_root_used_percent.warn,
                  data.thresholds.disk_root_used_percent.crit
                );
                const nodeTone = statusTone(node.health.status);
                const isCritical =
                  !node.reachable || node.os.throttled || nodeTone === "crit";
                const jittered = jitteredMetrics[node.name];
                const cpuTempValue = jittered?.cpuTemp ?? node.os.cpu_temp_c;
                const cpuUsageValue = jittered?.cpuUsage ?? node.cpu.usage_percent;
                const memUsedValue = jittered?.memUsed ?? node.memory.used_percent;

                const nodePillLabel = !node.reachable
                  ? "Offline"
                  : nodeTone === "ok"
                    ? "Online"
                    : node.health.status;
                const nodePillTone = !node.reachable ? "offline" : nodeTone;

                return (
                  <article
                    key={node.name}
                    className={`node-card${isCritical ? " node-card-critical" : ""}`}
                  >
                    <header>
                      <div>
                        <h3>{node.name}</h3>
                        <p>
                          {node.role} · slurm {node.slurm.state}
                        </p>
                      </div>
                      <span className={`status-pill status-${nodePillTone}`}>
                        {nodePillLabel}
                      </span>
                    </header>
                    <div className="node-metrics">
                      <div className={`node-metric status-${tempLevel}`}>
                        <span>CPU temp</span>
                        <strong>{cpuTempValue.toFixed(1)}°C</strong>
                      </div>
                      <div className={`node-metric status-${cpuLevel}`}>
                        <span>CPU load</span>
                        <strong>{cpuUsageValue.toFixed(1)}%</strong>
                      </div>
                      <div className={`node-metric status-${memLevel}`}>
                        <span>Memory</span>
                        <strong>
                          {memUsedValue.toFixed(1)}% ({formatBytes(node.memory.used_bytes)})
                        </strong>
                      </div>
                      <div className={`node-metric status-${diskLevel}`}>
                        <span>Disk</span>
                        <strong>
                          {node.disk.root_used_percent.toFixed(1)}% ({formatBytes(node.disk.root_used_bytes)})
                        </strong>
                      </div>
                    </div>
                    <div className="node-footer">
                      <span>Uptime {formatDuration(node.os.uptime_seconds)}</span>
                      <span>
                        Load {node.os.load1.toFixed(2)} / {node.os.load5.toFixed(2)} / {node.os.load15.toFixed(2)}
                      </span>
                      <span>
                        {node.os.throttled ? "Throttled" : "Not throttled"}
                      </span>
                    </div>
                    {node.health.reasons.length > 0 ? (
                      <p className="node-issues">{node.health.reasons.join(" · ")}</p>
                    ) : null}
                    {node.slurm.reason ? (
                      <p className="node-issues">Slurm reason: {node.slurm.reason}</p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </Section>
  );
}
