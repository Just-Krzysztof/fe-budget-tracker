import { API_URL } from './auth.api';
import { authorizedFetch } from './authorizedFetch';
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline: string;
}

export const goalsApi = {
  createGoal: async (goalData: Omit<Goal, 'id'>,onUnauthorized?:()=>void): Promise<Goal> => {
    const response = await authorizedFetch(`${API_URL}/goals`, {
      method: 'POST',
      body: JSON.stringify(goalData),
    },
    onUnauthorized
    );
    if (!response.ok) throw new Error('Failed to create Goal');
    return response.json();
  },

  loadGoals: async (userId: string, onUnauthorized?:()=>void): Promise<Goal[]> => {
    const response = await authorizedFetch(`${API_URL}/goals/list/${userId}`, {},onUnauthorized);
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
  },
};
