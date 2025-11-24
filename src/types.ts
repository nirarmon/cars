export interface Vehicle {
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
}

export interface ReplacementOption {
  id: number;
  origin: 'US' | 'EU' | 'IL';
  supplyTimeDays: number;
  price: number;
}

export interface RentalCarOption {
  model: string;
  pricePerDay: number;
  availability: string;
}

export interface Filters {
  priceMin?: number;
  priceMax?: number;
  origins: string[];
  maxSupplyTime?: number;
}
