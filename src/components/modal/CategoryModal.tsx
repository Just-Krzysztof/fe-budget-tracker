import { useState, FormEvent, useEffect } from "react";
import { TagsFormData } from "../../types/tag.types";
import { tagsService } from "../../services/tagsService";

interface CategoryModalProps {
  tags?: TagsFormData[];
  onClose: () => void;
  isOpen: boolean;
  onTagsUpdate?: () => void;
}

const CategoryModal = ({ tags = [], onClose, isOpen, onTagsUpdate }: CategoryModalProps) => {
  const [newTag, setNewTag] = useState<Omit<TagsFormData, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    colorBg: '#f3f4f6',
    colorText: '#1f2937'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      // Add styles to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to restore scrolling when modal closes
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTag(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!newTag.name.trim()) {
      setError('Category name is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode && editingTagId) {
        // Update existing tag
        await tagsService.updateTag(editingTagId, newTag);
        setSuccessMessage('Category updated successfully!');
      } else {
        // Create new tag
        await tagsService.createTag(newTag);
        setSuccessMessage('Category created successfully!');
      }
      
      // Reset form
      setNewTag({
        name: '',
        colorBg: '#f3f4f6',
        colorText: '#1f2937'
      });
      
      // Reset edit mode
      setIsEditMode(false);
      setEditingTagId(null);
      
      // Refresh tags list
      if (onTagsUpdate) {
        onTagsUpdate();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      // Close the create section after successful creation
      setIsCreateSectionOpen(false);
    } catch (err) {
      console.error('Error saving category:', err);
      setError(isEditMode ? 'Failed to update category. Please try again.' : 'Failed to create category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTag = (tag: TagsFormData) => {
    if (!tag.id) return;
    
    // Set form to edit mode
    setIsEditMode(true);
    setEditingTagId(tag.id);
    
    // Populate form with tag data
    setNewTag({
      name: tag.name,
      colorBg: tag.colorBg,
      colorText: tag.colorText
    });
    
    // Open the create/edit section
    setIsCreateSectionOpen(true);
    
    // Scroll to the top of the modal
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!tagId) return;
    
    try {
      await tagsService.deleteTag(tagId);
      
      // If we were editing this tag, reset the form
      if (editingTagId === tagId) {
        setIsEditMode(false);
        setEditingTagId(null);
        setNewTag({
          name: '',
          colorBg: '#f3f4f6',
          colorText: '#1f2937'
        });
      }
      
      // Refresh tags list
      if (onTagsUpdate) {
        onTagsUpdate();
      }
      
      setSuccessMessage('Category deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Please try again.');
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click was on the backdrop (not on the modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleCreateSection = () => {
    // If opening the section and in edit mode, reset to create mode
    if (!isCreateSectionOpen && isEditMode) {
      setIsEditMode(false);
      setEditingTagId(null);
      setNewTag({
        name: '',
        colorBg: '#f3f4f6',
        colorText: '#1f2937'
      });
    }
    
    setIsCreateSectionOpen(!isCreateSectionOpen);
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden backdrop-blur-sm bg-black/30"
    >
      <div className="relative w-full h-full max-w-2xl mx-auto md:h-auto md:max-h-[90vh] md:my-10">
        {/* Modal content with glass effect */}
        <div className="relative flex flex-col h-full md:h-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200/50 dark:border-gray-700/50 rounded-t">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
              Categories Management
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200/50 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600/50 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          
          {/* Modal body - scrollable content */}
          <div className="flex-1 p-4 md:p-5 overflow-y-auto modal-body">
            {/* Status messages */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
                {successMessage}
              </div>
            )}
            
            {/* Create new category accordion */}
            <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                type="button"
                onClick={toggleCreateSection}
                className="flex items-center justify-between w-full p-4 font-medium text-left text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-t-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <span className="text-base md:text-lg font-medium">
                  {isEditMode ? 'Edit Category' : 'Create New Category'}
                </span>
                <svg 
                  className={`w-5 h-5 transition-transform ${isCreateSectionOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {/* Collapsible content */}
              <div className={`${isCreateSectionOpen ? 'block' : 'hidden'} p-4 bg-white dark:bg-gray-800 rounded-b-lg`}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category Name */}
                    <div className="md:col-span-1">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={newTag.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Food, Transport"
                      />
                    </div>
                    
                    {/* Background Color */}
                    <div>
                      <label htmlFor="colorBg" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Background Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="colorBg"
                          name="colorBg"
                          value={newTag.colorBg}
                          onChange={handleInputChange}
                          className="h-8 w-8 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          name="colorBg"
                          value={newTag.colorBg}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="#f3f4f6"
                        />
                      </div>
                    </div>
                    
                    {/* Text Color */}
                    <div>
                      <label htmlFor="colorText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Text Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="colorText"
                          name="colorText"
                          value={newTag.colorText}
                          onChange={handleInputChange}
                          className="h-8 w-8 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          name="colorText"
                          value={newTag.colorText}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Preview
                    </label>
                    <div 
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: newTag.colorBg,
                        color: newTag.colorText
                      }}
                    >
                      {newTag.name || 'Category Preview'}
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-end">
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditMode(false);
                          setEditingTagId(null);
                          setNewTag({
                            name: '',
                            colorBg: '#f3f4f6',
                            colorText: '#1f2937'
                          });
                        }}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Display existing tags - always visible and scrollable */}
            <div className="mb-4">
              <h4 className="text-base md:text-lg font-medium text-gray-900 dark:text-white mb-2 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm py-2 z-10">
                Existing Categories
              </h4>
              <div className="max-h-[40vh] overflow-y-auto pr-1 pb-2">
                {tags.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No categories found. Create one above!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tags.map((tag) => (
                      <div
                        key={tag.id || tag.name}
                        className="flex items-center justify-between p-3 rounded-md shadow-sm"
                        style={{
                          backgroundColor: tag.colorBg || "#f3f4f6",
                          color: tag.colorText || "#1f2937",
                        }}
                      >
                        <span className="font-medium truncate">{tag.name}</span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEditTag(tag)}
                            className="p-1.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                            aria-label="Edit category"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              ></path>
                            </svg>
                          </button>
                          {tag.id && (
                            <button
                              type="button"
                              onClick={() => handleDeleteTag(tag.id as string)}
                              className="p-1.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                              aria-label="Delete category"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                ></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Modal footer */}
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200/50 dark:border-gray-700/50 mt-auto">
            <button
              onClick={onClose}
              type="button"
              className="w-full text-white bg-blue-600/90 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500/90 dark:hover:bg-blue-600 dark:focus:ring-blue-800/50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
