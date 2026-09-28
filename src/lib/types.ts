export interface MonthRecord {
  id: number; // 1 to 12
  name: string; // 'Enero', 'Febrero', etc.
  shortName: string; // 'Ene', 'Feb', etc.
  baseRent: number; // Alquiler fijo
  electricityTotal: number; // Recibo de luz 100%
  electricityTenantShare: number; // 50% del recibo de luz (auto-calculado)
  water: number; // Recibo de agua
  servicesTotal: number; // Luz Inquilino 50% + Agua (auto-calculado)
  total: number; // Alquiler + Servicios (auto-calculado)
  paid: boolean; // Estado general / alquiler
  paidRent: boolean; // ¿Alquiler pagado?
  paidServices: boolean; // ¿Servicios de luz/agua pagados?
  paidDate?: string;
  notes?: string;
}

export interface YearData {
  year: number;
  baseRent: number; // Alquiler base general para el año
  records: MonthRecord[];
}

export type StorageState = Record<number, YearData>;
