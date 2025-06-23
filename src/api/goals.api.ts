import { API_URL } from './auth.api';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline: string;
}

export const goalsApi = {
  createGoal: async (goalData: Omit<Goal, 'id'>): Promise<Goal> => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goalData),
    });
    if (!response.ok) {
      throw new Error('Failed to create Goal');
    }
    return response.json();
  },

  loadGoals: async (userId: string): Promise<Goal[]> => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/goals/list/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch tags');

    return response.json();
  },
};
