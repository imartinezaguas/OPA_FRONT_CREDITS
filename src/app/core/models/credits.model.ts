export interface CreateCreditRequest {
  associateIdentification: string;
  associateName: string;
  creditType: string;
  requestedValue: number;
  interestRate: number;
  numberOfInstallments: number;
  paymentMethod: string;
}

export interface UpdateCreditRequest {
  requestedValue: number;
  interestRate: number;
  numberOfInstallments: number;
  paymentMethod: string;
}

export interface ChangeStatusRequest {
  newStatus: string;
  observation: string;
}

export interface CreditItemDto {
  id: number;
  creditNumber: string;
  associateIdentification: string;
  status: string;
  requestedValue: number;
  associateName?: string;
  creditType?: string;
  interestRate?: number;
  numberOfInstallments?: number;
}

export interface CreditHistoryDto {
  previousStatus: string | null;
  newStatus: string;
  changeDate: string;
  observation: string;
  user: string;
}

export interface DashboardSummaryDto {
  totalCredits: number;
  quantityByStatus: { [key: string]: number };
}

export interface CreditDetailDto {
  id: number;
  creditNumber: string;
  associateIdentification: string;
  associateName: string;
  creditType: string;
  requestedValue: number;
  interestRate: number;
  numberOfInstallments: number;
  paymentMethod: string;
  status: string;
  requestDate: string;
  updateDate: string;
  histories: CreditHistoryDto[];
}
