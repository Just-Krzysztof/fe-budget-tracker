// src/layouts/MainLayout.tsx
import { NavLink, Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-xl font-bold">My App</h2>
        <nav className="mt-8 space-y-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'block text-gray-300' : 'block text-gray-500'
            }
          >
            Dashboard
            {/* className="block text-gray-300 hover:text-white" */}
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

      {/* Main */}
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}
