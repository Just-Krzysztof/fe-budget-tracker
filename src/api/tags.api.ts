import { API_URL } from './auth.api';
import { authorizedFetch } from './authorizedFetch';
export interface Tag {
  id: string;
  name: string;
  colorBg: string;
  colorText: string;
  userId: string;
}

export const tagsApi = {
  getTags: async (onUnauthorized?: () => void): Promise<Tag[]> => {
    const response = await authorizedFetch(`${API_URL}/tag/list`, {}, onUnauthorized);
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
  },

  createTag: async (tagData: Omit<Tag, 'id'>, onUnauthorized?:()=>void): Promise<Tag> => {
    const response = await authorizedFetch(`${API_URL}/tag/create`, {
      method: 'POST',
      body: JSON.stringify(tagData),
    },onUnauthorized);
    if (!response.ok) throw new Error('Failed to create tag');
    return response.json();
  },
};
