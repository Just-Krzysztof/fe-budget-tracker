// src/layouts/MainLayout.tsx
import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {isSidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static
          top-0 left-0
         w-80 md:w-64 lg:w-64 overflow-hidden
          bg-gray-800 text-white p-6
          transform transition-transform duration-200 ease-in-out
          z-50
          ${isSidebarOpen ? 'translate-x-0 h-full' : '-translate-x-full md:translate-x-0 min-h-full'}
        `}
        aria-hidden={!isSidebarOpen && window.innerWidth < 768}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Budget Tracker v2</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Zamknij menu boczne"
            className="md:hidden p-2 rounded-md text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-8 space-y-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'block text-gray-300'
                : 'block text-gray-500 hover:text-gray-300'
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/goals"
            className={({ isActive }) =>
              isActive
                ? 'block text-gray-300'
                : 'block text-gray-500 hover:text-gray-300'
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            Goals
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? 'block text-gray-300'
                : 'block text-gray-500 hover:text-gray-300'
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            Settings
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1 relative flex flex-col overflow-hidden max-w-screen-xl">
        <header className="flex fixed left-0 top-0 flex-reverse w-full h-16 bg-white shadow p-4 items-center justify-between z-20">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={
              isSidebarOpen ? 'Zamknij menu boczne' : 'Otwórz menu boczne'
            }
            aria-expanded={isSidebarOpen}
            className="md:visibility-none  p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isSidebarOpen ? (
                // ikona "X"
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                // ikona hamburgera
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          {/* avatar */}
          <div className="text-gray-800 text-lg font-semibold">UserName</div>
        </header>
        {/* Main content - dodajemy overflow-auto */}
        <main className="flex-1 w-full bg-gray-100 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
