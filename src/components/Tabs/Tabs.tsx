import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  transition?: 'fade' | 'scale' | 'slide' | 'rotate';
  title?: boolean;
}

export const Tabs = ({
  tabs,
  defaultTab,
  transition = 'fade',
  title,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  const getTransitionClasses = (isActive: boolean) => {
    const baseClasses =
      'absolute w-full transition-all duration-300 ease-in-out';

    switch (transition) {
      case 'scale':
        return `${baseClasses} ${
          isActive
            ? 'opacity-100 scale-100 visible'
            : 'opacity-0 scale-95 invisible'
        }`;
      case 'slide':
        return `${baseClasses} ${
          isActive
            ? 'opacity-100 translate-x-0 visible'
            : 'opacity-0 translate-x-4 invisible'
        }`;
      case 'rotate':
        return `${baseClasses} ${
          isActive
            ? 'opacity-100 rotate-0 visible'
            : 'opacity-0 rotate-3 invisible'
        }`;
      default:
        return `${baseClasses} ${
          isActive
            ? 'opacity-100 translate-y-0 visible'
            : 'opacity-0 -translate-y-2 invisible'
        }`;
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h1 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 first-letter:uppercase text-center">
          {activeTab}
        </h1>
      )}
      <div className="relative">
        <ul
          className="relative flex flex-wrap gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-1 sm:py-1.5 list-none rounded-lg bg-slate-100 shadow-sm"
          role="tablist"
        >
          {tabs.map((tab) => (
            <li key={tab.id} className="z-30 flex-auto text-center min-w-[80px] sm:min-w-[100px]">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`
                  z-30 flex items-center justify-center w-full px-1 sm:px-0 py-2 sm:py-2.5 text-xs sm:text-sm
                  transition-all duration-200 ease-in-out border-0 rounded-md 
                  cursor-pointer whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-white shadow-sm font-medium'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
                  }
                `}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="relative mt-4 sm:mt-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={getTransitionClasses(activeTab === tab.id)}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
