import { MonthRecord, YearData, StorageState } from "./types";
import { calculateMonthValues } from "./utils";

const MONTH_NAMES = [
  { id: 1, name: "Enero", shortName: "Ene" },
  { id: 2, name: "Febrero", shortName: "Feb" },
  { id: 3, name: "Marzo", shortName: "Mar" },
  { id: 4, name: "Abril", shortName: "Abr" },
  { id: 5, name: "Mayo", shortName: "May" },
  { id: 6, name: "Junio", shortName: "Jun" },
  { id: 7, name: "Julio", shortName: "Jul" },
  { id: 8, name: "Agosto", shortName: "Ago" },
  { id: 9, name: "Setiembre", shortName: "Set" },
  { id: 10, name: "Octubre", shortName: "Oct" },
  { id: 11, name: "Noviembre", shortName: "Nov" },
  { id: 12, name: "Diciembre", shortName: "Dic" },
];

export function createDefaultYearData(year: number, defaultRent: number = 1000): YearData {
  // Sample data realistic for rental tracking: Year -> Month (1-12) -> Values
  const sampleData: Record<
    number,
    Record<number, { luz: number; agua: number; paidRent: boolean; paidServices: boolean }>
  > = {
    // 2025 sample
    2025: {
      1: { luz: 120, agua: 35, paidRent: true, paidServices: true },
      2: { luz: 110, agua: 32, paidRent: true, paidServices: true },
      3: { luz: 130, agua: 36, paidRent: true, paidServices: true },
      4: { luz: 125, agua: 34, paidRent: true, paidServices: true },
      5: { luz: 140, agua: 38, paidRent: true, paidServices: true },
      6: { luz: 135, agua: 35, paidRent: true, paidServices: true },
      7: { luz: 150, agua: 40, paidRent: true, paidServices: true },
      8: { luz: 145, agua: 38, paidRent: true, paidServices: true },
      9: { luz: 130, agua: 35, paidRent: true, paidServices: true },
      10: { luz: 125, agua: 34, paidRent: true, paidServices: true },
      11: { luz: 140, agua: 37, paidRent: true, paidServices: true },
      12: { luz: 160, agua: 42, paidRent: true, paidServices: true },
    },
    // 2026 sample (Current year)
    // Demonstrates real scenario: months 1-8 fully paid, month 9 rent paid but services pending, month 10-12 pending
    2026: {
      1: { luz: 135, agua: 36, paidRent: true, paidServices: true },
      2: { luz: 140, agua: 38, paidRent: true, paidServices: true },
      3: { luz: 128, agua: 35, paidRent: true, paidServices: true },
      4: { luz: 132, agua: 34, paidRent: true, paidServices: true },
      5: { luz: 145, agua: 39, paidRent: true, paidServices: true },
      6: { luz: 138, agua: 37, paidRent: true, paidServices: true },
      7: { luz: 152, agua: 41, paidRent: true, paidServices: true },
      8: { luz: 142, agua: 38, paidRent: true, paidServices: true },
      9: { luz: 130, agua: 35, paidRent: true, paidServices: false }, // Alquiler pagado, servicios pendientes!
      10: { luz: 125, agua: 34, paidRent: false, paidServices: false },
      11: { luz: 0, agua: 0, paidRent: false, paidServices: false },
      12: { luz: 0, agua: 0, paidRent: false, paidServices: false },
    },
    // 2027 future
    2027: {
      1: { luz: 0, agua: 0, paidRent: false, paidServices: false },
      2: { luz: 0, agua: 0, paidRent: false, paidServices: false },
      3: { luz: 0, agua: 0, paidRent: false, paidServices: false },
      4: { luz: 0, agua: 0, paidRent: false, paidServices: false },
      5: { luz: 0, agua: 0, paidRent: false, paidServices: false },
      6: { luz: 0, agua: 0, paidRent: false, paidServices: false },
      7: { luz: 0, agua: 0, paidRent: false, paidServices: false },
      8: { luz: 0, agua: 0, paidRent: false, paidServices: false },
      9: { luz: 0, agua: 0, paidRent: false, paidServices: false },
      10: { luz: 0, agua: 0, paidRent: false, paidServices: false },
      11: { luz: 0, agua: 0, paidRent: false, paidServices: false },
      12: { luz: 0, agua: 0, paidRent: false, paidServices: false },
    },
  };

  const records: MonthRecord[] = MONTH_NAMES.map((m) => {
    const preset = sampleData[year]?.[m.id] ?? {
      luz: 0,
      agua: 0,
      paidRent: false,
      paidServices: false,
    };
    const { electricityTenantShare, waterTenantShare, servicesTotal, total } = calculateMonthValues(
      defaultRent,
      preset.luz,
      preset.agua
    );

    return {
      id: m.id,
      name: m.name,
      shortName: m.shortName,
      baseRent: defaultRent,
      electricityTotal: preset.luz,
      electricityTenantShare,
      water: preset.agua,
      waterTenantShare,
      servicesTotal,
      total,
      paid: preset.paidRent && preset.paidServices,
      paidRent: preset.paidRent,
      paidServices: preset.paidServices,
    };
  });

  return {
    year,
    baseRent: defaultRent,
    records,
  };
}

export function getDefaultDashboardState(): StorageState {
  return {
    2025: createDefaultYearData(2025, 1000),
    2026: createDefaultYearData(2026, 1000),
    2027: createDefaultYearData(2027, 1000),
  };
}
