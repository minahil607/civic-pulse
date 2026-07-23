import { useState } from "react";
import { AppShell, type View } from "@/components/AppShell";
import { FeedPage } from "@/pages/FeedPage";
import { ReportPage } from "@/pages/ReportPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ReportDetail } from "@/pages/ReportDetail";
import type { Report } from "@/types";

export default function App() {
  const [view, setView] = useState<View>("feed");
  const [activeReport, setActiveReport] = useState<Report | null>(null);

  const navigate = (v: View) => {
    setView(v);
    setActiveReport(null);
  };

  const openReport = (report: Report) => {
    setActiveReport(report);
    window.scrollTo({ top: 0 });
  };

  const backToFeed = () => {
    setActiveReport(null);
    setView("feed");
  };

  return (
    <AppShell view={view} onNavigate={navigate}>
      {activeReport ? (
        <ReportDetail report={activeReport} onBack={backToFeed} />
      ) : (
        <>
          {view === "feed" && <FeedPage onNavigate={navigate} onOpenReport={openReport} />}
          {view === "report" && <ReportPage onNavigate={navigate} onOpenReport={openReport} />}
          {view === "dashboard" && <DashboardPage onNavigate={navigate} onOpenReport={openReport} />}
        </>
      )}
    </AppShell>
  );
}
