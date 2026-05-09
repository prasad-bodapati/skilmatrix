import React from "react";
import { 
  Compass, 
  Map, 
  History, 
  CalendarDays, 
  Mail, 
  ChevronRight, 
  Award,
  Sparkles,
  Trophy,
  Zap,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./_group.css";

const skills = [
  {
    id: 1,
    name: "React Frontend",
    level: 3,
    context: "E-Commerce · React",
    lastLeveled: "24/01/2026",
    color: "from-blue-500 to-indigo-600",
    icon: <Sparkles className="w-5 h-5" />,
    recentActivity: [
      "Merged 5 PRs in checkout flow",
      "Completed State Management module"
    ]
  },
  {
    id: 2,
    name: "PostgreSQL DB",
    level: 4,
    context: "E-Commerce · PostgreSQL",
    lastLeveled: "19/01/2026",
    color: "from-emerald-500 to-teal-600",
    icon: <Zap className="w-5 h-5" />,
    recentActivity: [
      "Optimized product query times by 40%",
      "Designed schema for user reviews"
    ]
  },
  {
    id: 3,
    name: "Java Backend",
    level: 6,
    context: "E-Commerce · Java",
    lastLeveled: "14/02/2026",
    color: "from-orange-500 to-red-600",
    icon: <Target className="w-5 h-5" />,
    recentActivity: [
      "Refactored authentication microservice",
      "Mentored junior dev on Spring Boot"
    ]
  }
];

const MILESTONES = [1, 3, 5, 7, 10];

export function ProgressJourney() {
  return (
    <div className="progress-journey-root flex w-full h-screen overflow-hidden bg-[hsl(var(--bg-app))] text-[hsl(var(--text-main))] selection:bg-[hsl(var(--primary-accent))] selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[hsl(var(--bg-sidebar))] border-r border-[hsl(var(--border-subtle))] flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 text-[hsl(var(--primary-accent))]">
            <Compass className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight">SkillPath</h1>
          </div>
          
          <nav className="space-y-2 flex-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[hsl(var(--bg-card))] text-white font-medium border border-[hsl(var(--primary-accent))/30] shadow-[0_0_15px_rgba(124,58,237,0.1)] transition-all">
              <Map className="w-5 h-5 text-[hsl(var(--primary-accent))]" />
              My Journey
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--bg-card))] hover:text-white transition-all group">
              <Mail className="w-5 h-5 group-hover:text-[hsl(var(--warm-highlight))]" />
              Invites
              <Badge className="ml-auto bg-[hsl(var(--warm-highlight))] text-[hsl(var(--bg-app))] border-none">2</Badge>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--bg-card))] hover:text-white transition-all group">
              <History className="w-5 h-5 group-hover:text-[hsl(var(--primary-accent))]" />
              History
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--bg-card))] hover:text-white transition-all group">
              <CalendarDays className="w-5 h-5 group-hover:text-[hsl(var(--primary-accent))]" />
              Timeline
            </a>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-[hsl(var(--border-subtle))]">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border-2 border-[hsl(var(--primary-accent))]">
              <AvatarImage src="https://i.pravatar.cc/150?u=dev" />
              <AvatarFallback>DV</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-sm">Alex Developer</div>
              <div className="text-xs text-[hsl(var(--warm-highlight))]">Level 12 Traveler</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[hsl(var(--primary-accent))] opacity-5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[hsl(var(--warm-highlight))] opacity-5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto p-8 md:p-12">
          <header className="mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-[hsl(var(--text-muted))] bg-clip-text text-transparent">Your Skill Journey</h2>
            <p className="text-[hsl(var(--text-muted))] text-lg max-w-2xl">
              Track your progression across different domains. Every project contributes to your growth along these paths.
            </p>
          </header>

          <div className="space-y-16">
            {skills.map((skill) => (
              <section key={skill.id} className="relative">
                {/* Skill Header */}
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${skill.color} text-white shadow-lg`}>
                        {skill.icon}
                      </div>
                      <h3 className="text-2xl font-bold">{skill.name}</h3>
                      <Badge variant="outline" className="ml-2 border-[hsl(var(--primary-accent))/40] text-[hsl(var(--primary-accent))] bg-[hsl(var(--primary-accent))/10]">
                        Level {skill.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[hsl(var(--text-muted))]">
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" /> {skill.context}
                      </span>
                      <span>•</span>
                      <span>Last advanced: {skill.lastLeveled}</span>
                    </div>
                  </div>
                </div>

                {/* The Journey Track */}
                <div className="relative pt-8 pb-12">
                  {/* Base empty track */}
                  <div className="absolute top-10 left-0 w-full h-2 bg-[hsl(var(--border-subtle))] rounded-full overflow-hidden">
                    {/* Filled track up to current level */}
                    <div 
                      className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                      style={{ width: `${(skill.level / 10) * 100}%` }}
                    />
                  </div>

                  {/* Milestones & Position */}
                  <div className="relative flex justify-between items-center w-full z-10 px-1">
                    {MILESTONES.map((milestone) => {
                      const isReached = skill.level >= milestone;
                      const isCurrent = skill.level === milestone || (skill.level > milestone && skill.level < MILESTONES[MILESTONES.indexOf(milestone) + 1] && milestone === MILESTONES.filter(m => m <= skill.level).pop());
                      const isExactCurrent = skill.level === milestone;

                      return (
                        <div key={milestone} className="flex flex-col items-center gap-4 relative" style={{ flex: milestone === 10 ? 0 : 1 }}>
                          {/* Node */}
                          <div className={`
                            w-6 h-6 rounded-full border-4 flex-shrink-0 z-10 transition-all duration-500
                            ${isReached ? 'border-white bg-[hsl(var(--bg-app))] scale-110' : 'border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-card))]'}
                            ${isExactCurrent ? 'animate-pulse-glow border-[hsl(var(--warm-highlight))] bg-[hsl(var(--warm-highlight))]' : ''}
                          `}>
                            {isReached && !isExactCurrent && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                          
                          {/* Label */}
                          <span className={`
                            absolute top-8 text-sm font-bold w-16 text-center -ml-5
                            ${isExactCurrent ? 'text-[hsl(var(--warm-highlight))] drop-shadow-[0_0_5px_hsla(var(--warm-highlight),0.5)]' : (isReached ? 'text-white' : 'text-[hsl(var(--border-subtle))]')}
                          `}>
                            Lv {milestone}
                          </span>
                        </div>
                      );
                    })}

                    {/* Floating current position cursor if between milestones */}
                    {!MILESTONES.includes(skill.level) && (
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 -mt-[52px] z-20 flex flex-col items-center"
                        style={{ left: `calc(${(skill.level / 10) * 100}% - 12px)` }}
                      >
                        <div className="w-8 h-8 rounded-full bg-[hsl(var(--warm-highlight))] animate-pulse-glow flex items-center justify-center border-2 border-white shadow-[0_0_20px_hsla(var(--warm-highlight),0.6)]">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity Feed for this skill */}
                <div className="mt-4 bg-[hsl(var(--bg-card))] rounded-xl p-5 border border-[hsl(var(--border-subtle))]/50">
                  <h4 className="text-sm font-semibold text-[hsl(var(--text-muted))] mb-3 uppercase tracking-wider">Recent Steps</h4>
                  <ul className="space-y-3">
                    {skill.recentActivity.map((activity, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div className={`mt-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${skill.color}`} />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" className="mt-4 w-full text-[hsl(var(--primary-accent))] hover:text-white hover:bg-[hsl(var(--primary-accent))/20]">
                    View full history <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}