"use client";

import React from "react";
import { Check, Clock, CalendarDays, Zap, Droplets, Home } from "lucide-react";
import { MonthRecord } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface CalendarViewProps {
  records: MonthRecord[];
  onTogglePaid: (id: number) => void;
  onSelectMonth?: (id: number) => void;
}

export function CalendarView({
  records,
  onTogglePaid,
  onSelectMonth,
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
          Haz clic en cualquier tarjeta para cambiar el estado de pago
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {records.map((month) => {
          const isPaid = month.paid;

          return (
            <div
              key={month.id}
              onClick={() => onTogglePaid(month.id)}
              className={cn(
                "group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md",
                isPaid
                  ? "bg-emerald-50/90 border-emerald-500 ring-1 ring-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-500 dark:ring-emerald-500/50"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700"
              )}
            >
              {/* Header with Month Name and Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                      isPaid
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
                  variant={isPaid ? "emerald" : "amber"}
                  className={cn(
                    "text-[10px] uppercase font-bold tracking-wider",
                    isPaid ? "text-emerald-700 dark:text-emerald-300" : ""
                  )}
                >
                  {isPaid ? "PAGADO" : "PENDIENTE"}
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
                    isPaid
                      ? "text-emerald-800 dark:text-emerald-300"
                      : "text-slate-900 dark:text-white"
                  )}
                >
                  {formatCurrency(month.total)}
                </span>
              </div>

              {/* Mini Breakdown of Services */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Home className="h-3 w-3 text-slate-400" />
                    Alquiler:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(month.baseRent)}
                  </span>
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
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(month.water)}
                  </span>
                </div>
              </div>

              {/* Bottom Interactive Check/Toggle indicator */}
              <div className="mt-3 pt-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-colors">
                  {isPaid ? "Clic para marcar pendiente" : "Clic para marcar pagado"}
                </span>
                <div
                  className={cn(
                    "h-5 w-5 rounded-full flex items-center justify-center transition-all",
                    isPaid
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
