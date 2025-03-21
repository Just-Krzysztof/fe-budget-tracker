import { useState, FormEvent, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { ExpenseFormData } from '../types/expense.types';
import { TagsFormData } from '../types/tag.types';

interface ExpensesFormProps {
  tags?: TagsFormData[] | string[]; 
  loading?: boolean | false;
}

const ExpensesForm = ({ tags = [], loading=false }: ExpensesFormProps) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<Omit<ExpenseFormData, 'date'> & { date: string }>({
    value: 0,
    currency: 'PLN',
    tag: '',
    description: '',
    type: 'expense', 
    date: today 
  });
  
  // Display value for the input (to handle the formatting)
  const [displayValue, setDisplayValue] = useState('0');

  // State for date selection type
  const [dateOption, setDateOption] = useState<'today' | 'custom'>('today');

  // Error state
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});
  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // Animation states
  const [formVisible, setFormVisible] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');
  
  const currencyOptions = ['PLN', 'USD', 'EUR', 'GBP'];
  const typeOptions = ['expense', 'income'];
  
  // Update date when dateOption changes
  useEffect(() => {
    if (dateOption === 'today') {
      setFormData(prev => ({
        ...prev,
        date: today
      }));
    }
  }, [dateOption, today]);

  // Animate form appearance
  useEffect(() => {
    setFormVisible(true);
  }, []);

  // Loading animation setup
  useEffect(() => {
    if (loading || isSubmitting) {
      const interval = setInterval(() => {
        setLoadingDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [loading, isSubmitting]);

  // Handler for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle number conversion for value field
    if (name === 'value') {
      // Remove any non-numeric characters except decimal point
      const sanitizedValue = value.replace(/[^\d.]/g, '');
      
      // Handle special case when user is typing a decimal number
      if (sanitizedValue === '.' || sanitizedValue === '0.') {
        setDisplayValue(sanitizedValue);
        return; // Don't update formData yet, wait for more input
      }
      
      // Convert to number or use 0 if empty
      const numValue = sanitizedValue === '' ? 0 : parseFloat(sanitizedValue);
      
      // Update display value
      setDisplayValue(sanitizedValue === '' ? '' : sanitizedValue);
      
      // Update form data with the numeric value
      setFormData({
        ...formData,
        [name]: numValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // If changing date, update dateOption
    if (name === 'date' && value !== today) {
      setDateOption('custom');
    }
    
    // Clear error when field is edited
    if (errors[name as keyof ExpenseFormData]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  // Handle focus on value input
  const handleValueFocus = () => {
    // Clear the input if it's just 0
    if (formData.value === 0) {
      setDisplayValue('');
    }
  };

  // Handle blur on value input
  const handleValueBlur = () => {
    // If the input is empty, set it back to 0
    if (displayValue === '' || displayValue === '.') {
      setDisplayValue('0');
      setFormData(prev => ({
        ...prev,
        value: 0
      }));
    }
  };

  // Handler for date option change
  const handleDateOptionChange = (option: 'today' | 'custom') => {
    setDateOption(option);
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};
    
    if (formData.value <= 0) {
      newErrors.value = 'Value must be greater than 0';
    }
    
    if (!formData.currency) {
      newErrors.currency = 'Currency is required';
    }
    
    if (!formData.tag) {
      newErrors.tag = 'Tag is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Shake the form on validation error
      const form = document.getElementById('expense-form');
      if (form) {
        form.classList.add('animate-shake');
        setTimeout(() => {
          form.classList.remove('animate-shake');
        }, 500);
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submissionData: ExpenseFormData = {
        ...formData,
        date: new Date(formData.date)
      };
      
      await expenseService.createExpense(submissionData);
      
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          value: 0,
          currency: 'PLN',
          tag: '',
          description: '',
          type: 'expense',
          date: today
        });
        setDisplayValue('0');
        setDateOption('today');
      }, 1200);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTagObject = (tag: unknown): tag is TagsFormData => {
    return typeof tag === 'object' && tag !== null && 'name' in tag;
  };

  // Mini spinner component for reuse in the form
  const MiniSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-500 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const renderTagOptions = () => {
    const options = [
      <option key="empty" value="">
        {loading ? `Loading${loadingDots}` : 'Select Category'}
      </option>
    ];
    
    if (tags.length > 0 && isTagObject(tags[0])) {
      const tagObjects = tags as TagsFormData[];
      tagObjects.forEach(tag => {
        options.push(
          <option key={tag.id || tag.name} value={tag.name}>
            {tag.name}
          </option>
        );
      });
    } 
    // Handle string tags
    else if (tags.length > 0) {
      const tagStrings = tags as string[];
      tagStrings.forEach(tag => {
        options.push(
          <option key={tag} value={tag}>
            {tag}
          </option>
        );
      });
    }
    
    return options;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div 
        className={`bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-all duration-500 ${
          formVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'
        }`}
      >
        <h2 className={`text-xl font-semibold text-gray-800 dark:text-white mb-6 transition-colors duration-300 ${
          formData.type === 'expense' ? 'text-red-500' : 'text-green-500'
        }`}>
          {formData.type === 'expense' ? 'Add Expense' : 'Add Income'}
        </h2>
        
        {submitSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded animate-fadeIn">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Form submitted successfully!</span>
            </div>
          </div>
        )}
        
        <form id="expense-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection and Value/Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type Selection */}
            <div className="transition-all duration-300 transform hover:scale-[1.02] h-full">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <div className="relative mt-1 rounded-md shadow-sm h-[38px]">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full h-full px-3 py-2 border ${errors.type ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-200`}
                >
                  {typeOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.type}</p>
              )}
            </div>

            {/* Value and Currency */}
            <div className="transition-all duration-300 transform hover:scale-[1.02] h-full">
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Value
              </label>
              <div className="relative mt-1 rounded-md shadow-sm h-[38px]">
                <input
                  type="text"
                  inputMode="decimal"
                  name="value"
                  id="value"
                  value={displayValue}
                  onChange={handleChange}
                  onFocus={handleValueFocus}
                  onBlur={handleValueBlur}
                  className={`w-full h-full px-3 py-2 border ${errors.value ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white pr-20 transition-colors duration-200`}
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className={`h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 dark:text-gray-300 sm:text-sm rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                  >
                    {currencyOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.value && (
                <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.value}</p>
              )}
            </div>
          </div>

          {/* Date Selection */}
          <div className="transition-all duration-300 transform hover:scale-[1.02]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <div className="space-y-3">
              {/* Date options */}
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="date-today"
                    name="date-option"
                    type="radio"
                    checked={dateOption === 'today'}
                    onChange={() => handleDateOptionChange('today')}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 transition-colors duration-200"
                  />
                  <label htmlFor="date-today" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Today
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="date-custom"
                    name="date-option"
                    type="radio"
                    checked={dateOption === 'custom'}
                    onChange={() => handleDateOptionChange('custom')}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 transition-colors duration-200"
                  />
                  <label htmlFor="date-custom" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Custom date
                  </label>
                </div>
              </div>
              
              {/* Date input field */}
              <div 
                className={`transition-all duration-300 ${
                  dateOption === 'custom' 
                    ? 'max-h-20 opacity-100' 
                    : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={today} // Prevent future dates
                  className={`w-full px-3 py-2 border ${errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-200`}
                />
              </div>
              
              {errors.date && (
                <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Tag */}
          <div className="transition-all duration-300 transform hover:scale-[1.02]">
            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
              {loading && (
                <span className="ml-2 inline-flex items-center">
                  <MiniSpinner />
                  Loading{loadingDots}
                </span>
              )}
            </label>

            <select
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-3 py-2 border ${errors.tag ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${loading ? 'animate-pulse' : ''}`}
            >
              {renderTagOptions()}
            </select>
            {errors.tag && (
              <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.tag}</p>
            )}
          </div>

          {/* Description */}
          <div className="transition-all duration-300 transform hover:scale-[1.02]">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-200`}
              placeholder="Enter description..."
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.description}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                formData.type === 'expense' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95`}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <MiniSpinner />
                  Submitting<span className="inline-block w-8 overflow-hidden">{loadingDots}</span>
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
        {
          isSubmitting ? (
            
        <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 backdrop-blur-xs bg-white/02 w-full h-full">
          <div className='absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2'>
        <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
        <span className="sr-only">Loading...</span>
          </div>
        </div>
          ):('')
      }      

      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default ExpensesForm;
