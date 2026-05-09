import React, { useEffect, useState } from "react";
import { 
  Activity, 
  BarChart2, 
  Box, 
  Clock, 
  Code2, 
  Cpu, 
  Database, 
  Globe, 
  History, 
  Inbox, 
  Layout, 
  Terminal, 
  Zap 
} from "lucide-react";
import "./_cockpit.css";

const SKILLS = [
  {
    id: 1,
    name: "React Frontend",
    context: "E-Commerce · React",
    level: 3,
    maxLevel: 10,
    lastLeveled: "2026-01-24",
    icon: Layout,
    color: "#39ff14"
  },
  {
    id: 2,
    name: "PostgreSQL DB",
    context: "E-Commerce · PostgreSQL",
    level: 4,
    maxLevel: 10,
    lastLeveled: "2026-01-19",
    icon: Database,
    color: "#39ff14"
  },
  {
    id: 3,
    name: "Java Backend",
    context: "E-Commerce · Java",
    level: 6,
    maxLevel: 10,
    lastLeveled: "2026-02-14",
    icon: Terminal,
    color: "#39ff14"
  }
];

function Gauge({ skill, index }: { skill: typeof SKILLS[0], index: number }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100 + index * 150);
    return () => clearTimeout(t);
  }, [index]);

  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (skill.level / skill.maxLevel) * circumference;
  const offset = mounted ? targetOffset : circumference;

  const Icon = skill.icon;

  return (
    <div className="flex flex-col items-center p-6 bg-[#111] rounded-xl border border-[#222] relative overflow-hidden group">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#444] group-hover:border-[#39ff14] transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#444] group-hover:border-[#39ff14] transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#444] group-hover:border-[#39ff14] transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#444] group-hover:border-[#39ff14] transition-colors" />

      <div className="flex items-center gap-2 mb-6 w-full">
        <Icon className="w-5 h-5 text-[#888]" />
        <span className="text-sm font-medium tracking-wide text-[#f0f0f0] uppercase">{skill.name}</span>
      </div>

      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#222"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            className="cockpit-gauge-circle"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={skill.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 0 8px rgba(57, 255, 20, 0.4))"
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-mono text-white font-bold leading-none tracking-tighter shadow-sm" style={{ textShadow: "0 0 10px rgba(255,255,255,0.2)" }}>
            {skill.level}
          </span>
          <span className="text-xs text-[#888] font-mono mt-1 tracking-widest uppercase">/ {skill.maxLevel}</span>
        </div>
      </div>

      <div className="mt-6 w-full space-y-2">
        <div className="flex justify-between items-center text-xs text-[#888] font-mono uppercase">
          <span>Sys.Context</span>
          <span className="text-[#39ff14] truncate ml-2 text-right">{skill.context}</span>
        </div>
      </div>
    </div>
  );
}

export function CockpitDashboard() {
  return (
    <div className="cockpit-dashboard flex h-screen overflow-hidden selection:bg-[#39ff14] selection:text-black">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#222] bg-[#050505] flex flex-col z-10 relative">
        <div className="p-6 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#39ff14] flex items-center justify-center text-black font-bold font-mono">
              OP
            </div>
            <div>
              <div className="text-sm font-bold tracking-widest uppercase">Operator_01</div>
              <div className="text-xs text-[#888] font-mono">SYS.ONLINE</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <div className="px-4 mb-2 text-[10px] text-[#666] font-mono uppercase tracking-widest">Navigation</div>
          <nav className="space-y-1">
            <a href="#" className="cockpit-nav-item active flex items-center gap-3 px-6 py-3 text-sm">
              <Activity className="w-4 h-4" />
              <span className="font-mono uppercase tracking-wider">My Skills</span>
            </a>
            <a href="#" className="cockpit-nav-item flex items-center gap-3 px-6 py-3 text-sm text-[#888]">
              <Inbox className="w-4 h-4" />
              <span className="font-mono uppercase tracking-wider">Invites</span>
              <span className="ml-auto bg-[#222] text-xs font-mono px-1.5 py-0.5 rounded">2</span>
            </a>
            <a href="#" className="cockpit-nav-item flex items-center gap-3 px-6 py-3 text-sm text-[#888]">
              <History className="w-4 h-4" />
              <span className="font-mono uppercase tracking-wider">History</span>
            </a>
            <a href="#" className="cockpit-nav-item flex items-center gap-3 px-6 py-3 text-sm text-[#888]">
              <Clock className="w-4 h-4" />
              <span className="font-mono uppercase tracking-wider">Timeline</span>
            </a>
          </nav>

          <div className="px-4 mt-8 mb-2 text-[10px] text-[#666] font-mono uppercase tracking-widest">System Status</div>
          <div className="px-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#888] font-mono">Overall Readiness</span>
                <span className="text-[#39ff14] font-mono">43%</span>
              </div>
              <div className="h-1 bg-[#222] rounded-full overflow-hidden">
                <div className="h-full bg-[#39ff14] w-[43%] shadow-[0_0_8px_rgba(57,255,20,0.5)]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#888] font-mono">Assessment Quota</span>
                <span className="text-white font-mono">1/3</span>
              </div>
              <div className="h-1 bg-[#222] rounded-full overflow-hidden">
                <div className="h-full bg-white w-[33%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-[#050505] relative">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-5" 
          style={{ 
            backgroundImage: `linear-gradient(#39ff14 1px, transparent 1px), linear-gradient(90deg, #39ff14 1px, transparent 1px)`, 
            backgroundSize: '40px 40px' 
          }} 
        />

        <div className="p-8 max-w-6xl mx-auto relative z-10">
          <header className="mb-10 flex justify-between items-end border-b border-[#222] pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase">Telemetry Overview</h1>
              <p className="text-[#888] font-mono text-sm">Real-time developer capability metrics.</p>
            </div>
            <div className="text-right flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-[#666] font-mono uppercase">Last Sync</span>
                <span className="text-[#39ff14] font-mono text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
                  LIVE
                </span>
              </div>
              <button className="px-4 py-2 bg-[#111] hover:bg-[#39ff14] hover:text-black transition-colors border border-[#39ff14] text-[#39ff14] font-mono text-xs uppercase tracking-widest rounded flex items-center gap-2">
                <Zap className="w-3 h-3" /> Execute Scan
              </button>
            </div>
          </header>

          {/* Gauges Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {SKILLS.map((skill, i) => (
              <Gauge key={skill.id} skill={skill} index={i} />
            ))}
          </div>

          {/* Stat Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#222] border border-[#222] rounded-lg overflow-hidden mb-8">
            {[
              { label: "Active Nodes", value: "3", icon: Box },
              { label: "Mean Level", value: "4.33", icon: BarChart2 },
              { label: "Uptime (Days)", value: "14", icon: Clock },
              { label: "Subsystem", value: "E-Comm", icon: Cpu }
            ].map((stat, i) => (
              <div key={i} className="bg-[#111] p-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-[#666] mb-2">
                  <stat.icon className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-2xl font-mono text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Detailed Telemetry Table */}
          <div className="border border-[#222] bg-[#111] rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-[#222] flex justify-between items-center bg-[#0a0a0a]">
              <h2 className="text-sm font-mono uppercase tracking-widest text-[#888]">Subsystem Logs</h2>
              <span className="text-[10px] font-mono text-[#444]">SYS_LOG_001</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#222] text-[#666] text-[10px] font-mono uppercase tracking-widest bg-[#0a0a0a]">
                    <th className="px-6 py-3 font-normal">Component</th>
                    <th className="px-6 py-3 font-normal">Context Environment</th>
                    <th className="px-6 py-3 font-normal">Current Lv.</th>
                    <th className="px-6 py-3 font-normal">Last Calibration</th>
                    <th className="px-6 py-3 font-normal">Next Milestone</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {SKILLS.map((skill) => (
                    <tr key={skill.id} className="cockpit-table-row border-b border-[#222] last:border-0 group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[#1a1a1a] flex items-center justify-center border border-[#333] group-hover:border-[#39ff14] transition-colors">
                            <skill.icon className="w-4 h-4 text-[#888] group-hover:text-[#39ff14] transition-colors" />
                          </div>
                          <span className="font-medium text-white">{skill.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#888] font-mono text-xs">{skill.context}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[rgba(57,255,20,0.1)] text-[#39ff14] font-mono text-xs border border-[rgba(57,255,20,0.2)]">
                          {skill.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#888] font-mono text-xs">
                        {new Date(skill.lastLeveled).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-[#222] rounded-full overflow-hidden">
                            <div className="h-full bg-white w-1/4" />
                          </div>
                          <span className="text-[10px] text-[#666] font-mono">L{skill.level + 1} req</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
