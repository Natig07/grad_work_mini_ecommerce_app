'use client';

import Link from 'next/link';
import { Clock, Server, Zap, TrendingUp, ArrowRight, Activity, BarChart3, Gauge } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-cyan-500/30 rounded-full mb-8">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-sm text-cyan-400 font-semibold">Interactive Benchmarking Environment</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Rendering</span>
            <br />
            <span className="text-white">Intelligence</span>
            <br />
            <span className="text-white">for Modern Web</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Analyze how <span className="highlight-text">CSR and Edge Rendering</span> impact performance in real-world web systems. A research-grade benchmarking platform for understanding modern rendering strategies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/metrics" className="btn-primary inline-flex items-center justify-center gap-2">
              Explore Metrics
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/simulator" className="btn-secondary inline-flex items-center justify-center gap-2">
              Run Simulator
              <Zap className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="glass rounded-xl p-6 text-center">
              <Activity className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <p className="text-gray-300 text-sm">Real-time Performance</p>
              <p className="text-2xl font-bold gradient-text mt-2">Analysis</p>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <Gauge className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <p className="text-gray-300 text-sm">Rendering Comparison</p>
              <p className="text-2xl font-bold gradient-text mt-2">3 Strategies</p>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <p className="text-gray-300 text-sm">Interactive Visualizations</p>
              <p className="text-2xl font-bold gradient-text mt-2">Benchmarks</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Live Benchmark Preview</span>
            </h2>
            <p className="text-gray-400 text-lg">Real-world performance metrics across rendering strategies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'TTFB', value: '50ms', icon: Clock, color: 'cyan' },
              { label: 'FCP', value: '320ms', icon: Activity, color: 'blue' },
              { label: 'LCP', value: '580ms', icon: TrendingUp, color: 'purple' },
              { label: 'Speed Index', value: '1.2s', icon: Gauge, color: 'cyan' },
              { label: 'TTI', value: '1.1s', icon: Server, color: 'blue' },
              { label: 'Hydration', value: '450ms', icon: Zap, color: 'purple' },
            ].map((metric, idx) => {
              const Icon = metric.icon;
              const colorClass = metric.color === 'cyan' ? 'text-cyan-400' : metric.color === 'blue' ? 'text-blue-400' : 'text-purple-400';
              return (
                <div key={idx} className="glass rounded-xl p-6 border border-white/[0.1] hover:border-white/[0.2] transition-all duration-300 hover:neon-glow">
                  <div className={`w-12 h-12 rounded-lg bg-white/[0.05] flex items-center justify-center mb-4 ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
                  <p className="text-3xl font-bold text-white">{metric.value}</p>
                  <p className="text-xs text-gray-500 mt-2">Edge Rendering (Best)</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Rendering Strategies</span>
            </h2>
            <p className="text-gray-400 text-lg">Compare the performance characteristics of each approach</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Link href="/csr/products" className="group glass rounded-xl p-8 border border-white/[0.1] hover:border-cyan-500/50 transition-all duration-300 hover:neon-glow cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-400/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Client-Side Rendering</h3>
              <p className="text-gray-400 text-sm mb-6">Data fetched and rendered in the browser using React hooks</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-green-400 rounded-full" />
                  <span className="text-sm text-gray-300">Fast on repeat visits</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-green-400 rounded-full" />
                  <span className="text-sm text-gray-300">Full client interactivity</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-red-400 rounded-full" />
                  <span className="text-sm text-gray-400">Slower initial load</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold group-hover:gap-3 transition-all">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            <Link href="/edge/products" className="group glass rounded-xl p-8 border border-white/[0.1] hover:border-purple-500/50 transition-all duration-300 hover:neon-glow cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-400/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Edge Rendering</h3>
              <p className="text-gray-400 text-sm mb-6">Rendered at edge nodes distributed globally</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-green-400 rounded-full" />
                  <span className="text-sm text-gray-300">Fastest TTFB globally</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-green-400 rounded-full" />
                  <span className="text-sm text-gray-300">Reduced latency</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-green-400 rounded-full" />
                  <span className="text-sm text-gray-300">Serverless execution</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 text-purple-400 text-sm font-semibold group-hover:gap-3 transition-all">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Research Findings</span>
            </h2>
            <p className="text-gray-400 text-lg">Key insights from rendering strategy analysis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="glass rounded-xl p-8 border border-white/[0.1]">
              <h3 className="text-xl font-bold text-white mb-4">Edge Wins on Performance</h3>
              <p className="text-gray-400 mb-4">
                Edge rendering consistently delivers the best Time to First Byte (TTFB) by executing closest to end users, eliminating unnecessary network hops and reducing latency to sub-100ms levels.
              </p>
              <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                Critical for global audiences
              </div>
            </div>

            <div className="glass rounded-xl p-8 border border-white/[0.1]">
              <h3 className="text-xl font-bold text-white mb-4">CSR Excels at Interactivity</h3>
              <p className="text-gray-400 mb-4">
                Client-Side Rendering shines in highly interactive applications where frequent updates and complex state management benefit from client-side control and JavaScript flexibility.
              </p>
              <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                Best for dashboards & SPAs
              </div>
            </div>

            <div className="glass rounded-xl p-8 border border-white/[0.1]">
              <h3 className="text-xl font-bold text-white mb-4">Context Matters Most</h3>
              <p className="text-gray-400 mb-4">
                There is no universal winner. Choose based on your specific requirements: audience geography, content updates, interactivity needs, and interactivity goals. RenderLab helps you make informed decisions.
              </p>
              <div className="inline-flex items-center gap-2 text-purple-400 text-sm font-semibold">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                Use the simulator to test
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-10 border border-white/[0.1] text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Benchmark?</h3>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Start analyzing rendering performance with our interactive tools and see how different strategies impact your application.
            </p>
            <Link href="/metrics" className="btn-primary inline-flex items-center justify-center gap-2">
              View Full Metrics Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
