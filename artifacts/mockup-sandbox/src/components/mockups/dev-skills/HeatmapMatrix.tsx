import React from "react";
import { 
  Code2, 
  Database, 
  Layout, 
  History, 
  User, 
  Trophy,
  Mail,
  CalendarDays,
  Menu,
  ChevronRight
} from "lucide-react";
import "./_group.css";

const skills = [
  {
    id: "react",
    name: "React Frontend",
    context: "E-Commerce · React",
    date: "24/01/2026",
    level: 3,
    icon: Layout
  },
  {
    id: "postgres",
    name: "PostgreSQL DB",
    context: "E-Commerce · PostgreSQL",
    date: "19/01/2026",
    level: 4,
    icon: Database
  },
  {
    id: "java",
    name: "Java Backend",
    context: "E-Commerce · Java",
    date: "14/02/2026",
    level: 6,
    icon: Code2
  }
];

const brackets = [
  { label: "1-2", min: 1, max: 2, heat: "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900" },
  { label: "3-4", min: 3, max: 4, heat: "bg-orange-200 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-800" },
  { label: "5-6", min: 5, max: 6, heat: "bg-orange-300 dark:bg-orange-800/50 text-orange-900 dark:text-orange-200 border-orange-400 dark:border-orange-700" },
  { label: "7-8", min: 7, max: 8, heat: "bg-orange-400 dark:bg-orange-700/60 text-orange-950 dark:text-orange-100 border-orange-500 dark:border-orange-600" },
  { label: "9-10", min: 9, max: 10, heat: "bg-orange-500 dark:bg-orange-600/70 text-white dark:text-white border-orange-600 dark:border-orange-500" },
];

export function HeatmapMatrix() {
  return (
    <div className="dev-skills-heatmap min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-sm">
              <Code2 size={20} />
            </div>
            <div>
              <h1 className="font-semibold text-sm">Developer Hub</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise Matrix</p>
            </div>
          </div>

          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium">
              <User size={18} />
              My Skills
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors">
              <Mail size={18} />
              Invites
              <span className="ml-auto bg-slate-100 dark:bg-slate-800 text-xs py-0.5 px-2 rounded-full">2</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors">
              <History size={18} />
              History
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors">
              <CalendarDays size={18} />
              Timeline
            </a>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
          <div className="mb-2 flex items-center justify-between text-xs font-medium">
            <span className="text-slate-500">Profile Completeness</span>
            <span className="text-orange-600 dark:text-orange-400">78%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full w-[78%]"></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-x-auto">
        <header className="mb-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-2">My Skills Matrix</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Current proficiency levels across active projects.
          </p>
        </header>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            
            {/* Table Header */}
            <div className="grid grid-cols-[minmax(250px,1fr)_repeat(5,minmax(100px,1fr))] border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Skill & Context
              </div>
              {brackets.map(b => (
                <div key={b.label} className="p-4 text-xs font-medium text-slate-500 text-center uppercase tracking-wider border-l border-slate-200 dark:border-slate-800">
                  Level {b.label}
                </div>
              ))}
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {skills.map(skill => {
                const activeBracketIndex = brackets.findIndex(b => skill.level >= b.min && skill.level <= b.max);
                
                return (
                  <div key={skill.id} className="grid grid-cols-[minmax(250px,1fr)_repeat(5,minmax(100px,1fr))] hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    
                    {/* Skill Info Cell */}
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="text-slate-400">
                          <skill.icon size={18} />
                        </div>
                        <span className="font-semibold text-sm">{skill.name}</span>
                      </div>
                      <div className="pl-7 space-y-0.5">
                        <div className="text-xs text-slate-500">{skill.context}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wide">Last leveled {skill.date}</div>
                      </div>
                    </div>

                    {/* Heatmap Cells */}
                    {brackets.map((b, index) => {
                      const isActive = index === activeBracketIndex;
                      const isPast = index < activeBracketIndex;
                      
                      return (
                        <div 
                          key={b.label} 
                          className={`border-l border-slate-200 dark:border-slate-800 p-2 flex items-center justify-center relative group
                            ${isPast ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}
                          `}
                        >
                          {isActive && (
                            <div className={`w-full h-full rounded-md border flex flex-col items-center justify-center shadow-sm ${b.heat}`}>
                              <span className="text-xl font-bold mb-0.5">{skill.level}</span>
                              <span className="text-[10px] uppercase tracking-wider opacity-80 font-medium">Current</span>
                            </div>
                          )}
                          {!isActive && isPast && (
                            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                );
              })}
            </div>

          </div>

          <div className="mt-6 flex items-center justify-end gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-100 border border-orange-200 dark:bg-orange-950/30 dark:border-orange-900"></div>
              <span>Beginner</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-300 border border-orange-400 dark:bg-orange-800/50 dark:border-orange-700"></div>
              <span>Intermediate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500 border border-orange-600 dark:bg-orange-600/70 dark:border-orange-500"></div>
              <span>Expert</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
