import { httpClient } from './httpClient';
import { SummmaryData,Summary } from '../types/summary.types';

export const summaryService = {

    // Get summary by month
    
    async getSummaryByMonth({year,month }:SummmaryData): Promise<Summary> {
        try {
          return await httpClient.get<Summary>(`/summary/monthly?year=${year}&month=${month}`);
        } catch (error) {
          console.error('Error creating expense:', error);
          throw error;
        }
      },
}; 