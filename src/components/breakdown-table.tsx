"use client";

import React from "react";
import { Table, Zap, Droplets, Home, CheckCircle2, Clock } from "lucide-react";
import { MonthRecord } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";

interface BreakdownTableProps {
  records: MonthRecord[];
  onUpdateRecord: (
    id: number,
    field: "baseRent" | "electricityTotal" | "water" | "paid" | "paidRent" | "paidServices",
    value: number | boolean
  ) => void;
}

export function BreakdownTable({
  records,
  onUpdateRecord,
}: BreakdownTableProps) {
  // Totals calculations for the footer
  const totalAlquiler = records.reduce((sum, r) => sum + r.baseRent, 0);
  const totalLuz100 = records.reduce((sum, r) => sum + r.electricityTotal, 0);
  const totalLuz50 = records.reduce((sum, r) => sum + r.electricityTenantShare, 0);
  const totalAgua = records.reduce((sum, r) => sum + r.water, 0);
  const totalServicios = records.reduce(
    (sum, r) => sum + (r.servicesTotal ?? r.electricityTenantShare + r.water),
    0
  );
  const grandTotal = records.reduce((sum, r) => sum + r.total, 0);

  const totalPaidAmount = records.reduce((sum, r) => {
    const rentAmount = (r.paidRent ?? r.paid) ? r.baseRent : 0;
    const servAmount = (r.paidServices ?? r.paid)
      ? (r.servicesTotal ?? r.electricityTenantShare + r.water)
      : 0;
    return sum + rentAmount + servAmount;
  }, 0);

  const totalPendingAmount = grandTotal - totalPaidAmount;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <Table className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight dark:text-white">
            Desglose Detallado de Servicios y Prorrateo
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Pagado: {formatCurrency(totalPaidAmount)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Pendiente: {formatCurrency(totalPendingAmount)}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
              <th scope="col" className="py-3.5 px-4 min-w-[120px]">
                Mes
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[150px]">
                <div className="flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5 text-slate-400" />
                  <span>Alquiler Fijo</span>
                </div>
              </th>
              <th scope="col" className="py-3.5 px-3 min-w-[130px] text-center">
                ¿Alquiler Pagado?
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[130px]">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span>Luz 100%</span>
                </div>
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[140px]">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-sky-500" />
                  <span>Luz Inquilino 50%</span>
                </div>
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[120px]">
                <div className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-blue-500" />
                  <span>Agua</span>
                </div>
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[130px]">
                <span>Total Servicios</span>
              </th>
              <th scope="col" className="py-3.5 px-3 min-w-[140px] text-center">
                ¿Servicios Pagados?
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[130px] text-right">
                Total Mes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {records.map((r) => {
              const isRentPaid = r.paidRent ?? r.paid;
              const isServicesPaid = r.paidServices ?? r.paid;
              const isAllPaid = isRentPaid && isServicesPaid;
              const servicesSubtotal =
                r.servicesTotal ?? r.electricityTenantShare + r.water;

              return (
                <tr
                  key={r.id}
                  className={cn(
                    "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50",
                    isAllPaid
                      ? "bg-emerald-50/30 dark:bg-emerald-950/20"
                      : isRentPaid || isServicesPaid
                      ? "bg-amber-50/15 dark:bg-amber-950/10"
                      : "bg-white dark:bg-slate-900"
                  )}
                >
                  {/* Mes */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold",
                          isAllPaid
                            ? "bg-emerald-200/70 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        )}
                      >
                        {r.id}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {r.name}
                      </span>
                    </div>
                  </td>

                  {/* Alquiler Fijo (Editable) */}
                  <td className="py-3 px-4">
                    <div className="relative flex items-center max-w-[125px]">
                      <span className="absolute left-2.5 text-xs font-bold text-slate-400 select-none">
                        S/
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={r.baseRent === 0 ? "" : r.baseRent}
                        placeholder="0.00"
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          onUpdateRecord(r.id, "baseRent", Math.max(0, val));
                        }}
                        className="h-8 w-full rounded-md border border-slate-200 bg-white pl-7 pr-2 py-1 text-xs font-medium text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </td>

                  {/* ¿Alquiler Pagado? */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Checkbox
                        checked={isRentPaid}
                        onCheckedChange={(checked) =>
                          onUpdateRecord(r.id, "paidRent", checked)
                        }
                      />
                      <Badge
                        variant={isRentPaid ? "emerald" : "amber"}
                        className="cursor-pointer text-[10px] py-0 px-1.5"
                        onClick={() =>
                          onUpdateRecord(r.id, "paidRent", !isRentPaid)
                        }
                      >
                        {isRentPaid ? "AL DÍA" : "PENDIENTE"}
                      </Badge>
                    </div>
                  </td>

                  {/* Recibo Luz 100% (Editable) */}
                  <td className="py-3 px-4">
                    <div className="relative flex items-center max-w-[125px]">
                      <span className="absolute left-2.5 text-xs font-bold text-slate-400 select-none">
                        S/
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={r.electricityTotal === 0 ? "" : r.electricityTotal}
                        placeholder="0.00"
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          onUpdateRecord(r.id, "electricityTotal", Math.max(0, val));
                        }}
                        className="h-8 w-full rounded-md border border-slate-200 bg-white pl-7 pr-2 py-1 text-xs font-medium text-slate-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </td>

                  {/* Luz Inquilino 50% (Auto-calculado) */}
                  <td className="py-3 px-4">
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800">
                      {formatCurrency(r.electricityTenantShare)}
                    </div>
                  </td>

                  {/* Recibo Agua (Editable) */}
                  <td className="py-3 px-4">
                    <div className="relative flex items-center max-w-[115px]">
                      <span className="absolute left-2.5 text-xs font-bold text-slate-400 select-none">
                        S/
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={r.water === 0 ? "" : r.water}
                        placeholder="0.00"
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          onUpdateRecord(r.id, "water", Math.max(0, val));
                        }}
                        className="h-8 w-full rounded-md border border-slate-200 bg-white pl-7 pr-2 py-1 text-xs font-medium text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </td>

                  {/* Total Servicios */}
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200 text-xs">
                    {formatCurrency(servicesSubtotal)}
                  </td>

                  {/* ¿Servicios Pagados? */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Checkbox
                        checked={isServicesPaid}
                        onCheckedChange={(checked) =>
                          onUpdateRecord(r.id, "paidServices", checked)
                        }
                      />
                      <Badge
                        variant={isServicesPaid ? "emerald" : "amber"}
                        className="cursor-pointer text-[10px] py-0 px-1.5"
                        onClick={() =>
                          onUpdateRecord(r.id, "paidServices", !isServicesPaid)
                        }
                      >
                        {isServicesPaid ? "AL DÍA" : "PENDIENTE"}
                      </Badge>
                    </div>
                  </td>

                  {/* Total Mes a Pagar */}
                  <td className="py-3 px-4 text-right">
                    <span
                      className={cn(
                        "text-sm font-extrabold tracking-tight",
                        isAllPaid
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-slate-900 dark:text-white"
                      )}
                    >
                      {formatCurrency(r.total)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Table Footer Totals */}
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-slate-100/90 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100">
              <td className="py-3.5 px-4 text-xs uppercase tracking-wider">
                Totales Anuales
              </td>
              <td className="py-3.5 px-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                {formatCurrency(totalAlquiler)}
              </td>
              <td className="py-3.5 px-3 text-center text-xs text-emerald-700 dark:text-emerald-400">
                {records.filter((r) => r.paidRent ?? r.paid).length}/12
              </td>
              <td className="py-3.5 px-4 text-xs font-bold text-amber-700 dark:text-amber-400">
                {formatCurrency(totalLuz100)}
              </td>
              <td className="py-3.5 px-4 text-xs font-bold text-sky-700 dark:text-sky-300">
                {formatCurrency(totalLuz50)}
              </td>
              <td className="py-3.5 px-4 text-xs font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(totalAgua)}
              </td>
              <td className="py-3.5 px-4 text-xs font-bold text-slate-800 dark:text-slate-200">
                {formatCurrency(totalServicios)}
              </td>
              <td className="py-3.5 px-3 text-center text-xs text-emerald-700 dark:text-emerald-400">
                {records.filter((r) => r.paidServices ?? r.paid).length}/12
              </td>
              <td className="py-3.5 px-4 text-right text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                {formatCurrency(grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
