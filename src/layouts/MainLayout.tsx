// src/layouts/MainLayout.tsx
import { NavLink, Outlet } from 'react-router-dom';
import { PanelLeftOpen } from 'lucide-react';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-200">
      <div className="w-lvw">
        <header className="sticky top-0 w-full h-16 bg-white shadow p-4 flex items-center justify-between z-10">
          <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <label
                htmlFor="my-drawer"
                className="text-gray-600 focus:outline-none focus:ring btn bg-transparent drawer-button rounded-full p-1 border-none transition ease-in-out duration-450 hover:scale-105 "
              >
                <PanelLeftOpen />
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                <li>
                  <NavLink
                    to="/"
                    onClick={() => {
                      const drawer = document.getElementById(
                        'my-drawer'
                      ) as HTMLInputElement;
                      if (drawer) drawer.checked = false;
                    }}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/transactions"
                    onClick={() => {
                      const drawer = document.getElementById(
                        'my-drawer'
                      ) as HTMLInputElement;
                      if (drawer) drawer.checked = false;
                    }}
                  >
                    Transactions
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/goals"
                    onClick={() => {
                      const drawer = document.getElementById(
                        'my-drawer'
                      ) as HTMLInputElement;
                      if (drawer) drawer.checked = false;
                    }}
                  >
                    Goals
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings"
                    onClick={() => {
                      const drawer = document.getElementById(
                        'my-drawer'
                      ) as HTMLInputElement;
                      if (drawer) drawer.checked = false;
                    }}
                  >
                    Settings
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          {/* avatar */}
          {/* TODO check it  */}
          {/* Stat with icons or image */}
          {/* for month summary */}
          {/* https://daisyui.com/components/stat/ */}
          <div className="text-gray-800 text-lg font-semibold">UserName</div>
        </header>
        <main className="z-5 max-w-7xl mx-auto text-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
