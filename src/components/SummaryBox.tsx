import { ElementType, useState } from 'react';

interface SummaryBoxProps {
    title?: string;
    value?: number;
    icon?: ElementType;
    blurValue?: boolean;
}

export const SummaryBox = ({
  title, 
  value, 
  icon: Icon,
  blurValue = true
}: SummaryBoxProps) => {
    const [isBlurred, setIsBlurred] = useState(blurValue);
    
    const toggleBlur = () => {
      setIsBlurred(!isBlurred);
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              {Icon ? (
                <Icon className="h-6 w-6 text-white" />
              ) : (
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              )}
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {title}
                </dt>
                <dd>
                  <div 
                    onClick={toggleBlur} 
                    className={`text-lg font-medium text-gray-900 dark:text-white cursor-pointer relative ${
                      isBlurred ? 'select-none' : ''
                    }`}
                  >
                    {value !== undefined && (
                      <>
                        <span className={isBlurred ? 'blur-sm' : ''}>
                          {value}
                        </span>
                        {isBlurred && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                            Click to reveal
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
          <div className="text-sm">
            <a href="#" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
              View details
            </a>
          </div>
        </div>
      </div>
    )
}