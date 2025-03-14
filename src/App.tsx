import { useState } from 'react'
import './App.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Nagłówek */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white m-0">Budget Tracker</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" href="#">Dashboard</a>
            <a className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" href="#">Transakcje</a>
            <a className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" href="#">Budżety</a>
            <a className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" href="#">Raporty</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {isDarkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <div className="block md:hidden">
              <button className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Główna zawartość */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Karta podsumowania */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Saldo konta</h2>
            <p className="text-3xl font-bold text-green-500 dark:text-green-400">5,240.00 zł</p>
            <div className="mt-4 flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Przychody tego miesiąca</span>
              <span className="font-medium text-green-500 dark:text-green-400">+8,200.00 zł</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Wydatki tego miesiąca</span>
              <span className="font-medium text-red-500 dark:text-red-400">-2,960.00 zł</span>
            </div>
          </div>
          
          {/* Karta ostatnich transakcji */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Ostatnie transakcje</h2>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <li className="py-3 flex justify-between">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Zakupy spożywcze</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Wczoraj</p>
                </div>
                <span className="font-medium text-red-500 dark:text-red-400">-120.50 zł</span>
              </li>
              <li className="py-3 flex justify-between">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Wypłata</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">10 marca 2024</p>
                </div>
                <span className="font-medium text-green-500 dark:text-green-400">+4,200.00 zł</span>
              </li>
              <li className="py-3 flex justify-between">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Restauracja</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">8 marca 2024</p>
                </div>
                <span className="font-medium text-red-500 dark:text-red-400">-85.00 zł</span>
              </li>
            </ul>
            <button className="mt-4 w-full py-2 px-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 text-sm font-medium transition-colors">
              Zobacz wszystkie transakcje
            </button>
          </div>
          
          {/* Karta budżetu */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Postęp budżetu</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Jedzenie</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">60%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Transport</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">45%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rozrywka</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">80%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
            <button className="mt-4 w-full py-2 px-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 text-sm font-medium transition-colors">
              Zarządzaj budżetami
            </button>
          </div>
        </div>
      </main>

      {/* Stopka */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 Budget Tracker. Wszystkie prawa zastrzeżone.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Polityka prywatności</a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Warunki użytkowania</a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
