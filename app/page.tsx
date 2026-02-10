import Link from "next/link";
import Section from "../components/Section";
import ContentCard from "../components/ContentCard";
import { getPageContent, getProjects, getTechGallery, getPosts } from "../lib/content";
import { renderMarkdown } from "../lib/markdown";
import { formatDate } from "../lib/format";

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

async function getClusterSnapshot(): Promise<ClusterSnapshot | null> {
  try {
    const response = await fetch(STATUS_URL, { cache: "no-store" });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const about = getPageContent("about");
  const aboutHtml = about ? await renderMarkdown(about.content) : "";

  const projects = getProjects().slice(0, 2);
  const techGallery = getTechGallery().slice(0, 1);
  const posts = getPosts().slice(0, 3);
  const clusterSnapshot = await getClusterSnapshot();

  type Project = typeof projects[number];
  type TechItem = typeof techGallery[number];
  type Post = typeof posts[number];
  const nodes = clusterSnapshot?.nodes ?? [];
  const masterNode = nodes.find((node) => node.role.toLowerCase().includes("master"));
  const workerNodes = nodes.filter((node) => node.role.toLowerCase().includes("worker"));
  const workerCpuUsage =
    workerNodes.length > 0
      ? workerNodes.reduce((sum, node) => sum + node.cpu.usage_percent, 0) / workerNodes.length
      : null;
  const workerMemUsage =
    workerNodes.length > 0
      ? workerNodes.reduce((sum, node) => sum + node.memory.used_percent, 0) / workerNodes.length
      : null;
  const workerTemp =
    workerNodes.length > 0
      ? workerNodes.reduce((sum, node) => sum + node.os.cpu_temp_c, 0) / workerNodes.length
      : null;
  const cpuWarn = clusterSnapshot?.thresholds.cpu_usage_percent.warn ?? 70;
  const cpuCrit = clusterSnapshot?.thresholds.cpu_usage_percent.crit ?? 90;
  const memWarn = clusterSnapshot?.thresholds.mem_used_percent.warn ?? 70;
  const memCrit = clusterSnapshot?.thresholds.mem_used_percent.crit ?? 90;
  const tempWarn = clusterSnapshot?.thresholds.temp_c.warn ?? 70;
  const tempCrit = clusterSnapshot?.thresholds.temp_c.crit ?? 90;

  const levelForUsage = (value: number | null, warn: number, crit: number) => {
    if (value === null || !Number.isFinite(value)) return "unknown";
    if (value >= crit) return "crit";
    if (value >= warn) return "warn";
    return "ok";
  };

  const nodeStatusLevel =
    clusterSnapshot && clusterSnapshot.summary.nodes.unreachable > 0 ? "crit" : "ok";

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-ink/10 bg-white/80 p-8 shadow-xl">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-ink/50">About</p>
        <div
          className="prose-content mx-auto mt-4 max-w-3xl text-ink/80"
          dangerouslySetInnerHTML={{ __html: aboutHtml }}
        />
        <Link
          href="/experience"
          className="mt-6 inline-flex justify-center text-base font-semibold text-accent"
        >
          See full experience
        </Link>
      </section>

      <Section
        title="Latest projects"
        subtitle="Build, integration and research"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((item: Project) => (
            <ContentCard
              key={item.slug}
              href={`/projects/${item.slug}`}
              title={item.title}
              meta={formatDate(item.date)}
              excerptHtml={item.excerpt}
            />
          ))}
        </div>
      </Section>

      <Section title="Cluster status" subtitle="Snapshot of pi-slurm health.">
        <article className="content-card group rounded-2xl border border-ink/10 bg-white/80 p-5 shadow-xl transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display text-lg font-semibold text-ink group-hover:text-accent">
                <Link href="/cluster-status" className="content-card__title text-ink hover:text-accent">
                  Live cluster status
                </Link>
              </h3>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  nodeStatusLevel === "crit"
                    ? "bg-red-500"
                    : nodeStatusLevel === "warn"
                      ? "bg-amber-400"
                      : "bg-emerald-500"
                }`}
              />
            </div>
            {clusterSnapshot ? (
              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/70">
                  <span>Master CPU usage</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      levelForUsage(masterNode ? masterNode.cpu.usage_percent : null, cpuWarn, cpuCrit) === "crit"
                        ? "bg-red-500"
                        : levelForUsage(masterNode ? masterNode.cpu.usage_percent : null, cpuWarn, cpuCrit) === "warn"
                          ? "bg-amber-400"
                          : levelForUsage(masterNode ? masterNode.cpu.usage_percent : null, cpuWarn, cpuCrit) ===
                              "unknown"
                            ? "bg-ink/30"
                            : "bg-emerald-500"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/70">
                  <span>Worker CPU usage</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      levelForUsage(workerCpuUsage, cpuWarn, cpuCrit) === "crit"
                        ? "bg-red-500"
                        : levelForUsage(workerCpuUsage, cpuWarn, cpuCrit) === "warn"
                          ? "bg-amber-400"
                          : levelForUsage(workerCpuUsage, cpuWarn, cpuCrit) === "unknown"
                            ? "bg-ink/30"
                            : "bg-emerald-500"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/70">
                  <span>Master memory usage</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      levelForUsage(masterNode ? masterNode.memory.used_percent : null, memWarn, memCrit) === "crit"
                        ? "bg-red-500"
                        : levelForUsage(masterNode ? masterNode.memory.used_percent : null, memWarn, memCrit) === "warn"
                          ? "bg-amber-400"
                          : levelForUsage(masterNode ? masterNode.memory.used_percent : null, memWarn, memCrit) ===
                              "unknown"
                            ? "bg-ink/30"
                            : "bg-emerald-500"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/70">
                  <span>Worker memory usage</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      levelForUsage(workerMemUsage, memWarn, memCrit) === "crit"
                        ? "bg-red-500"
                        : levelForUsage(workerMemUsage, memWarn, memCrit) === "warn"
                          ? "bg-amber-400"
                          : levelForUsage(workerMemUsage, memWarn, memCrit) === "unknown"
                            ? "bg-ink/30"
                            : "bg-emerald-500"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/70">
                  <span>Master CPU temp</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      levelForUsage(masterNode ? masterNode.os.cpu_temp_c : null, tempWarn, tempCrit) === "crit"
                        ? "bg-red-500"
                        : levelForUsage(masterNode ? masterNode.os.cpu_temp_c : null, tempWarn, tempCrit) === "warn"
                          ? "bg-amber-400"
                          : levelForUsage(masterNode ? masterNode.os.cpu_temp_c : null, tempWarn, tempCrit) ===
                              "unknown"
                            ? "bg-ink/30"
                            : "bg-emerald-500"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/70">
                  <span>Worker CPU temp</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      levelForUsage(workerTemp, tempWarn, tempCrit) === "crit"
                        ? "bg-red-500"
                        : levelForUsage(workerTemp, tempWarn, tempCrit) === "warn"
                          ? "bg-amber-400"
                          : levelForUsage(workerTemp, tempWarn, tempCrit) === "unknown"
                            ? "bg-ink/30"
                            : "bg-emerald-500"
                    }`}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-ink/60">Status data currently unavailable.</p>
            )}
          </div>
          <Link href="/cluster-status" className="mt-6 inline-flex text-sm text-accent">
            View full status
          </Link>
        </article>
      </Section>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Gallery" subtitle="Photos and quick notes.">
          <div className="grid gap-4">
            {techGallery.map((item: TechItem) => (
              <ContentCard
                key={item.slug}
                href={`/tech-gallery/${item.slug}`}
                title={item.title}
                meta={formatDate(item.date)}
                excerptHtml={item.excerpt}
              />
            ))}
          </div>
        </Section>
        <Section title="Latest writing" subtitle="Reflections, logs and writing.">
          <div className="grid gap-4">
            {posts.map((item: Post) => (
              <ContentCard
                key={item.slug}
                href={`/blog/${item.slug}`}
                title={item.title}
                meta={formatDate(item.date)}
              />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
