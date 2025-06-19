import { API_URL } from './auth.api';

export interface Tag {
  id: string;
  name: string;
  colorBg: string;
  colorText: string;
  userId: string;
}

export const tagsApi = {
  getTags: async (): Promise<Tag[]> => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/tag/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }

    return response.json();
  },

  createTag: async (tagData: Omit<Tag, 'id'>): Promise<Tag> => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/tag/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tagData),
    });
    if (!response.ok) {
      throw new Error('failed to create tag');
    }
    return response.json();
  },
};
