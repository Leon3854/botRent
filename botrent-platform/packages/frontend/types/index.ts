export interface Plan {
  id: number;
  name: string;
  price: number;
  maxBots: number;
  features: string[];
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role: string;
}

export interface Bot {
  id: number;
  name: string;
  type: string;
  botUsername?: string;
  isActive: boolean;
  settings?: any;
}

export interface Subscription {
  id: number;
  plan: Plan;
  status: string;
  startDate: string;
  endDate?: string;
  bots: Bot[];
}

export interface Payment {
  id: number;
  amount: number;
  status: string;
  createdAt: string;
}