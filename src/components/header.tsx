"use client";

import React, { useState, useRef } from "react";
import {
  Calendar,
  Download,
  RotateCcw,
  FileSpreadsheet,
  FileJson,
  Printer,
  ChevronDown,
  Building2,
  LayoutDashboard,
  Eye,
  Upload,
  CheckCircle,
  Database,
  Save,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { StorageState } from "@/lib/types";

interface HeaderProps {
  currentYear: number;
  availableYears: number[];
  viewMode: "admin" | "compact";
  syncStatus: "saved" | "saving" | "offline";
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSaveChanges: () => void;
  onRefreshFromServer: () => void;
  onViewModeChange: (mode: "admin" | "compact") => void;
  onYearChange: (year: number) => void;
  onResetYear: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onImportJSON: (imported: StorageState) => void;
}

export function Header({
  currentYear,
  availableYears,
  viewMode,
  syncStatus,
  hasUnsavedChanges,
  isSaving,
  onSaveChanges,
  onRefreshFromServer,
  onViewModeChange,
  onYearChange,
  onResetYear,
  onExportCSV,
  onExportJSON,
  onImportJSON,
}: HeaderProps) {
  const [showResetModal, setShowResetModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrint = () => {
    setShowExportMenu(false);
    window.print();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (typeof parsed === "object" && parsed !== null) {
          onImportJSON(parsed as StorageState);
        }
      } catch {
        alert("El archivo seleccionado no es un JSON válido.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <>
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 transition-all dark:border-slate-800 dark:bg-slate-900/80 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
            {/* Title & Branding */}
            <div className="flex items-center space-x-3.5">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Control de Pagos de Inquilino
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                    <Database className="h-3 w-3" />
                    data/payments.json
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gestión mensual de alquiler, servicios y estado de pagos
                  </p>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        hasUnsavedChanges
                          ? "bg-amber-500 animate-pulse"
                          : syncStatus === "saved"
                          ? "bg-emerald-500"
                          : syncStatus === "saving"
                          ? "bg-sky-500 animate-spin"
                          : "bg-slate-400"
                      }`}
                    />
                    <span>
                      {hasUnsavedChanges
                        ? "Cambios pendientes de guardar"
                        : syncStatus === "saved"
                        ? "Guardado en servidor"
                        : syncStatus === "saving"
                        ? "Guardando..."
                        : "Modo local"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* View Mode Toggle, Save Button, Year Selector & Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* Hidden File Input for JSON import */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Botón Principal: GUARDAR CAMBIOS */}
              <Button
                size="sm"
                variant={hasUnsavedChanges ? "emerald" : "outline"}
                disabled={isSaving}
                onClick={onSaveChanges}
                className={`gap-1.5 h-8 px-3 text-xs font-bold transition-all shadow-sm ${
                  hasUnsavedChanges
                    ? "ring-2 ring-emerald-500/50 animate-bounce duration-1000"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                }`}
                title="Guarda los cambios para que persistan para el inquilino y otros usuarios en data/payments.json"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : hasUnsavedChanges ? (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Guardar Cambios</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Guardado</span>
                  </>
                )}
              </Button>

              {/* Botón: Sincronizar / Recargar del Servidor */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-slate-800 border-slate-300 dark:border-slate-700"
                title="Recargar datos más recientes del servidor"
                onClick={onRefreshFromServer}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>

              {/* View Mode Switcher */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
                <button
                  onClick={() => onViewModeChange("admin")}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    viewMode === "admin"
                      ? "bg-white text-slate-900 shadow-sm font-bold dark:bg-slate-900 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                  title="Panel de administración con edición"
                >
                  <LayoutDashboard className="h-3 w-3" />
                  <span>Admin</span>
                </button>
                <button
                  onClick={() => onViewModeChange("compact")}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    viewMode === "compact"
                      ? "bg-emerald-600 text-white shadow-sm font-bold"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                  title="Vista para el inquilino"
                >
                  <Eye className="h-3 w-3" />
                  <span>Inquilino</span>
                </button>
              </div>

              {/* Year Selector */}
              <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
                <Calendar className="h-3.5 w-3.5 ml-1.5 mr-0.5 text-slate-400" />
                <div className="flex space-x-0.5">
                  {availableYears.map((yr) => (
                    <button
                      key={yr}
                      onClick={() => onYearChange(yr)}
                      className={`px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        currentYear === yr
                          ? "bg-white text-emerald-700 shadow-sm font-bold dark:bg-slate-900 dark:text-emerald-400"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200"
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 font-medium border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 h-8 text-xs px-2.5"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                >
                  <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">Archivos</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </Button>

                {showExportMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowExportMenu(false)}
                    />
                    <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white p-1.5 shadow-xl border border-slate-200 z-20 animate-in fade-in-80 zoom-in-95 dark:bg-slate-900 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setShowExportMenu(false);
                          onExportCSV();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                        <div>
                          <div className="font-semibold">Descargar CSV</div>
                          <div className="text-[10px] text-slate-400">Excel / Google Sheets</div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setShowExportMenu(false);
                          onExportJSON();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <FileJson className="h-4 w-4 text-sky-600" />
                        <div>
                          <div className="font-semibold">Descargar payments.json</div>
                          <div className="text-[10px] text-slate-400">Copia de respaldo</div>
                        </div>
                      </button>
                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                      <button
                        onClick={() => {
                          setShowExportMenu(false);
                          fileInputRef.current?.click();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <Upload className="h-4 w-4 text-amber-600" />
                        <div>
                          <div className="font-semibold">Importar archivo JSON</div>
                          <div className="text-[10px] text-slate-400">Cargar respaldo previo</div>
                        </div>
                      </button>
                      <button
                        onClick={handlePrint}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <Printer className="h-4 w-4 text-indigo-600" />
                        <div>
                          <div className="font-semibold">Imprimir / PDF</div>
                          <div className="text-[10px] text-slate-400">Comprobante de reporte</div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Reset Data Button */}
              <Button
                variant="outline"
                size="sm"
                className="gap-1 font-medium border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 h-8 text-xs px-2.5"
                onClick={() => setShowResetModal(true)}
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden sm:inline">Restablecer</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title={`¿Restablecer datos del año ${currentYear}?`}
        description="Esta acción restablecerá los valores de alquiler, servicios y estado de pago de todos los meses de este año a los valores predeterminados y actualizará payments.json."
        confirmText="Sí, restablecer"
        cancelText="Cancelar"
        confirmVariant="destructive"
        onConfirm={onResetYear}
      >
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-amber-900 text-xs dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200">
          <strong>Aviso:</strong> Los cambios que hayas realizado en este año se perderán y se volverá a cargar la plantilla base de S/ 1,000.00.
        </div>
      </Modal>
    </>
  );
}
