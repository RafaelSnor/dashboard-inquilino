import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MonthRecord, StorageState, YearData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number to Peruvian Soles (PEN) format: S/ 1,250.00
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "S/ 0.00";
  }
  return `S/ ${amount.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Calculates tenant electricity share (50%), tenant water share (50%), total services and grand total for a month.
 */
export function calculateMonthValues(
  baseRent: number,
  electricityTotal: number,
  water: number
): {
  electricityTenantShare: number;
  waterTenantShare: number;
  servicesTotal: number;
  total: number;
} {
  const safeRent = Number(baseRent) || 0;
  const safeLuz = Number(electricityTotal) || 0;
  const safeAgua = Number(water) || 0;

  const electricityTenantShare = Number((safeLuz * 0.5).toFixed(2));
  const waterTenantShare = Number((safeAgua * 0.5).toFixed(2));
  const servicesTotal = Number((electricityTenantShare + waterTenantShare).toFixed(2));
  const total = Number((safeRent + servicesTotal).toFixed(2));

  return {
    electricityTenantShare,
    waterTenantShare,
    servicesTotal,
    total,
  };
}

/**
 * Returns tenant's 50% share of electricity.
 */
export function getMonthElectricityShare(record: { electricityTotal: number }): number {
  return Number(((Number(record.electricityTotal) || 0) * 0.5).toFixed(2));
}

/**
 * Returns tenant's 50% share of water.
 */
export function getMonthWaterShare(record: { water: number }): number {
  return Number(((Number(record.water) || 0) * 0.5).toFixed(2));
}

/**
 * Returns tenant's total services: 50% Electricity + 50% Water.
 */
export function getMonthServicesTotal(record: { electricityTotal: number; water: number }): number {
  return Number(
    (getMonthElectricityShare(record) + getMonthWaterShare(record)).toFixed(2)
  );
}

/**
 * Returns month grand total: Base rent + 50% Electricity + 50% Water.
 */
export function getMonthTotal(record: { baseRent: number; electricityTotal: number; water: number }): number {
  const rent = Number(record.baseRent) || 0;
  return Number((rent + getMonthServicesTotal(record)).toFixed(2));
}

/**
 * Generates CSV content from MonthRecords
 */
export function exportToCSV(year: number, records: MonthRecord[]): string {
  const headers = [
    "Mes",
    "Alquiler Fijo (S/)",
    "Estado Alquiler",
    "Recibo Luz 100% (S/)",
    "Cuota Luz 50% (S/)",
    "Recibo Agua 100% (S/)",
    "Cuota Agua 50% (S/)",
    "Total Servicios (S/)",
    "Estado Servicios",
    "Total a Pagar (S/)",
  ];

  const rows = records.map((r) => {
    const elec50 = getMonthElectricityShare(r);
    const water50 = getMonthWaterShare(r);
    const servTotal = getMonthServicesTotal(r);
    const totalMes = getMonthTotal(r);
    return [
      r.name,
      r.baseRent.toFixed(2),
      (r.paidRent ?? r.paid) ? "PAGADO" : "PENDIENTE",
      r.electricityTotal.toFixed(2),
      elec50.toFixed(2),
      r.water.toFixed(2),
      water50.toFixed(2),
      servTotal.toFixed(2),
      (r.paidServices ?? r.paid) ? "PAGADO" : "PENDIENTE",
      totalMes.toFixed(2),
    ];
  });

  const csvContent = [
    `Control de Pagos de Inquilino - Año ${year}`,
    headers.join(";"),
    ...rows.map((row) => row.join(";")),
  ].join("\n");

  return csvContent;
}

/**
 * Synchronizes month records with a year's configured baseRent.
 * Recalculates tenant electricity share, tenant water share, services total and month total.
 */
export function syncYearRecordsWithBaseRent(yearData: YearData): YearData {
  if (!yearData) return yearData;
  const configuredRent =
    typeof yearData.baseRent === "number" && !isNaN(yearData.baseRent) && yearData.baseRent >= 0
      ? yearData.baseRent
      : undefined;

  const updatedRecords = (yearData.records || []).map((r) => {
    const rent = configuredRent !== undefined ? configuredRent : (Number(r.baseRent) || 0);
    const { electricityTenantShare, waterTenantShare, servicesTotal, total } = calculateMonthValues(
      rent,
      r.electricityTotal,
      r.water
    );
    return {
      ...r,
      baseRent: rent,
      electricityTenantShare,
      waterTenantShare,
      servicesTotal,
      total,
    };
  });

  return {
    ...yearData,
    baseRent: configuredRent !== undefined ? configuredRent : (yearData.baseRent || 0),
    records: updatedRecords,
  };
}

/**
 * Synchronizes all years in a StorageState with their respective configured baseRent.
 */
export function syncStorageStateWithBaseRent(state: StorageState): StorageState {
  if (!state || typeof state !== "object") return state;
  const synced: StorageState = {};
  for (const yearStr of Object.keys(state)) {
    const yearNum = Number(yearStr);
    const yData = state[yearNum];
    if (yData) {
      synced[yearNum] = syncYearRecordsWithBaseRent(yData);
    }
  }
  return synced;
}
