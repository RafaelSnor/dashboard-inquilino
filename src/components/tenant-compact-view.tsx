"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Zap,
  Droplets,
  Home,
  CheckCircle2,
  Clock,
  Share2,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Receipt,
} from "lucide-react";
import { MonthRecord } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface TenantCompactViewProps {
  year: number;
  records: MonthRecord[];
  baseRent: number;
  onTogglePaid: (id: number) => void;
  onToast: (msg: string) => void;
}

export function TenantCompactView({
  year,
  records,
  baseRent,
  onTogglePaid,
  onToast,
}: TenantCompactViewProps) {
  const [copied, setCopied] = useState(false);

  // Totals calculations
  const paidRecords = records.filter((r) => r.paid);
  const pendingRecords = records.filter((r) => !r.paid);

  const totalPaid = paidRecords.reduce((sum, r) => sum + r.total, 0);
  const totalPending = pendingRecords.reduce((sum, r) => sum + r.total, 0);
  const totalAnnual = totalPaid + totalPending;

  const totalServicesLuz50 = records.reduce(
    (sum, r) => sum + r.electricityTenantShare,
    0
  );
  const totalServicesAgua = records.reduce((sum, r) => sum + r.water, 0);
  const totalServicesAll = totalServicesLuz50 + totalServicesAgua;

  // Generate WhatsApp formatted text
  const handleCopyWhatsApp = () => {
    const pendingNames = pendingRecords.map((r) => r.name).join(", ");
    const text = [
      `📋 *ESTADO DE CUENTA - ALQUILER Y SERVICIOS ${year}*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 *Resumen General:*`,
      `• Alquiler base: ${formatCurrency(baseRent)}`,
      `• Total Pagado: ${formatCurrency(totalPaid)} (${paidRecords.length}/12 meses)`,
      `• Saldo Pendiente: ${formatCurrency(totalPending)} (${pendingRecords.length} meses)`,
      pendingRecords.length > 0 ? `• Meses pendientes: ${pendingNames}` : `✅ ¡Todo al día!`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `💡 *Regla de Servicios:*`,
      `• Recibo de Luz: Prorrateo del 50% para el inquilino.`,
      `• Recibo de Agua: Consumo mensual correspondiente.`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `_Generado desde el Panel de Control de Inquilino_`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast("Resumen para WhatsApp copiado al portapapeles.");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Presentation Header Card for Tenant */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                Vista Inquilino
              </span>
              <span className="text-xs text-slate-400">• Periodo {year}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1 dark:text-white">
              Estado de Cuenta y Liquidación de Servicios
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Visualización compacta para control de alquiler y prorrateo de recibos de luz (50%) y agua.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-start md:self-center print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyWhatsApp}
              className="gap-1.5 text-xs font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copiar para WhatsApp</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5 text-xs font-semibold text-slate-700 border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir</span>
            </Button>
          </div>
        </div>

        {/* 3 Summary Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 dark:bg-emerald-950/30 dark:border-emerald-800/80">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                Total Abonado
              </span>
              <span className="text-lg font-extrabold text-emerald-900 dark:text-emerald-200">
                {formatCurrency(totalPaid)}
              </span>
            </div>
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-800/80">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                Saldo Pendiente
              </span>
              <span className="text-lg font-extrabold text-amber-900 dark:text-amber-200">
                {formatCurrency(totalPending)}
              </span>
            </div>
            <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
              <Clock className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Alquiler Base Pactado
              </span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-white">
                {formatCurrency(baseRent)}
              </span>
            </div>
            <div className="h-8 w-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 dark:bg-slate-700 dark:text-slate-300">
              <Home className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* 1. SECCIÓN SUPERIOR: Cards Tipo Calendario para el Alquiler */}
      <section className="space-y-3" aria-label="Calendario de Alquiler">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Calendario Mensual de Alquiler ({year})
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            12 meses • Toca para alternar estado
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {records.map((r) => {
            const isPaid = r.paid;
            const servicesTotal = r.electricityTenantShare + r.water;

            return (
              <div
                key={r.id}
                onClick={() => onTogglePaid(r.id)}
                className={cn(
                  "relative rounded-xl border p-3 transition-all duration-150 cursor-pointer shadow-xs select-none",
                  isPaid
                    ? "bg-emerald-50/90 border-emerald-400 ring-1 ring-emerald-400/60 dark:bg-emerald-950/30 dark:border-emerald-600"
                    : "bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800"
                )}
              >
                {/* Header: Month Short name & Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-xs uppercase tracking-tight text-slate-800 dark:text-slate-200">
                    {r.shortName}
                  </span>
                  <Badge
                    variant={isPaid ? "emerald" : "amber"}
                    className="text-[9px] px-1.5 py-0 font-bold"
                  >
                    {isPaid ? "PAGADO" : "PENDIENTE"}
                  </Badge>
                </div>

                {/* Amount to pay */}
                <div className="mb-2">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">
                    Total Mes
                  </span>
                  <div
                    className={cn(
                      "text-sm font-black tracking-tight",
                      isPaid
                        ? "text-emerald-800 dark:text-emerald-300"
                        : "text-slate-900 dark:text-white"
                    )}
                  >
                    {formatCurrency(r.total)}
                  </div>
                </div>

                {/* Micro Breakdown */}
                <div className="space-y-0.5 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Alquiler:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {formatCurrency(r.baseRent)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Servicios:</span>
                    <span className="font-semibold text-sky-700 dark:text-sky-300">
                      +{formatCurrency(servicesTotal)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. SECCIÓN INFERIOR: Tabla Comprimida de Servicios */}
      <section className="space-y-3" aria-label="Tabla Comprimida de Servicios">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Liquidación y Desglose de Servicios
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800">
              <Zap className="h-3 w-3" /> Luz: 50% prorrateado
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800">
              <Droplets className="h-3 w-3" /> Agua: consumo individual
            </span>
          </div>
        </div>

        {/* Compressed Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
                <th className="py-2.5 px-3 min-w-[95px]">Mes</th>
                <th className="py-2.5 px-3 min-w-[110px]">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-amber-500" />
                    <span>Luz 100%</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 min-w-[115px]">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-sky-500" />
                    <span>Cuota Luz (50%)</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 min-w-[100px]">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-blue-500" />
                    <span>Agua</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 min-w-[110px]">
                  <span>Subtotal Serv.</span>
                </th>
                <th className="py-2.5 px-3 min-w-[100px]">
                  <div className="flex items-center gap-1">
                    <Home className="h-3 w-3 text-slate-400" />
                    <span>Alquiler</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 min-w-[110px] text-right font-black">
                  Total a Pagar
                </th>
                <th className="py-2.5 px-3 min-w-[95px] text-center">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {records.map((r) => {
                const isPaid = r.paid;
                const servicesSubtotal = r.electricityTenantShare + r.water;

                return (
                  <tr
                    key={r.id}
                    className={cn(
                      "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40",
                      isPaid
                        ? "bg-emerald-50/30 dark:bg-emerald-950/15"
                        : "bg-white dark:bg-slate-900"
                    )}
                  >
                    {/* Mes */}
                    <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">
                      {r.name}
                    </td>

                    {/* Luz 100% */}
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                      {formatCurrency(r.electricityTotal)}
                    </td>

                    {/* Luz Inquilino 50% */}
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800">
                        {formatCurrency(r.electricityTenantShare)}
                      </span>
                    </td>

                    {/* Agua */}
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                      {formatCurrency(r.water)}
                    </td>

                    {/* Subtotal Servicios */}
                    <td className="py-2 px-3 font-semibold text-slate-700 dark:text-slate-200">
                      {formatCurrency(servicesSubtotal)}
                    </td>

                    {/* Alquiler */}
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                      {formatCurrency(r.baseRent)}
                    </td>

                    {/* Total a Pagar */}
                    <td className="py-2 px-3 text-right">
                      <span
                        className={cn(
                          "font-bold text-xs",
                          isPaid
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-slate-900 dark:text-white"
                        )}
                      >
                        {formatCurrency(r.total)}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="py-2 px-3 text-center">
                      <Badge
                        variant={isPaid ? "emerald" : "amber"}
                        className="text-[9px] px-1.5 py-0 cursor-pointer"
                        onClick={() => onTogglePaid(r.id)}
                      >
                        {isPaid ? "PAGADO" : "PENDIENTE"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Footer Summary */}
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-100/90 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100">
                <td className="py-2.5 px-3 uppercase text-[10px] tracking-wider">
                  Total Anual
                </td>
                <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                  {formatCurrency(
                    records.reduce((sum, r) => sum + r.electricityTotal, 0)
                  )}
                </td>
                <td className="py-2.5 px-3 text-sky-700 dark:text-sky-300">
                  {formatCurrency(totalServicesLuz50)}
                </td>
                <td className="py-2.5 px-3 text-blue-700 dark:text-blue-300">
                  {formatCurrency(totalServicesAgua)}
                </td>
                <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(totalServicesAll)}
                </td>
                <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                  {formatCurrency(
                    records.reduce((sum, r) => sum + r.baseRent, 0)
                  )}
                </td>
                <td className="py-2.5 px-3 text-right font-extrabold text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(totalAnnual)}
                </td>
                <td className="py-2.5 px-3 text-center text-[10px] text-slate-500 dark:text-slate-400">
                  {paidRecords.length} / 12 Pagados
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
