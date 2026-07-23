import { Radio, MapPin, Plus, BarChart3, ListFilter } from "lucide-react";

export type View = "feed" | "report" | "dashboard";

interface AppShellProps {
  view: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
}

export function AppShell({ view, onNavigate, children }: AppShellProps) {
  const navItems: { id: View; label: string; icon: typeof Radio }[] = [
    { id: "feed", label: "Community Feed", icon: ListFilter },
    { id: "report", label: "Report Issue", icon: Plus },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-30 border-b border-ink-200/60 bg-ink-50/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <button onClick={() => onNavigate("feed")} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-civic-800">
              <Radio className="h-4.5 w-4.5 text-civic-200" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight text-ink-900">CivicPulse</span>
              <span className="hidden text-[10px] font-medium text-ink-400 sm:block">
                Report. Resolve. Rebuild.
              </span>
            </div>
          </button>

          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-civic-800 text-white"
                      : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 rounded-full bg-civic-50 px-3 py-1.5 text-xs font-medium text-civic-700 sm:flex">
            <MapPin className="h-3.5 w-3.5" />
            Your Neighborhood
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-ink-200 bg-white px-2 py-2 sm:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${
                active ? "text-civic-800" : "text-ink-400"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label.split(" ")[0]}
            </button>
          );
        })}
      </nav>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pb-12">{children}</main>
    </div>
  );
}
