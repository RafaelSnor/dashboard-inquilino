import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MonthRecord } from "./types";

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
 * Calculates tenant electricity share (50%), total services and grand total for a month.
 */
export function calculateMonthValues(
  baseRent: number,
  electricityTotal: number,
  water: number
): { electricityTenantShare: number; servicesTotal: number; total: number } {
  const safeRent = Number(baseRent) || 0;
  const safeLuz = Number(electricityTotal) || 0;
  const safeAgua = Number(water) || 0;

  const electricityTenantShare = Number((safeLuz * 0.5).toFixed(2));
  const servicesTotal = Number((electricityTenantShare + safeAgua).toFixed(2));
  const total = Number((safeRent + servicesTotal).toFixed(2));

  return {
    electricityTenantShare,
    servicesTotal,
    total,
  };
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
    "Recibo Agua (S/)",
    "Total Servicios (S/)",
    "Estado Servicios",
    "Total a Pagar (S/)",
  ];

  const rows = records.map((r) => [
    r.name,
    r.baseRent.toFixed(2),
    (r.paidRent ?? r.paid) ? "PAGADO" : "PENDIENTE",
    r.electricityTotal.toFixed(2),
    r.electricityTenantShare.toFixed(2),
    r.water.toFixed(2),
    (r.servicesTotal ?? (r.electricityTenantShare + r.water)).toFixed(2),
    (r.paidServices ?? r.paid) ? "PAGADO" : "PENDIENTE",
    r.total.toFixed(2),
  ]);

  const csvContent = [
    `Control de Pagos de Inquilino - Año ${year}`,
    headers.join(";"),
    ...rows.map((row) => row.join(";")),
  ].join("\n");

  return csvContent;
}
