import { type ReactNode } from 'react';
interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar or header */}
      <aside className="w-64 bg-gray-800 text-white">
        <h2 className="p-4 text-xl">My App</h2>
        {/* …nav links… */}
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
