'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { ArrowRight, Cloud, Server, Globe, Zap, Cpu, Radio } from 'lucide-react';

type RenderingStrategy = 'csr' | 'edge';

interface Stage {
  name: string;
  duration: number;
  color: string;
  icon: ReactNode;
}

interface RenderMetricState {
  csrTTFB: number | null;
  edgeTTFB: number | null;
  lastUpdated: string | null;
  loading: boolean;
  error: string | null;
}

const strategyDefinitions: Record<RenderingStrategy, { label: string; description: string; color: string }> = {
  csr: {
    label: 'Client-Side Rendering',
    description: 'Data is fetched and rendered entirely in the browser using JavaScript',
    color: 'from-cyan-400 to-blue-500',
  },
  edge: {
    label: 'Edge Rendering',
    description: 'Content is rendered at edge nodes closest to the user for minimal latency',
    color: 'from-purple-400 to-pink-500',
  },
};

const initialMetrics: RenderMetricState = {
  csrTTFB: null,
  edgeTTFB: null,
  lastUpdated: null,
  loading: true,
  error: null,
};

function getStrategyStages(strategy: RenderingStrategy, metrics: RenderMetricState): Stage[] {
  const csrDuration = metrics.csrTTFB ?? 400;
  const edgeDuration = metrics.edgeTTFB ?? 120;

  switch (strategy) {
    case 'csr':
      return [
        { name: 'Download HTML', duration: 60, color: 'bg-cyan-500', icon: <Radio className="w-4 h-4" /> },
        { name: 'Download JS Bundle', duration: 210, color: 'bg-blue-500', icon: <Cpu className="w-4 h-4" /> },
        { name: 'Parse & Compile', duration: 150, color: 'bg-cyan-600', icon: <Cpu className="w-4 h-4" /> },
        { name: 'Fetch Data', duration: Math.round(csrDuration), color: 'bg-blue-600', icon: <Server className="w-4 h-4" /> },
        { name: 'Render in Browser', duration: 180, color: 'bg-cyan-700', icon: <Globe className="w-4 h-4" /> },
        { name: 'Interactive', duration: 0, color: 'bg-green-500', icon: <Zap className="w-4 h-4" /> },
      ];
    case 'edge':
      return [
        { name: 'Route to Edge Node', duration: 15, color: 'bg-purple-500', icon: <Radio className="w-4 h-4" /> },
        { name: 'Fetch Data (Local)', duration: Math.round(edgeDuration), color: 'bg-pink-500', icon: <Cloud className="w-4 h-4" /> },
        { name: 'Render at Edge', duration: 90, color: 'bg-purple-600', icon: <Cpu className="w-4 h-4" /> },
        { name: 'Cache Response', duration: 50, color: 'bg-pink-600', icon: <Zap className="w-4 h-4" /> },
        { name: 'Send to Browser', duration: 30, color: 'bg-purple-700', icon: <Radio className="w-4 h-4" /> },
        { name: 'Display & Interactive', duration: 0, color: 'bg-green-500', icon: <Zap className="w-4 h-4" /> },
      ];
    default:
      return [];
  }
}

export default function SimulatorPage() {
  const [selectedStrategy, setSelectedStrategy] = useState<RenderingStrategy>('edge');
  const [isRunning, setIsRunning] = useState(false);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<RenderMetricState>(initialMetrics);

  const currentStages = getStrategyStages(selectedStrategy, metrics);
  const totalTime = currentStages.reduce((sum, stage) => sum + stage.duration, 0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMetrics() {
      setMetrics((current) => ({ ...current, loading: true, error: null }));

      try {
        const csrStart = performance.now();
        const csrResponse = await fetch('/api/products', { signal: controller.signal });
        if (!csrResponse.ok) throw new Error('CSR measurement failed');
        await csrResponse.json();
        const csrTTFB = performance.now() - csrStart;

        const edgeResponse = await fetch('/api/metrics/edge', { signal: controller.signal });
        if (!edgeResponse.ok) throw new Error('Edge measurement failed');
        const edgeData = await edgeResponse.json();

        setMetrics({
          csrTTFB,
          edgeTTFB: typeof edgeData.ttfb === 'number' ? edgeData.ttfb : null,
          lastUpdated: new Date().toLocaleTimeString(),
          loading: false,
          error: null,
        });
      } catch (error) {
        if ((error as any).name === 'AbortError') return;
        setMetrics((current) => ({ ...current, loading: false, error: (error as Error).message }));
      }
    }

    loadMetrics();

    return () => controller.abort();
  }, []);

  const currentMetricValue = {
    csr: metrics.csrTTFB,
    edge: metrics.edgeTTFB,
  }[selectedStrategy];

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setCompletedStages([]);

    for (let i = 0; i < currentStages.length; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, currentStages[i].duration * 2));
      setCompletedStages((prev) => [...prev, currentStages[i].name]);
    }

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Rendering Simulator</h1>
          <p className="text-gray-400 text-lg">Visualize how each rendering strategy processes requests using live measured data.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {(Object.entries(strategyDefinitions) as [RenderingStrategy, typeof strategyDefinitions.csr][]).map(([key, strategy]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedStrategy(key);
                setCompletedStages([]);
              }}
              disabled={isRunning}
              className={`glass rounded-xl p-8 border-2 transition-all duration-300 text-left cursor-pointer ${
                selectedStrategy === key
                  ? 'border-cyan-500/50 bg-white/[0.1]'
                  : 'border-white/[0.1] hover:border-white/[0.2]'
              } ${isRunning ? 'opacity-50' : ''}`}
            >
              <h3 className="text-xl font-bold text-white mb-2">{strategy.label}</h3>
              <p className="text-gray-400 text-sm">{strategy.description}</p>
              <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                ~{totalTime}ms total
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 mb-12">
          <div className="glass rounded-xl p-10 border border-white/[0.1]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{strategyDefinitions[selectedStrategy].label}</h2>
                <p className="text-gray-400 text-sm">Step-by-step rendering pipeline with actual fetch metrics.</p>
              </div>
              <button
                onClick={handleRunSimulation}
                disabled={isRunning}
                className={`btn-primary ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRunning ? 'Running...' : 'Run Simulation'}
              </button>
            </div>

            <div className="space-y-4">
              {currentStages.map((stage, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${stage.color}`}>
                        {stage.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{stage.name}</p>
                        <p className="text-xs text-gray-500">{stage.duration}ms</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      completedStages.includes(stage.name)
                        ? 'bg-green-500'
                        : isRunning && completedStages.length > idx
                          ? 'bg-green-500'
                          : 'bg-white/[0.1]'
                    }`}>
                      {completedStages.includes(stage.name) && <Zap className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${stage.color} ${completedStages.includes(stage.name) ? 'w-full' : 'w-0'}`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-white/[0.03] rounded-lg border border-white/[0.05]">
              <h3 className="font-bold text-white mb-4">Simulation Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-400 text-xs">Total Duration</p>
                  <p className="text-2xl font-bold text-cyan-400">{totalTime}ms</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Stages</p>
                  <p className="text-2xl font-bold text-blue-400">{currentStages.length}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Progress</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {completedStages.length}/{currentStages.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Fetch metric</p>
                  <p className="text-2xl font-bold text-green-400">
                    {currentMetricValue !== null ? `${Math.round(currentMetricValue)}ms` : '---'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-10 border border-white/[0.1]">
            <h2 className="text-2xl font-bold text-white mb-8">Live Metric Snapshot</h2>
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-950/50 p-6 border border-white/[0.08]">
                <p className="text-sm text-slate-400 mb-2">CSR TTFB</p>
                <p className="text-3xl font-semibold text-cyan-300">{metrics.csrTTFB !== null ? `${Math.round(metrics.csrTTFB)} ms` : 'Measuring...'}</p>
              </div>
                <div className="rounded-3xl bg-slate-950/50 p-6 border border-white/[0.08]">
                <p className="text-sm text-slate-400 mb-2">Edge TTFB</p>
                <p className="text-3xl font-semibold text-purple-300">{metrics.edgeTTFB !== null ? `${Math.round(metrics.edgeTTFB)} ms` : 'Measuring...'}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/50 p-6 border border-white/[0.08]">
                <p className="text-sm text-slate-400 mb-2">Last updated</p>
                <p className="text-3xl font-semibold text-white">{metrics.lastUpdated ?? 'Pending'}</p>
              </div>
              {metrics.error ? (
                <div className="rounded-3xl bg-rose-500/10 p-4 text-rose-200 border border-rose-500/20">
                  <p className="font-semibold">Metric load error</p>
                  <p className="text-sm text-rose-100">{metrics.error}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-10 border border-white/[0.1]">
          <h2 className="text-2xl font-bold text-white mb-8">Architecture Flow</h2>

          <div className="space-y-10">
            <div className={`rounded-3xl p-8 border border-white/[0.08] ${selectedStrategy === 'csr' ? 'bg-white/[0.06]' : 'bg-white/[0.02] opacity-80'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-cyan-400">Client-Side Rendering Flow</h3>
                <span className="text-xs uppercase tracking-[0.24em] text-gray-400">Browser-centric pipeline</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <StageCard icon={<Globe className="w-6 h-6" />} label="Browser" tone="cyan" />
                <ArrowRight className="text-gray-500 w-5 h-5" />
                <StageCard icon={<Server className="w-6 h-6" />} label="API Server" tone="blue" />
                <ArrowRight className="text-gray-500 w-5 h-5" />
                <StageCard icon={<Cpu className="w-6 h-6" />} label="Client Render" tone="cyan" />
                <ArrowRight className="text-gray-500 w-5 h-5" />
                <StageCard icon={<Zap className="w-6 h-6" />} label="Interactive" tone="green" />
              </div>
            </div>

            <div className={`rounded-3xl p-8 border border-white/[0.08] ${selectedStrategy === 'edge' ? 'bg-white/[0.06]' : 'bg-white/[0.02] opacity-80'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-purple-400">Edge Rendering Flow</h3>
                <span className="text-xs uppercase tracking-[0.24em] text-gray-400">Distributed execution path</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <StageCard icon={<Globe className="w-6 h-6" />} label="User" tone="purple" />
                <ArrowRight className="text-gray-500 w-5 h-5" />
                <StageCard icon={<Zap className="w-6 h-6" />} label="Edge Node" tone="pink" />
                <ArrowRight className="text-gray-500 w-5 h-5" />
                <StageCard icon={<Cloud className="w-6 h-6" />} label="Origin" tone="purple" />
                <ArrowRight className="text-gray-500 w-5 h-5" />
                <StageCard icon={<Zap className="w-6 h-6" />} label="Response" tone="green" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StageCard({ icon, label, tone }: { icon: ReactNode; label: string; tone: 'cyan' | 'blue' | 'green' | 'purple' | 'pink' }) {
  const toneClass = {
    cyan: 'bg-cyan-500/15 text-cyan-300',
    blue: 'bg-blue-500/15 text-blue-300',
    green: 'bg-emerald-500/15 text-emerald-300',
    purple: 'bg-purple-500/15 text-purple-300',
    pink: 'bg-pink-500/15 text-pink-300',
  }[tone];

  return (
    <div className={`glass-dark rounded-3xl border border-white/[0.1] px-6 py-4 min-w-[170px] ${toneClass}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-2xl bg-white/[0.06] flex items-center justify-center">{icon}</div>
        <span className="text-sm font-semibold text-white">{label}</span>
      </div>
      <p className="text-xs text-gray-400">Latency and routing stage</p>
    </div>
  );
}
