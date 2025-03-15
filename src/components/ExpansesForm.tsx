import { useState, FormEvent, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { ExpenseFormData } from '../types/expense.types';
import { TagsFormData } from '../types/tag.types';

interface ExpensesFormProps {
  tags?: TagsFormData[] | string[]; 
}

const ExpensesForm = ({ tags = [] }: ExpensesFormProps) => {
  const today = new Date().toISOString().split('T')[0];
  

  const [formData, setFormData] = useState<Omit<ExpenseFormData, 'date'> & { date: string }>({
    value: 0,
    currency: 'PLN',
    tag: '',
    description: '',
    type: 'expense', 
    date: today 
  });

  // State for date selection type
  const [dateOption, setDateOption] = useState<'today' | 'custom'>('today');

  // Error state
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});
  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
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

  // Handler for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle number conversion for value field
    if (name === 'value') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : parseFloat(value)
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
        setDateOption('today');
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTagObject = (tag: unknown): tag is TagsFormData => {
    return typeof tag === 'object' && tag !== null && 'name' in tag;
  };

  const renderTagOptions = () => {
    const options = [
      <option key="empty" value="">Select Category</option>
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
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          {formData.type === 'expense' ? 'Add Expense' : 'Add Income'}
        </h2>
        
        {submitSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Form submitted successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.type ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
              >
                {typeOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            {/* Value and Currency */}
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Value
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="number"
                  name="value"
                  id="value"
                  value={formData.value}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-3 py-2 border ${errors.value ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white pr-20`}
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className={`h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 dark:text-gray-300 sm:text-sm rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
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
                <p className="mt-1 text-sm text-red-600">{errors.value}</p>
              )}
            </div>
          </div>

          {/* Date Selection */}
          <div>
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
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
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
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="date-custom" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Custom date
                  </label>
                </div>
              </div>
              
              {/* Date input field */}
              <div className={dateOption === 'custom' ? 'block' : 'hidden'}>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={today} // Prevent future dates
                  className={`w-full px-3 py-2 border ${errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                />
              </div>
              
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Tag */}
          <div>
            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.tag ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
            >
              {renderTagOptions()}
            </select>
            {errors.tag && (
              <p className="mt-1 text-sm text-red-600">{errors.tag}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
              placeholder="Enter description..."
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpensesForm;
