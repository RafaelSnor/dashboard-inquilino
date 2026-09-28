"use client";

import React from "react";
import { Check, CalendarDays, Zap, Droplets, Home } from "lucide-react";
import { MonthRecord } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface CalendarViewProps {
  records: MonthRecord[];
  onTogglePaid: (id: number) => void;
  onToggleRentPaid?: (id: number) => void;
  onToggleServicesPaid?: (id: number) => void;
}

export function CalendarView({
  records,
  onTogglePaid,
  onToggleRentPaid,
  onToggleServicesPaid,
}: CalendarViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight dark:text-white">
            Calendario Anual (12 Meses)
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Haz clic en cualquier tarjeta o etiqueta para cambiar el estado de pago
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {records.map((month) => {
          const isRentPaid = month.paidRent ?? month.paid;
          const isServicesPaid = month.paidServices ?? month.paid;
          const isFullyPaid = isRentPaid && isServicesPaid;

          return (
            <div
              key={month.id}
              className={cn(
                "group relative rounded-xl border p-4 transition-all duration-200 shadow-sm hover:shadow-md",
                isFullyPaid
                  ? "bg-emerald-50/90 border-emerald-500 ring-1 ring-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-500 dark:ring-emerald-500/50"
                  : isRentPaid || isServicesPaid
                  ? "bg-amber-50/30 border-amber-300 dark:bg-amber-950/15 dark:border-amber-800"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700"
              )}
            >
              {/* Header with Month Name and Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                      isFullyPaid
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    )}
                  >
                    {month.id.toString().padStart(2, "0")}
                  </span>
                  <span className="font-bold text-slate-900 text-base dark:text-white">
                    {month.name}
                  </span>
                </div>

                <Badge
                  variant={isFullyPaid ? "emerald" : "amber"}
                  className="text-[10px] uppercase font-bold tracking-wider cursor-pointer select-none"
                  onClick={() => onTogglePaid(month.id)}
                  title="Clic para cambiar estado global"
                >
                  {isFullyPaid
                    ? "PAGADO"
                    : isRentPaid
                    ? "ALQ. PAGADO"
                    : isServicesPaid
                    ? "SERV. PAGADO"
                    : "PENDIENTE"}
                </Badge>
              </div>

              {/* Total Monthly Amount */}
              <div className="my-2.5">
                <span className="text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500 block">
                  Total a Pagar
                </span>
                <span
                  className={cn(
                    "text-xl font-extrabold tracking-tight transition-colors",
                    isFullyPaid
                      ? "text-emerald-800 dark:text-emerald-300"
                      : "text-slate-900 dark:text-white"
                  )}
                >
                  {formatCurrency(month.total)}
                </span>
              </div>

              {/* Mini Breakdown of Services with Independent Status */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Home className="h-3 w-3 text-slate-400" />
                    Alquiler:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(month.baseRent)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleRentPaid?.(month.id);
                      }}
                      className={cn(
                        "text-[9px] px-1.5 py-0.2 rounded font-bold transition-colors cursor-pointer",
                        isRentPaid
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      )}
                    >
                      {isRentPaid ? "✓" : "Pend."}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Zap className="h-3 w-3 text-sky-500" />
                    Luz (50%):
                  </span>
                  <span className="font-semibold text-sky-700 dark:text-sky-300">
                    {formatCurrency(month.electricityTenantShare)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Droplets className="h-3 w-3 text-blue-500" />
                    Agua:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(month.water)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleServicesPaid?.(month.id);
                      }}
                      className={cn(
                        "text-[9px] px-1.5 py-0.2 rounded font-bold transition-colors cursor-pointer",
                        isServicesPaid
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      )}
                    >
                      {isServicesPaid ? "✓ Serv." : "Pend. Serv."}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Interactive Check indicator */}
              <div
                onClick={() => onTogglePaid(month.id)}
                className="mt-3 pt-2 flex items-center justify-between text-[11px] cursor-pointer"
              >
                <span className="text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-colors">
                  {isFullyPaid ? "Todo al día" : "Marcar todo pagado"}
                </span>
                <div
                  className={cn(
                    "h-5 w-5 rounded-full flex items-center justify-center transition-all",
                    isFullyPaid
                      ? "bg-emerald-500 text-white"
                      : "border border-slate-300 bg-white text-transparent group-hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800"
                  )}
                >
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
