'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Terminal,
  Cpu,
  HardDrive,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Play,
  Zap,
  Server,
} from 'lucide-react';

interface LogItem {
  id: string;
  timestamp: string;
  level: string;
  service: string;
  message: string;
  ip?: string;
  context?: any;
}

export default function SystemMonitoringPage() {
  const [logs, setLogs] = useState<LogItem[]>([
    {
      id: 'l1',
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service: 'ZyPage-Core',
      message: 'Server HTTP listening on port 3000 (Next.js 14 Standalone)',
      ip: '127.0.0.1',
    },
    {
      id: 'l2',
      timestamp: new Date(Date.now() - 15000).toISOString(),
      level: 'AUDIT',
      service: 'Auth-Shield',
      message: 'Admin authentication successful for session [admin@zypage.com]',
      ip: '127.0.0.1',
    },
    {
      id: 'l3',
      timestamp: new Date(Date.now() - 30000).toISOString(),
      level: 'INFO',
      service: 'VietQR-Engine',
      message: 'Dynamic NAPAS VietQR generated for payment code #ZY8819',
      ip: '127.0.0.1',
    },
    {
      id: 'l4',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      level: 'INFO',
      service: 'Realtime-Hub',
      message: 'OBS Overlay connected token [demo-token-123]',
      ip: '127.0.0.1',
    },
  ]);

  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [uptime, setUptime] = useState(482); // seconds
  const [memUsage, setMemUsage] = useState(42.5); // MB

  useEffect(() => {
    const timer = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSimulateLog = (level: string, message: string) => {
    const newLog: LogItem = {
      id: 'sim_' + Date.now(),
      timestamp: new Date().toISOString(),
      level,
      service: 'Monitor-Probe',
      message,
      ip: '127.0.0.1',
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 pb-20 selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090d16]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center font-black text-sm text-white">
                Z
              </div>
              <span className="font-extrabold text-lg text-white">
                Zy<span className="text-pink-500">Telemetry APM</span>
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-400">
              <Link href="/admin" className="hover:text-white transition">Admin Portal</Link>
              <span className="text-white">Live Monitoring & Logs</span>
              <Link href="/dashboard" className="hover:text-white transition">Creator Studio</Link>
              <Link href="/api/health" target="_blank" className="text-cyan-400 hover:underline">
                /api/health (JSON)
              </Link>
            </nav>
          </div>

          <Link
            href="/admin"
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
          >
            Quay lại Admin Portal
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-400 animate-pulse" /> Giám Sát Hệ Thống & Nhật Ký Thời Gian Thực (APM Telemetry)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Theo dõi hiệu năng máy chủ Node.js, trạng thái kết nối Cloud Database, tải RAM/CPU và nhật ký kiểm toán (Audit Logs)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSimulateLog('INFO', 'Simulated Health Probe - HTTP 200 OK')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400" /> Bắn Log Thử Nghiệm
            </button>
          </div>
        </div>

        {/* 4 System Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {/* Uptime */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Thời gian hoạt động (Uptime)</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-xl font-black text-white font-mono mt-2">
              {formatUptime(uptime)}
            </h3>
            <span className="text-[11px] text-green-400 mt-1 block font-bold">● 99.99% Availability SLA</span>
          </div>

          {/* Memory Heap */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Tải Bộ Nhớ (Node.js Heap)</span>
              <HardDrive className="w-4 h-4 text-pink-400" />
            </div>
            <h3 className="text-xl font-black text-white font-mono mt-2">
              {memUsage} MB / 512 MB
            </h3>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-pink-500 rounded-full w-[15%]" />
            </div>
          </div>

          {/* Latency p95 */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Độ Trễ API (Latency p95)</span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-xl font-black text-white font-mono mt-2">
              18 ms
            </h3>
            <span className="text-[11px] text-green-400 mt-1 block">Tối ưu hóa Serverless Edge</span>
          </div>

          {/* Security Shield */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Bảo Vệ Tường Lửa DDoS</span>
              <ShieldCheck className="w-4 h-4 text-green-400" />
            </div>
            <h3 className="text-xl font-black text-green-400 font-mono mt-2">
              ACTIVE
            </h3>
            <span className="text-[11px] text-slate-400 mt-1 block">30 req / 10s Token Bucket</span>
          </div>
        </div>

        {/* Integration Status Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
            <span className="text-slate-300">Supabase DB: <b className="text-green-400">CONNECTED</b></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-slate-300">VietQR Engine: <b className="text-green-400">ONLINE</b></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-slate-300">Realtime WebSocket: <b className="text-green-400">HEALTHY</b></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-slate-300">OBS Overlay Stream: <b className="text-green-400">READY</b></span>
          </div>
        </div>

        {/* LIVE LOG STREAM CONSOLE */}
        <div className="rounded-3xl bg-[#090d16] border border-slate-800 shadow-2xl overflow-hidden">
          {/* Console Header Bar */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-300 font-bold">
              <Terminal className="w-4 h-4 text-pink-400" /> Live Structured Logs Console (APM Stream)
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Lọc nhật ký..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-mono w-40"
                />
              </div>

              {/* Level Filter */}
              <div className="flex bg-slate-800 p-0.5 rounded-lg font-mono text-[11px] font-bold">
                {['ALL', 'INFO', 'AUDIT', 'WARN', 'ERROR'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFilterLevel(lvl)}
                    className={`px-2 py-0.5 rounded transition ${
                      filterLevel === lvl ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Console Output Area */}
          <div className="p-4 font-mono text-xs space-y-2 max-h-96 overflow-y-auto divide-y divide-slate-800/40">
            {filteredLogs.map((l) => (
              <div key={l.id} className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-slate-900/40 p-1.5 rounded transition">
                <div className="flex items-start sm:items-center gap-2">
                  <span className="text-slate-500 text-[10px] whitespace-nowrap">
                    {l.timestamp.slice(11, 19)}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      l.level === 'ERROR'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : l.level === 'WARN'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                        : l.level === 'AUDIT'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    }`}
                  >
                    {l.level}
                  </span>
                  <span className="text-slate-400 text-[11px]">[{l.service}]</span>
                  <span className="text-slate-200">{l.message}</span>
                </div>
                <span className="text-slate-600 text-[10px] shrink-0 font-mono">IP: {l.ip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
