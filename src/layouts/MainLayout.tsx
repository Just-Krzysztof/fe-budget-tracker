// src/layouts/MainLayout.tsx
import { NavLink, Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-xl font-bold">Budget Tracker v2</h2>
        <nav className="mt-8 space-y-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'block text-gray-300' : 'block text-gray-500'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? 'block text-gray-300' : 'block text-gray-500'
            }
          >
            Settings
          </NavLink>
          {/* more links */}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex flex-row-reverse w-full h-16 bg-white shadow p-4 items-center justify-between">
          {/* avatar */}
          <div className="text-gray-800 text-lg font-semibold">UserName</div>
        </header>
        <main className="flex-1 w-full bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
