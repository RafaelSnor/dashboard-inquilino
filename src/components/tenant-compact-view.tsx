"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Zap,
  Droplets,
  CheckCircle2,
  Clock,
  Share2,
  Printer,
  Check,
  Receipt,
  Home,
} from "lucide-react";
import { MonthRecord } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface TenantCompactViewProps {
  year: number;
  records: MonthRecord[];
  baseRent: number;
  onToggleRentPaid: (id: number) => void;
  onToggleServicesPaid: (id: number) => void;
  onToast: (msg: string) => void;
}

export function TenantCompactView({
  year,
  records,
  baseRent,
  onToggleRentPaid,
  onToggleServicesPaid,
  onToast,
}: TenantCompactViewProps) {
  const [copied, setCopied] = useState(false);

  // Separate calculations for rent and services
  const paidRentRecords = records.filter((r) => r.paidRent ?? r.paid);
  const pendingRentRecords = records.filter((r) => !(r.paidRent ?? r.paid));

  const paidServicesRecords = records.filter((r) => r.paidServices ?? r.paid);
  const pendingServicesRecords = records.filter((r) => !(r.paidServices ?? r.paid));

  const totalRentPaid = paidRentRecords.reduce((sum, r) => sum + r.baseRent, 0);
  const totalRentPending = pendingRentRecords.reduce((sum, r) => sum + r.baseRent, 0);

  const totalServicesPaid = paidServicesRecords.reduce(
    (sum, r) => sum + (r.servicesTotal ?? r.electricityTenantShare + r.water),
    0
  );
  const totalServicesPending = pendingServicesRecords.reduce(
    (sum, r) => sum + (r.servicesTotal ?? r.electricityTenantShare + r.water),
    0
  );

  // Generate WhatsApp summary distinguishing Rent vs Services
  const handleCopyWhatsApp = () => {
    const pendingRentNames = pendingRentRecords.map((r) => r.name).join(", ");
    const pendingServicesNames = pendingServicesRecords.map((r) => r.name).join(", ");

    const text = [
      `📋 *ESTADO DE CUENTA - ${year}*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏠 *ALQUILER:*`,
      `• Alquiler mensual: ${formatCurrency(baseRent)}`,
      `• Meses al día: ${paidRentRecords.length} de 12`,
      pendingRentRecords.length > 0
        ? `• Pendiente alquiler: ${formatCurrency(totalRentPending)} (${pendingRentNames})`
        : `• Alquiler: ¡Todo al día! ✅`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `⚡ *SERVICIOS (Luz 50% + Agua):*`,
      `• Pagado en servicios: ${formatCurrency(totalServicesPaid)}`,
      pendingServicesRecords.length > 0
        ? `• Pendiente servicios: ${formatCurrency(totalServicesPending)} (${pendingServicesNames})`
        : `• Servicios: ¡Todo al día! ✅`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `_Detalle individual generado para el inquilino_`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast("Resumen para WhatsApp copiado al portapapeles.");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
              Vista Inquilino • {year}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 dark:text-white">
            Control de Alquiler y Servicios
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Seguimiento independiente: el alquiler y los servicios se controlan por separado.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center print:hidden">
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

      {/* ================= 1. CARDS TIPO CALENDARIO PARA EL ALQUILER ================= */}
      <section className="space-y-3" aria-label="Calendario de Pagos de Alquiler">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Calendario de Alquiler ({year})
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Solo el pago del alquiler mensual pactado ({formatCurrency(baseRent)})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              {paidRentRecords.length} / 12 pagados
            </span>
          </div>
        </div>

        {/* 12 Cards Grid - PURE RENT */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {records.map((r) => {
            const isRentPaid = r.paidRent ?? r.paid;

            return (
              <div
                key={r.id}
                onClick={() => onToggleRentPaid(r.id)}
                className={cn(
                  "relative rounded-xl border p-3.5 transition-all duration-150 cursor-pointer shadow-xs select-none flex flex-col justify-between min-h-[110px]",
                  isRentPaid
                    ? "bg-emerald-50/90 border-emerald-400 ring-1 ring-emerald-400/60 dark:bg-emerald-950/30 dark:border-emerald-600"
                    : "bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800"
                )}
                title={`Clic para marcar alquiler de ${r.name} como ${isRentPaid ? "pendiente" : "pagado"}`}
              >
                {/* Month Name & Badge */}
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm uppercase tracking-tight text-slate-800 dark:text-slate-200">
                    {r.shortName}
                  </span>
                  <Badge
                    variant={isRentPaid ? "emerald" : "amber"}
                    className="text-[9px] px-1.5 py-0 font-bold"
                  >
                    {isRentPaid ? "PAGADO" : "PENDIENTE"}
                  </Badge>
                </div>

                {/* Monthly Rent Amount */}
                <div className="my-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Alquiler
                  </span>
                  <div
                    className={cn(
                      "text-base font-black tracking-tight",
                      isRentPaid
                        ? "text-emerald-800 dark:text-emerald-300"
                        : "text-slate-900 dark:text-white"
                    )}
                  >
                    {formatCurrency(r.baseRent)}
                  </div>
                </div>

                {/* Status indicator button */}
                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">
                    {isRentPaid ? "Al día" : "Por cobrar"}
                  </span>
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full flex items-center justify-center transition-colors",
                      isRentPaid
                        ? "bg-emerald-600 text-white"
                        : "border border-slate-300 bg-white dark:border-slate-700"
                    )}
                  >
                    {isRentPaid && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 2. TABLA COMPRIMIDA DE SERVICIOS (ABAJO) ================= */}
      <section className="space-y-3" aria-label="Tabla Comprimida de Servicios">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Liquidación de Servicios (Luz y Agua)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Prorrateo pactado del 50% de luz + consumo directo de agua
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Servicios pagados: {paidServicesRecords.length} de 12
            </span>
          </div>
        </div>

        {/* Compressed Services Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
                <th className="py-2 px-3 min-w-[95px]">Mes</th>
                <th className="py-2 px-3 min-w-[110px]">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-amber-500" />
                    <span>Luz 100%</span>
                  </div>
                </th>
                <th className="py-2 px-3 min-w-[120px]">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-sky-500" />
                    <span>Cuota Luz (50%)</span>
                  </div>
                </th>
                <th className="py-2 px-3 min-w-[100px]">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-blue-500" />
                    <span>Agua</span>
                  </div>
                </th>
                <th className="py-2 px-3 min-w-[120px] text-right font-black">
                  Total Servicios
                </th>
                <th className="py-2 px-3 min-w-[100px] text-center">
                  Estado Servicios
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {records.map((r) => {
                const isServicesPaid = r.paidServices ?? r.paid;
                const servicesTotal =
                  r.servicesTotal ?? r.electricityTenantShare + r.water;

                return (
                  <tr
                    key={r.id}
                    className={cn(
                      "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40",
                      isServicesPaid
                        ? "bg-emerald-50/25 dark:bg-emerald-950/15"
                        : "bg-white dark:bg-slate-900"
                    )}
                  >
                    {/* Mes */}
                    <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">
                      {r.name}
                    </td>

                    {/* Luz 100% */}
                    <td className="py-2 px-3 text-slate-500 dark:text-slate-400">
                      {formatCurrency(r.electricityTotal)}
                    </td>

                    {/* Cuota Luz 50% */}
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800">
                        {formatCurrency(r.electricityTenantShare)}
                      </span>
                    </td>

                    {/* Agua */}
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                      {formatCurrency(r.water)}
                    </td>

                    {/* Total Servicios a pagar */}
                    <td className="py-2 px-3 text-right">
                      <span
                        className={cn(
                          "font-bold text-xs",
                          isServicesPaid
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-slate-900 dark:text-white"
                        )}
                      >
                        {formatCurrency(servicesTotal)}
                      </span>
                    </td>

                    {/* Estado Servicios Toggle */}
                    <td className="py-2 px-3 text-center">
                      <Badge
                        variant={isServicesPaid ? "emerald" : "amber"}
                        className="text-[9px] px-2 py-0.5 cursor-pointer font-bold select-none hover:opacity-85 transition-opacity"
                        onClick={() => onToggleServicesPaid(r.id)}
                        title={`Clic para marcar servicios de ${r.name} como ${isServicesPaid ? "pendientes" : "pagados"}`}
                      >
                        {isServicesPaid ? "PAGADO" : "PENDIENTE"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Footer Summary of Services */}
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-100/90 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100">
                <td className="py-2.5 px-3 uppercase text-[10px] tracking-wider">
                  Total Servicios
                </td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                  {formatCurrency(
                    records.reduce((sum, r) => sum + r.electricityTotal, 0)
                  )}
                </td>
                <td className="py-2.5 px-3 text-sky-700 dark:text-sky-300">
                  {formatCurrency(
                    records.reduce((sum, r) => sum + r.electricityTenantShare, 0)
                  )}
                </td>
                <td className="py-2.5 px-3 text-blue-700 dark:text-blue-300">
                  {formatCurrency(
                    records.reduce((sum, r) => sum + r.water, 0)
                  )}
                </td>
                <td className="py-2.5 px-3 text-right font-extrabold text-slate-900 dark:text-white">
                  {formatCurrency(
                    records.reduce(
                      (sum, r) =>
                        sum +
                        (r.servicesTotal ??
                          r.electricityTenantShare + r.water),
                      0
                    )
                  )}
                </td>
                <td className="py-2.5 px-3 text-center text-[10px] text-slate-500 dark:text-slate-400">
                  {paidServicesRecords.length} / 12 Pagados
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
