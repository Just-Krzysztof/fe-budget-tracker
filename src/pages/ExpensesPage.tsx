import { useState, useEffect } from 'react';
import ExpensesForm from '../components/ExpansesForm';
import { useAuth } from '../hooks/useAuth';
import { tagsService } from '../services/tagsService';
import { TagsFormData } from '../types/tag.types';
import MainLayout from '../components/layout/MainLayout';
import CategoryModal from '../components/modal/CategoryModal';

// Spinner component for consistent loading UI
const TagsSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="relative">
      <svg className="animate-spin h-8 w-8 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    <span className="ml-3 text-gray-600 dark:text-gray-300 font-medium">Loading categories...</span>
  </div>
);

const ExpensesPage = () => {
  const [tags, setTags] = useState<TagsFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const { isAuthenticated } = useAuth();

  const fetchTags = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await tagsService.getTags();
      setTags(data);
      console.log('Tags fetched:', data); // Log the tags for debugging
    } catch (err) {
      console.error('Error fetching tags',err)
      setError('Failed to load tags. Please try again')
    } finally {
      setIsLoading(false);
    }
  };

  // Load tags on component mount and when authentication status changes
  useEffect(() => {
    fetchTags();
  }, [isAuthenticated]);

  // Open and close modal functions
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <MainLayout >
      {/* Header section with responsive padding and spacing */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-3 p-4 md:p-6 justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          Expenses Management
        </h1>
        <button 
          onClick={openModal}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
          type="button"
        >
          Manage Categories
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 md:mx-6 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Show loading indicator while fetching tags */}
      {isLoading && <TagsSpinner />}
      
      <div className="md:px-6 mb-8">
          <ExpensesForm tags={tags} loading={isLoading} />
      </div>

      {/* Render the CategoryModal component */}
      <CategoryModal 
        tags={tags} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onTagsUpdate={fetchTags}
      />
    </MainLayout>
  );
};

export default ExpensesPage; 