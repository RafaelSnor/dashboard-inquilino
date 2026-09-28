"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Clock,
  Home,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { formatCurrency } from "@/lib/utils";
import { MonthRecord } from "@/lib/types";

interface KpiCardsProps {
  records: MonthRecord[];
  baseRent: number;
  onUpdateBaseRent: (newRent: number) => void;
  onApplyBaseRentToAll: (newRent: number) => void;
}

export function KpiCards({
  records,
  baseRent,
  onUpdateBaseRent,
  onApplyBaseRentToAll,
}: KpiCardsProps) {
  const [rentInput, setRentInput] = useState<string>(baseRent.toString());
  const [isEditingRent, setIsEditingRent] = useState(false);

  // Sync state if external baseRent changes
  React.useEffect(() => {
    setRentInput(baseRent.toString());
  }, [baseRent]);

  // Calculations taking into account that rent and services can be paid separately
  const totalCollected = records.reduce((sum, r) => {
    const rentPaid = (r.paidRent ?? r.paid) ? r.baseRent : 0;
    const servicesPaid = (r.paidServices ?? r.paid)
      ? (r.servicesTotal ?? r.electricityTenantShare + r.water)
      : 0;
    return sum + rentPaid + servicesPaid;
  }, 0);

  const totalYearProjected = records.reduce((sum, r) => sum + r.total, 0);
  const totalPending = Math.max(0, totalYearProjected - totalCollected);

  const fullyPaidMonthsCount = records.filter(
    (r) => (r.paidRent ?? r.paid) && (r.paidServices ?? r.paid)
  ).length;

  const rentPaidCount = records.filter((r) => r.paidRent ?? r.paid).length;
  const percentagePaid = totalYearProjected > 0
    ? Math.round((totalCollected / totalYearProjected) * 100)
    : 0;

  const handleSaveBaseRent = () => {
    const parsed = parseFloat(rentInput);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateBaseRent(parsed);
      setIsEditingRent(false);
    }
  };

  const handleApplyToAllMonths = () => {
    const parsed = parseFloat(rentInput);
    if (!isNaN(parsed) && parsed >= 0) {
      onApplyBaseRentToAll(parsed);
      setIsEditingRent(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Total Recaudado */}
      <Card className="relative overflow-hidden border-slate-200/90 shadow-sm hover:shadow-md transition-shadow dark:border-slate-800">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Recaudado
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-white">
              {formatCurrency(totalCollected)}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <Badge variant="emerald" className="gap-1 px-2 py-0.5 text-[11px]">
              <TrendingUp className="h-3 w-3" />
              {percentagePaid}% Cobrado
            </Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {rentPaidCount}/12 alq. al día
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Pendiente de Cobro */}
      <Card className="relative overflow-hidden border-slate-200/90 shadow-sm hover:shadow-md transition-shadow dark:border-slate-800">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pendiente de Cobro
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-white">
              {formatCurrency(totalPending)}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <Badge variant="amber" className="gap-1 px-2 py-0.5 text-[11px]">
              <AlertCircle className="h-3 w-3" />
              Saldo por Cobrar
            </Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {12 - fullyPaidMonthsCount} meses con saldo
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Alquiler Base */}
      <Card className="relative overflow-hidden border-slate-200/90 shadow-sm hover:shadow-md transition-shadow dark:border-slate-800">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Alquiler Base
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Home className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-3">
            {isEditingRent ? (
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">
                    S/
                  </span>
                  <input
                    type="number"
                    value={rentInput}
                    onChange={(e) => setRentInput(e.target.value)}
                    className="w-full rounded-md border border-emerald-500 bg-white pl-8 pr-2 py-1 text-base font-bold text-slate-900 shadow-sm focus:outline-none dark:bg-slate-800 dark:text-white"
                    placeholder="1000.00"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <Button size="sm" variant="emerald" className="h-7 text-xs px-2" onClick={handleSaveBaseRent}>
                    Guardar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-2 text-indigo-600 hover:text-indigo-700"
                    title="Aplica este alquiler a los 12 meses"
                    onClick={handleApplyToAllMonths}
                  >
                    Aplicar a todo
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs px-1.5" onClick={() => setIsEditingRent(false)}>
                    ✕
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline justify-between group">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-white">
                  {formatCurrency(baseRent)}
                </div>
                <button
                  onClick={() => setIsEditingRent(true)}
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-2 opacity-80 group-hover:opacity-100 transition-opacity dark:text-emerald-400 cursor-pointer"
                >
                  Editar
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Valor mensual de referencia
            </span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {baseRent > 0 ? "Configurado" : "Sin asignar"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Cuota Luz Inquilino */}
      <Card className="relative overflow-hidden border-slate-200/90 shadow-sm hover:shadow-md transition-shadow dark:border-slate-800">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-cyan-500" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Cuota Luz Inquilino
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-white">
              50%
            </div>
            <span className="text-xs font-medium text-sky-600 dark:text-sky-400">
              Regla Fija
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <Badge variant="sky" className="gap-1 px-2 py-0.5 text-[11px]">
              Prorrateo 50/50
            </Badge>
            <span className="text-[11px] text-slate-400 dark:text-slate-500" title="El total del recibo de luz se divide exactamente a la mitad">
              Luz Total × 0.50
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
