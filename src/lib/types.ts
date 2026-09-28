export interface MonthRecord {
  id: number; // 1 to 12
  name: string; // 'Enero', 'Febrero', etc.
  shortName: string; // 'Ene', 'Feb', etc.
  baseRent: number; // Alquiler fijo
  electricityTotal: number; // Recibo de luz 100%
  electricityTenantShare: number; // 50% del recibo de luz (auto-calculado)
  water: number; // Recibo de agua
  total: number; // Alquiler + (Luz * 0.50) + Agua (auto-calculado)
  paid: boolean; // ¿Pagado?
  paidDate?: string;
  notes?: string;
}

export interface YearData {
  year: number;
  baseRent: number; // Alquiler base general para el año
  records: MonthRecord[];
}

export type StorageState = Record<number, YearData>;
