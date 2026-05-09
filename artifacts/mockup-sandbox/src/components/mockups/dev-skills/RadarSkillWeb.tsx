import React from 'react';
import { Target, Mail, Clock, LayoutDashboard, ChevronRight, Activity, Zap, Code2, Database, Server } from 'lucide-react';

const skills = [
  { id: 'react', name: 'React Frontend', level: 3, max: 10, context: 'E-Commerce · React', date: '24/01/2026', icon: Code2 },
  { id: 'postgres', name: 'PostgreSQL DB', level: 4, max: 10, context: 'E-Commerce · PostgreSQL', date: '19/01/2026', icon: Database },
  { id: 'java', name: 'Java Backend', level: 6, max: 10, context: 'E-Commerce · Java', date: '14/02/2026', icon: Server },
];

export function RadarSkillWeb() {
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const maxLevel = 10;
  
  const getCoordinatesForAngle = (angle: number, value: number) => {
    const angleRad = (angle - 90) * (Math.PI / 180);
    const r = (value / maxLevel) * radius;
    return {
      x: center + r * Math.cos(angleRad),
      y: center + r * Math.sin(angleRad)
    };
  };

  const angles = [0, 120, 240];
  
  const skillPoints = skills.map((skill, i) => {
    return getCoordinatesForAngle(angles[i], skill.level);
  });
  
  const polygonPoints = skillPoints.map(p => `${p.x},${p.y}`).join(' ');

  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 text-cyan-400 mb-8">
            <Activity className="w-6 h-6" />
            <span className="font-semibold text-lg tracking-wide">Matrix</span>
          </div>
          
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-cyan-950/30 text-cyan-400 rounded-md border border-cyan-900/50">
              <Target className="w-4 h-4" />
              <span className="font-medium">My Skills</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800/50 rounded-md transition-colors">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>Invites</span>
              <span className="ml-auto bg-cyan-900 text-cyan-300 text-xs px-2 py-0.5 rounded-full">2</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800/50 rounded-md transition-colors">
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>History</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800/50 rounded-md transition-colors">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Timeline</span>
            </a>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-800/50">
          <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">Progress</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Core Competency</span>
                <span className="text-cyan-400">43%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-[43%] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Assessment Readiness</span>
                <span className="text-cyan-400">80%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-[80%] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8 lg:p-12">
          
          <header className="mb-12">
            <h1 className="text-3xl font-light text-white mb-2 tracking-tight">Skill Profile</h1>
            <p className="text-slate-400">Analyze your current competency shape across core disciplines.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Radar Chart Area */}
            <div className="flex flex-col items-center justify-center bg-slate-900/30 border border-slate-800/80 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] pointer-events-none" />
              
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible z-10">
                {/* Background Web / Grids */}
                {gridLevels.map((level, i) => {
                  const pts = angles.map(a => getCoordinatesForAngle(a, level));
                  const path = pts.map(p => `${p.x},${p.y}`).join(' ');
                  return (
                    <polygon 
                      key={level} 
                      points={path} 
                      fill="none" 
                      stroke="rgba(148, 163, 184, 0.15)" 
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Spokes / Axes */}
                {angles.map((angle, i) => {
                  const p = getCoordinatesForAngle(angle, maxLevel);
                  return (
                    <line 
                      key={`axis-${i}`} 
                      x1={center} y1={center} 
                      x2={p.x} y2={p.y} 
                      stroke="rgba(148, 163, 184, 0.2)" 
                      strokeWidth="1" 
                    />
                  );
                })}

                {/* Data Polygon */}
                <polygon 
                  points={polygonPoints} 
                  fill="rgba(6, 182, 212, 0.2)" 
                  stroke="rgba(6, 182, 212, 0.8)" 
                  strokeWidth="2" 
                  className="drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                />

                {/* Data Points */}
                {skillPoints.map((p, i) => (
                  <circle 
                    key={`pt-${i}`} 
                    cx={p.x} cy={p.y} 
                    r="4" 
                    fill="#06b6d4" 
                    className="drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]"
                  />
                ))}
              </svg>

              {/* Labels positioned around the chart */}
              <div className="absolute inset-0 pointer-events-none">
                {skills.map((skill, i) => {
                  // Position labels slightly outside the max radius
                  const labelRadius = radius + 40;
                  const angleRad = (angles[i] - 90) * (Math.PI / 180);
                  const x = center + labelRadius * Math.cos(angleRad);
                  const y = center + labelRadius * Math.sin(angleRad);
                  
                  // Adjust anchor based on side
                  let transform = 'translate(-50%, -50%)';
                  
                  return (
                    <div 
                      key={`label-${i}`}
                      className="absolute flex flex-col items-center"
                      style={{ 
                        left: `${(x / size) * 100}%`, 
                        top: `${(y / size) * 100}%`,
                        transform
                      }}
                    >
                      <span className="text-sm font-medium text-slate-300 whitespace-nowrap">{skill.name}</span>
                      <span className="text-xs text-cyan-400 font-mono mt-0.5 border border-cyan-900/50 bg-cyan-950/30 px-1.5 py-0.5 rounded">Lvl {skill.level}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* List Breakdown */}
            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Skill Breakdown
              </h3>
              
              <div className="space-y-4">
                {skills.map((skill, i) => {
                  const Icon = skill.icon;
                  return (
                    <div key={skill.id} className="group bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl hover:bg-slate-800/40 transition-colors relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-slate-200 font-medium truncate pr-4">{skill.name}</h4>
                            <span className="text-cyan-400 font-mono bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/50 text-xs shrink-0">
                              Lvl {skill.level}
                            </span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-500 mt-2">
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                              {skill.context}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              Assessed {skill.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button className="mt-8 w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium group">
                Request Re-Assessment
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
