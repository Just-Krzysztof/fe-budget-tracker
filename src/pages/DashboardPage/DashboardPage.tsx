// src/pages/DashboardPage/DashboardPage.tsx
import { useMonthySummary } from '../../hooks/useMonthySummary';
import type { MonthySummary } from '../../api/monthySummary.api';
import { NavLink } from 'react-router-dom';
export const DashboardPage = () => {
  const currentMonth = new Date().getUTCMonth() + 1;
  const currentYear = new Date().getUTCFullYear();
  const data = useMonthySummary(currentMonth, currentYear);
  
  
  return (
    <div className="p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-600">Przegląd Twoich finansów</p>
      </div>

      {/* Summary Cards by Currency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {Array.isArray(data.monthySummary) &&
          data.monthySummary.map((summary: MonthySummary, index: number) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 hover:border-slate-300"
            >
              {/* Currency Header */}
              <div className="flex items-center justify-between mb-6 p-6 pb-0">
                <h3 className="text-xl font-semibold text-slate-800">
                  Podsumowanie {summary.currency}
                </h3>
                <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                  {summary.currency}
                </div>
              </div>

              <div className="px-6 pb-6">
                {/* Income */}
                <div className="mb-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-emerald-800 font-medium">
                        Przychody
                      </span>
                    </div>
                    <span className="text-emerald-700 font-bold text-lg">
                      +{summary.incomeSum.toLocaleString()} {summary.currency}
                    </span>
                  </div>
                </div>

                {/* Expenses */}
                <div className="mb-4 p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                      <span className="text-rose-800 font-medium">Wydatki</span>
                    </div>
                    <span className="text-rose-700 font-bold text-lg">
                      -{summary.expenseSum.toLocaleString()} {summary.currency}
                    </span>
                  </div>
                </div>

                {/* Savings */}
                <div className="mb-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <span className="text-indigo-800 font-medium">
                        Oszczędności
                      </span>
                    </div>
                    <span className="text-indigo-700 font-bold text-lg">
                      {summary.saveSum.toLocaleString()} {summary.currency}
                    </span>
                  </div>
                </div>

                {/* Balance */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Bilans</span>
                    <span
                      className={`font-bold text-xl ${
                        summary.incomeSum - summary.expenseSum >= 0
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {summary.incomeSum - summary.expenseSum >= 0 ? '+' : ''}
                      {(
                        summary.incomeSum - summary.expenseSum
                      ).toLocaleString()}{' '}
                      {summary.currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Szybkie akcje
        </h3>
        <div className="flex flex-wrap gap-3">
          <NavLink
            to="/transactions"
            onClick={() => {
              const drawer = document.getElementById(
                'my-drawer'
              ) as HTMLInputElement;
              if (drawer) drawer.checked = false;
            }}
          >
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md cursor-pointer">
              <span>Dodaj transakcję</span>
            </button>
          </NavLink>
          <NavLink
            to="/goals"
            onClick={() => {
              const drawer = document.getElementById(
                'my-drawer'
              ) as HTMLInputElement;
              if (drawer) drawer.checked = false;
            }}
          >
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md cursor-pointer">
              <span>Nowy cel</span>
            </button>
          </NavLink>
          {/* <button className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md">
            <span>Raporty</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};
