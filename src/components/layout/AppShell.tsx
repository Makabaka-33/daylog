import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block h-full flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
