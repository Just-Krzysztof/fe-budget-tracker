export interface SummmaryData {
    year: string | number
    month?:string | number
}
  
export interface Summary {
    totalIncome: number,
    totalExpenses: number,
    totalSaved?: number,
    period?: string,
    currencies: Currencies[]
}

export interface Currencies {
    currency: string,
    income: number,
    expenses: number,
    saved: number
}