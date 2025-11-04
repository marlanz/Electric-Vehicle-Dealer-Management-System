export type Vehicle = {
  vehicle_id: string;
  model: string;
  version: string | null;
  color: string | null;
  msrp: string; 
  features?: Record<string, any> | null;
  status: "ACTIVE" | "INACTIVE";
  image_url?: string | null;
  year?: number | null;
  wholesale_price?: string | null;
  gallery?: string[] | null;
  description?: string | null;
};

export type VehiclesQuery = {
  status?: string;
  model?: string;
  color?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export type VehiclesState = {
  items: Vehicle[];
  total: number;
  page: number;    
  limit: number;
  loading: boolean;
  refreshing: boolean;
  error?: string | null;
  filters: { status?: string; model?: string; color?: string; search?: string };
};
