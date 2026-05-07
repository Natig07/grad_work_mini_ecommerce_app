'use client';

import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Activity, Clock, Zap, TrendingUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface RealMetrics {
  ttfb: number | null;
  fcp: number | null;
  lcp: number | null;
  tbt: number | null;
  domLoad: number | null;
}

interface Snapshot {
  csr: RealMetrics;
  edge: { ttfb: number | null; totalDuration: number | null };
  timestamp: string | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
}

const emptyMetrics: RealMetrics = {
  ttfb: null, fcp: null, lcp: null, tbt: null, domLoad: null,
};

const initialSnapshot: Snapshot = {
  csr: emptyMetrics,
  edge: { ttfb: null, totalDuration: null },
  timestamp: null,
  status: 'idle',
  error: null,
};

// Measures real TTFB, FCP, LCP, TBT, DOMContentLoaded from the browser
function collectBrowserMetrics(): Promise<RealMetrics> {
  return new Promise((resolve) => {
    const result: RealMetrics = { ...emptyMetrics };

    // TTFB from Navigation Timing API
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navEntries.length > 0) {
      result.ttfb = Math.round(navEntries[0].responseStart - navEntries[0].requestStart);
      result.domLoad = Math.round(navEntries[0].domContentLoadedEventEnd - navEntries[0].startTime);
    }

    // TBT from long tasks
    let totalBlockingTime = 0;
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          totalBlockingTime += entry.duration - 50;
        }
      }
    });
    try {
      longTaskObserver.observe({ type: 'longtask', buffered: true });
    } catch (_) {}

    // FCP from Paint Timing API
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          result.fcp = Math.round(entry.startTime);
        }
      }
    });
    try {
      paintObserver.observe({ type: 'paint', buffered: true });
    } catch (_) {}

    // LCP from Largest Contentful Paint API
    let lcpValue: number | null = null;
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        lcpValue = Math.round(entries[entries.length - 1].startTime);
      }
    });
    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (_) {}

    // Give observers 1.5s to collect buffered entries
    setTimeout(() => {
      result.lcp = lcpValue;
      result.tbt = Math.round(totalBlockingTime);
      try { paintObserver.disconnect(); } catch (_) {}
      try { lcpObserver.disconnect(); } catch (_) {}
      try { longTaskObserver.disconnect(); } catch (_) {}
      resolve(result);
    }, 1500);
  });
}

// Measures real CSR fetch TTFB using the products API
async function measureCSRFetch(): Promise<number> {
  const start = performance.now();
  const res = await fetch('/api/products', { cache: 'no-store' });
  await res.json();
  return Math.round(performance.now() - start);
}

function MetricCard({
  label, value, unit, color, icon: Icon, sublabel,
}: {
  label: string;
  value: number | null;
  unit: string;
  color: string;
  icon: any;
  sublabel: string;
}) {
  return (
    <div className="glass rounded-xl p-8 border border-white/[0.1]">
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${color}`} />
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
          value !== null ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'
        }`}>
          {value !== null ? 'Measured' : 'Measuring...'}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className="text-4xl font-bold text-white mb-2">
        {value !== null ? `${value} ${unit}` : '—'}
      </p>
      <p className="text-xs text-gray-500">{sublabel}</p>
    </div>
  );
}

export default function MetricsPage() {
  const [snapshot, setSnapshot] = useState<Snapshot>(initialSnapshot);
  const [history, setHistory] = useState<Array<{ time: string; CSR: number; Edge: number }>>([]);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    async function measure() {
      setSnapshot((s) => ({ ...s, status: 'loading', error: null }));

      try {
        // Run browser metrics collection + CSR fetch + Edge API call in parallel
        const [browserMetrics, csrFetchTime, edgeRes] = await Promise.all([
          collectBrowserMetrics(),
          measureCSRFetch(),
          fetch('/api/metrics/edge', { cache: 'no-store' }),
        ]);

        if (!edgeRes.ok) throw new Error('Edge metrics endpoint failed');

        const edgeData = await edgeRes.json();
        const timestamp = new Date().toLocaleTimeString();

        // Use browser TTFB for page load, but csrFetchTime for the API fetch comparison
        const csrResult: RealMetrics = {
          ...browserMetrics,
          ttfb: csrFetchTime, // fetch TTFB is more relevant for comparison
        };

        setSnapshot({
          csr: csrResult,
          edge: {
            ttfb: edgeData.ttfb ?? null,
            totalDuration: edgeData.totalDuration ?? null,
          },
          timestamp,
          status: 'ready',
          error: null,
        });

        setHistory((prev) => {
          const next = [
            ...prev,
            {
              time: timestamp,
              CSR: csrFetchTime,
              Edge: edgeData.ttfb ?? 0,
            },
          ];
          return next.slice(-8); // keep last 8 readings
        });
      } catch (err) {
        setSnapshot((s) => ({
          ...s,
          status: 'error',
          error: (err as Error).message,
        }));
      }
    }

    measure();
    interval = setInterval(measure, 15000);

    return () => clearInterval(interval);
  }, []);

  const { csr, edge, status } = snapshot;

  const barData = [
    {
      name: 'TTFB',
      CSR: csr.ttfb ?? 0,
      Edge: edge.ttfb ?? 0,
    },
    {
      name: 'FCP',
      CSR: csr.fcp ?? 0,
      Edge: 0, // FCP is a browser metric, not applicable to edge API
    },
    {
      name: 'LCP',
      CSR: csr.lcp ?? 0,
      Edge: 0,
    },
    {
      name: 'TBT',
      CSR: csr.tbt ?? 0,
      Edge: 0,
    },
  ].filter((d) => d.CSR > 0 || d.Edge > 0);

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">

        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Performance Metrics</h1>
          <p className="text-gray-400 text-lg">
            Real measurements using the Web Performance API — no estimates or static values.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">
              {status === 'loading' ? 'Measuring...' : status === 'ready' ? `Last measured at ${snapshot.timestamp}` : status === 'error' ? 'Measurement failed' : 'Initializing...'}
            </span>
          </div>
        </div>

        {/* Real-measured TTFB cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricCard
            label="CSR — API Fetch Latency (real)"
            value={csr.ttfb}
            unit="ms"
            color="text-yellow-400"
            icon={Clock}
            sublabel="Measured with performance.now() timing a real /api/products fetch in the browser."
          />
          <MetricCard
            label="Edge — Server Fetch Latency (real)"
            value={edge.ttfb}
            unit="ms"
            color="text-purple-400"
            icon={Zap}
            sublabel="Measured with performance.now() inside the Vercel Edge Runtime fetching dummyjson."
          />
        </div>

        {/* Browser Web Vitals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <MetricCard
            label="First Contentful Paint (real)"
            value={csr.fcp}
            unit="ms"
            color="text-cyan-400"
            icon={Activity}
            sublabel="Measured via PerformanceObserver paint API in the browser."
          />
          <MetricCard
            label="Largest Contentful Paint (real)"
            value={csr.lcp}
            unit="ms"
            color="text-blue-400"
            icon={Activity}
            sublabel="Measured via PerformanceObserver largest-contentful-paint API."
          />
          <MetricCard
            label="Total Blocking Time (real)"
            value={csr.tbt}
            unit="ms"
            color="text-rose-400"
            icon={Activity}
            sublabel="Sum of (longTask duration − 50ms) for all long tasks on the main thread."
          />
        </div>

        {snapshot.error && (
          <div className="glass rounded-xl p-6 border border-rose-500/20 bg-rose-900/20 text-rose-300 mb-12">
            <p className="font-semibold mb-1">Measurement error</p>
            <p className="text-sm">{snapshot.error}</p>
          </div>
        )}

        {/* Bar chart — real values only */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="glass rounded-xl p-8 border border-white/[0.1]">
            <h2 className="text-2xl font-bold text-white mb-2">TTFB Comparison (ms)</h2>
            <p className="text-gray-500 text-sm mb-6">Both values are real measurements, not estimates.</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ name: 'TTFB', CSR: csr.ttfb ?? 0, Edge: edge.ttfb ?? 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" unit="ms" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(10,10,30,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  formatter={(val: number) => [`${val} ms`]}
                />
                <Legend />
                <Bar dataKey="CSR" fill="#fbbf24" name="CSR Fetch TTFB" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Edge" fill="#8b5cf6" name="Edge TTFB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-xl p-8 border border-white/[0.1]">
            <h2 className="text-2xl font-bold text-white mb-2">Browser Web Vitals (ms)</h2>
            <p className="text-gray-500 text-sm mb-6">Measured via Web Performance API on this page load.</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" unit="ms" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(10,10,30,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  formatter={(val: number) => [`${val} ms`]}
                />
                <Legend />
                <Bar dataKey="CSR" fill="#06b6d4" name="CSR (browser)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time trendline */}
        {history.length > 1 && (
          <div className="glass rounded-xl p-8 border border-white/[0.1] mb-12">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              Live TTFB Trendline
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Each point is a real measurement — refreshed every 15 seconds.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" unit="ms" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(10,10,30,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  formatter={(val: number) => [`${val} ms`]}
                />
                <Legend />
                <Line type="monotone" dataKey="CSR" stroke="#fbbf24" dot={true} strokeWidth={2} name="CSR TTFB" />
                <Line type="monotone" dataKey="Edge" stroke="#8b5cf6" dot={true} strokeWidth={2} name="Edge TTFB" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Summary table */}
        <div className="glass rounded-xl p-8 border border-white/[0.1]">
          <h2 className="text-2xl font-bold text-white mb-6">Measurement Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 py-3 pr-6">Metric</th>
                  <th className="text-left text-yellow-400 py-3 pr-6">CSR</th>
                  <th className="text-left text-purple-400 py-3 pr-6">Edge</th>
                  <th className="text-left text-gray-500 py-3">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { metric: 'TTFB', csr: csr.ttfb, edge: edge.ttfb, source: 'performance.now() around fetch()' },
                  { metric: 'FCP', csr: csr.fcp, edge: null, source: 'PerformanceObserver — paint' },
                  { metric: 'LCP', csr: csr.lcp, edge: null, source: 'PerformanceObserver — largest-contentful-paint' },
                  { metric: 'TBT', csr: csr.tbt, edge: null, source: 'PerformanceObserver — longtask' },
                  { metric: 'DOM Content Loaded', csr: csr.domLoad, edge: null, source: 'Navigation Timing API' },
                  { metric: 'Total Fetch Duration', csr: null, edge: edge.totalDuration, source: 'performance.now() in Edge Runtime' },
                ].map(({ metric, csr: csrVal, edge: edgeVal, source }) => (
                  <tr key={metric}>
                    <td className="py-3 pr-6 text-white font-medium">{metric}</td>
                    <td className="py-3 pr-6 text-yellow-300">
                      {csrVal !== null && csrVal !== undefined ? `${csrVal} ms` : <span className="text-gray-600">N/A</span>}
                    </td>
                    <td className="py-3 pr-6 text-purple-300">
                      {edgeVal !== null && edgeVal !== undefined ? `${edgeVal} ms` : <span className="text-gray-600">N/A</span>}
                    </td>
                    <td className="py-3 text-gray-500 text-xs">{source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 text-xs mt-6">
            * FCP, LCP, TBT and DOM metrics are browser-side measurements of this metrics page itself, not the CSR products page. For product page vitals, use Lighthouse on /csr/products and /edge/products.
          </p>
        </div>

      </div>
    </div>
  );
}