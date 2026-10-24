export type Priority = 'flexibility' | 'total_cost' | 'monthly_affordability';

export interface AnalyzeRequest {
    income: number; expenses: number; savings: number;
    purchaseAmount: number; interestRate: number; termMonths: number;
    offerText: string; priority: Priority;
}