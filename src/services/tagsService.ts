import { httpClient } from "./httpClient";
import { TagsFormData } from '../types/tag.types'

export const tagsService = {
    /**
     * Get all tags
     */
    async getTags(): Promise<TagsFormData[]> {
        try {
            return await httpClient.get<TagsFormData[]>('/tag');
        } catch(error) {
            console.error('Error fetching tags:', error);
            throw error;
        }
    },
    /**
   * Create tags
   */
    async createTag(tagData: TagsFormData): Promise<TagsFormData> {
        try {
            return await httpClient.post<TagsFormData>('/tag/create', tagData);
        } catch(error) {
            console.error('Error creating Tag:', error);
            throw error;
        }
    },
    /**
     * Delete tag
     */
    async deleteTag(id: string): Promise<void> {
        try {
            await httpClient.delete(`/tag/${id}`);
        } catch(error) {
            console.error('Error deleting tag:', error);
            throw error;
        }
    },
    /**
     * Update tag
     */
    async updateTag(id: string, tagData: Partial<TagsFormData>): Promise<TagsFormData> {
        try {
            return await httpClient.put<TagsFormData>(`/tag/${id}`, tagData);
        } catch(error) {
            console.error('Error updating tag:', error);
            throw error;
        }
    }
};