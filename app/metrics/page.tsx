'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CircleAlert as AlertCircle, Clock, Zap } from 'lucide-react';

const performanceData = [
  {
    name: 'CSR',
    ttfb: 0,
    fcp: 850,
    lcp: 1200,
    tti: 2100,
    caching: 'No',
  },
  {
    name: 'SSR',
    ttfb: 150,
    fcp: 400,
    lcp: 700,
    tti: 1400,
    caching: 'No-store',
  },
  {
    name: 'Edge',
    ttfb: 50,
    fcp: 320,
    lcp: 580,
    tti: 1100,
    caching: 'No-store',
  },
];

const explanations = {
  ttfb: {
    name: 'Time to First Byte',
    description: 'Time from request to first response byte',
  },
  fcp: {
    name: 'First Contentful Paint',
    description: 'First pixels rendered to screen',
  },
  lcp: {
    name: 'Largest Contentful Paint',
    description: 'Largest element rendered',
  },
  tti: {
    name: 'Time to Interactive',
    description: 'Page fully interactive',
  },
};

export default function MetricsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Performance Metrics</h1>
          <p className="text-lg text-gray-600">
            Compare rendering strategies across key performance indicators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">CSR</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">Client-Side Rendering</p>
            <div className="space-y-2 text-sm">
              <p>✓ Fast on repeat visits</p>
              <p>✓ Full client control</p>
              <p>✗ Slow first load</p>
              <p>✗ Requires JS</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">SSR</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">Server-Side Rendering</p>
            <div className="space-y-2 text-sm">
              <p>✓ Fast first load</p>
              <p>✓ SEO friendly</p>
              <p>✓ Dynamic content</p>
              <p>✗ Server load</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Edge</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">Edge Rendering</p>
            <div className="space-y-2 text-sm">
              <p>✓ Fastest TTFB</p>
              <p>✓ Global distribution</p>
              <p>✓ Reduced latency</p>
              <p>✓ Serverless</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Comparison (ms)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${value}ms`} />
              <Legend />
              <Bar dataKey="ttfb" fill="#f59e0b" name="TTFB" />
              <Bar dataKey="fcp" fill="#3b82f6" name="FCP" />
              <Bar dataKey="lcp" fill="#10b981" name="LCP" />
              <Bar dataKey="tti" fill="#8b5cf6" name="TTI" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(explanations).map(([key, { name, description }]) => (
            <div key={key} className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Rendering Strategy Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {performanceData.map((strategy) => (
              <div key={strategy.name} className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{strategy.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">TTFB:</span>
                    <span className="font-semibold">{strategy.ttfb}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">FCP:</span>
                    <span className="font-semibold">{strategy.fcp}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">LCP:</span>
                    <span className="font-semibold">{strategy.lcp}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TTI:</span>
                    <span className="font-semibold">{strategy.tti}ms</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Caching:</span>
                    <span className="font-semibold">{strategy.caching}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-gray-100 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Takeaways</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>CSR</strong> is great for interactive apps but requires client-side processing</li>
            <li>• <strong>SSR</strong> provides optimal SEO and faster initial load times</li>
            <li>• <strong>Edge</strong> delivers the best performance with distributed computing</li>
            <li>• Choose based on your app's requirements: SEO, interactivity, server load, and global reach</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
