"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/header";
import { KpiCards } from "@/components/kpi-cards";
import { CalendarView } from "@/components/calendar-view";
import { BreakdownTable } from "@/components/breakdown-table";
import { TenantCompactView } from "@/components/tenant-compact-view";
import { StorageState, YearData } from "@/lib/types";
import { getDefaultDashboardState, createDefaultYearData } from "@/lib/initial-data";
import { calculateMonthValues, exportToCSV } from "@/lib/utils";
import { CheckCircle, Sparkles, Eye, Save, AlertTriangle, RotateCcw, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "dashboard_inquilino_state_v1";
const AVAILABLE_YEARS = [2025, 2026, 2027];

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [viewMode, setViewMode] = useState<"admin" | "compact">("admin");
  const [syncStatus, setSyncStatus] = useState<"saved" | "saving" | "offline">("saved");
  const [storageType, setStorageType] = useState<
    "cloud_kv" | "local_json" | "unconfigured_cloud" | "offline"
  >("local_json");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [data, setData] = useState<StorageState>(getDefaultDashboardState);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Store last server confirmed data for discard functionality
  const lastServerDataRef = useRef<StorageState>(getDefaultDashboardState());

  // Function to load data from server API
  const loadDataFromServer = async () => {
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          lastServerDataRef.current = json.data;
          setStorageType(json.storage || "local_json");
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
          } catch {}
          setSyncStatus("saved");
          setHasUnsavedChanges(false);
          return true;
        }
      }
    } catch {
      // Fallback
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === "object" && parsed !== null) {
          setData(parsed);
          lastServerDataRef.current = parsed;
        }
      }
    } catch {}
    setSyncStatus("offline");
    return false;
  };

  // Initial load
  useEffect(() => {
    setIsClient(true);
    loadDataFromServer();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Explicit Save to Server Action
  const handleSaveToServer = async (targetData?: StorageState) => {
    const dataToSave = targetData || data;
    setIsSaving(true);
    setSyncStatus("saving");

    try {
      // Always keep local cache fresh
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch {}

      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(dataToSave),
      });

      const json = await res.json().catch(() => null);

      if (res.ok && json?.success) {
        setSyncStatus("saved");
        setStorageType(json.storage || "local_json");
        setHasUnsavedChanges(false);
        lastServerDataRef.current = dataToSave;
        showToast(
          json.storage === "cloud_kv"
            ? "¡Cambios guardados en la nube (Vercel KV) para todos los usuarios!"
            : "¡Cambios guardados con éxito en data/payments.json!"
        );
      } else if (json?.storage === "unconfigured_cloud") {
        setStorageType("unconfigured_cloud");
        setSyncStatus("saved");
        setHasUnsavedChanges(false);
        showToast(
          "Guardado localmente. Para persistir en Vercel para todos los usuarios, añade Vercel KV en Storage."
        );
      } else {
        setSyncStatus("offline");
        showToast("Advertencia: No se pudo conectar con el servidor, cambios en caché local.");
      }
    } catch {
      setSyncStatus("offline");
      showToast("Error de conexión al guardar en el servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  // Refresh from server
  const handleRefreshFromServer = async () => {
    const success = await loadDataFromServer();
    if (success) {
      showToast("Datos actualizados desde el servidor.");
    } else {
      showToast("No se pudo conectar con el servidor.");
    }
  };

  // Discard local changes
  const handleDiscardChanges = () => {
    setData(lastServerDataRef.current);
    setHasUnsavedChanges(false);
    showToast("Cambios descartados. Se restauró la versión del servidor.");
  };

  // Local state update when user edits
  const updateLocalData = (newData: StorageState) => {
    setData(newData);
    setHasUnsavedChanges(true);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {}
  };

  // Current year data
  const currentYearData: YearData =
    data[currentYear] || createDefaultYearData(currentYear);

  // Handlers
  const handleUpdateRecord = (
    id: number,
    field:
      | "baseRent"
      | "electricityTotal"
      | "water"
      | "paid"
      | "paidRent"
      | "paidServices",
    value: number | boolean
  ) => {
    const updatedRecords = currentYearData.records.map((r) => {
      if (r.id !== id) return r;

      const newBaseRent = field === "baseRent" ? (value as number) : r.baseRent;
      const newLuz =
        field === "electricityTotal" ? (value as number) : r.electricityTotal;
      const newAgua = field === "water" ? (value as number) : r.water;

      let newPaidRent = r.paidRent ?? r.paid;
      let newPaidServices = r.paidServices ?? r.paid;

      if (field === "paidRent") {
        newPaidRent = value as boolean;
      } else if (field === "paidServices") {
        newPaidServices = value as boolean;
      } else if (field === "paid") {
        newPaidRent = value as boolean;
        newPaidServices = value as boolean;
      }

      const { electricityTenantShare, servicesTotal, total } =
        calculateMonthValues(newBaseRent, newLuz, newAgua);

      return {
        ...r,
        baseRent: newBaseRent,
        electricityTotal: newLuz,
        electricityTenantShare,
        water: newAgua,
        servicesTotal,
        total,
        paid: newPaidRent && newPaidServices,
        paidRent: newPaidRent,
        paidServices: newPaidServices,
      };
    });

    const updatedYearData: YearData = {
      ...currentYearData,
      records: updatedRecords,
    };

    updateLocalData({
      ...data,
      [currentYear]: updatedYearData,
    });
  };

  const handleTogglePaid = (id: number) => {
    const targetMonth = currentYearData.records.find((r) => r.id === id);
    if (!targetMonth) return;
    const isCurrentlyAllPaid =
      (targetMonth.paidRent ?? targetMonth.paid) &&
      (targetMonth.paidServices ?? targetMonth.paid);

    handleUpdateRecord(id, "paid", !isCurrentlyAllPaid);
    showToast(
      !isCurrentlyAllPaid
        ? `Mes de ${targetMonth.name} marcado como PAGADO. Recuerda guardar.`
        : `Mes de ${targetMonth.name} marcado como PENDIENTE. Recuerda guardar.`
    );
  };

  const handleToggleRentPaid = (id: number) => {
    const targetMonth = currentYearData.records.find((r) => r.id === id);
    if (!targetMonth) return;
    const current = targetMonth.paidRent ?? targetMonth.paid;
    handleUpdateRecord(id, "paidRent", !current);
    showToast(
      !current
        ? `Alquiler de ${targetMonth.name} marcado como PAGADO.`
        : `Alquiler de ${targetMonth.name} marcado como PENDIENTE.`
    );
  };

  const handleToggleServicesPaid = (id: number) => {
    const targetMonth = currentYearData.records.find((r) => r.id === id);
    if (!targetMonth) return;
    const current = targetMonth.paidServices ?? targetMonth.paid;
    handleUpdateRecord(id, "paidServices", !current);
    showToast(
      !current
        ? `Servicios de ${targetMonth.name} marcados como PAGADOS.`
        : `Servicios de ${targetMonth.name} marcados como PENDIENTES.`
    );
  };

  const handleUpdateBaseRent = (newRent: number) => {
    const updatedYearData: YearData = {
      ...currentYearData,
      baseRent: newRent,
    };

    updateLocalData({
      ...data,
      [currentYear]: updatedYearData,
    });
    showToast(`Alquiler base actualizado a S/ ${newRent.toFixed(2)}. Recuerda guardar los cambios.`);
  };

  const handleApplyBaseRentToAll = (newRent: number) => {
    const updatedRecords = currentYearData.records.map((r) => {
      const { electricityTenantShare, servicesTotal, total } =
        calculateMonthValues(newRent, r.electricityTotal, r.water);
      return {
        ...r,
        baseRent: newRent,
        electricityTenantShare,
        servicesTotal,
        total,
      };
    });

    const updatedYearData: YearData = {
      ...currentYearData,
      baseRent: newRent,
      records: updatedRecords,
    };

    updateLocalData({
      ...data,
      [currentYear]: updatedYearData,
    });
    showToast(
      `Alquiler de S/ ${newRent.toFixed(2)} aplicado a todos los 12 meses. Recuerda guardar los cambios.`
    );
  };

  const handleResetYear = () => {
    const freshData = createDefaultYearData(currentYear);
    const updated = {
      ...data,
      [currentYear]: freshData,
    };
    setData(updated);
    handleSaveToServer(updated);
    showToast(`Datos del año ${currentYear} restablecidos.`);
  };

  const handleExportCSV = () => {
    const csvContent = exportToCSV(currentYear, currentYearData.records);
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `pagos_inquilino_${currentYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Archivo CSV descargado con éxito.");
  };

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `payments_${currentYear}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Archivo JSON descargado.");
  };

  const handleImportJSON = (imported: StorageState) => {
    setData(imported);
    handleSaveToServer(imported);
    showToast("Datos importados y guardados.");
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl animate-in slide-in-from-bottom-3 duration-200 dark:bg-emerald-600">
          <CheckCircle className="h-4 w-4 text-emerald-400 dark:text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Bottom Save Bar when Unsaved Changes exist */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl rounded-2xl border border-amber-300 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-6 duration-200 dark:border-amber-700 dark:bg-slate-900/95 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Tienes cambios sin guardar en el servidor
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Para que otros usuarios o el inquilino los vean, presiona guardar.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-slate-600 hover:text-slate-900"
                onClick={handleDiscardChanges}
                disabled={isSaving}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Descartar
              </Button>
              <Button
                variant="emerald"
                size="sm"
                className="h-8 text-xs font-bold gap-1.5 shadow-md"
                onClick={() => handleSaveToServer()}
                disabled={isSaving}
              >
                <Save className="h-3.5 w-3.5" />
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <Header
        currentYear={currentYear}
        availableYears={AVAILABLE_YEARS}
        viewMode={viewMode}
        syncStatus={syncStatus}
        storageType={storageType}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onSaveChanges={() => handleSaveToServer()}
        onRefreshFromServer={handleRefreshFromServer}
        onViewModeChange={(mode) => setViewMode(mode)}
        onYearChange={(year) => setCurrentYear(year)}
        onResetYear={handleResetYear}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7 flex-1">
        {viewMode === "compact" ? (
          /* ================= VISTA COMPACTA PARA EL INQUILINO ================= */
          <TenantCompactView
            year={currentYear}
            records={currentYearData.records}
            baseRent={currentYearData.baseRent}
            onToggleRentPaid={handleToggleRentPaid}
            onToggleServicesPaid={handleToggleServicesPaid}
            onToast={showToast}
          />
        ) : (
          /* ================= VISTA COMPLETA ADMINISTRADOR ================= */
          <>
            {/* Banner with Tenant context & Rules reminder */}
            <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 p-4 sm:p-5 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-sky-950/20 shadow-xs print:hidden">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-600 text-white mt-0.5 shadow-sm">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Panel de Administración - Periodo {currentYear}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Edita valores y marca pagos. Haz clic en <strong>Guardar Cambios</strong> en la barra superior para persistir los datos para otros usuarios.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => setViewMode("compact")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
                  >
                    <Eye className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Vista Inquilino</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 1. Top KPI Cards */}
            <section aria-label="Tarjetas de Métricas Clave">
              <KpiCards
                records={currentYearData.records}
                baseRent={currentYearData.baseRent}
                onUpdateBaseRent={handleUpdateBaseRent}
                onApplyBaseRentToAll={handleApplyBaseRentToAll}
              />
            </section>

            {/* 2. Visual Calendar View (12 Months) */}
            <section aria-label="Calendario Anual">
              <CalendarView
                records={currentYearData.records}
                onTogglePaid={handleTogglePaid}
                onToggleRentPaid={handleToggleRentPaid}
                onToggleServicesPaid={handleToggleServicesPaid}
              />
            </section>

            {/* 3. Detailed Breakdown Table */}
            <section aria-label="Tabla de Desglose">
              <BreakdownTable
                records={currentYearData.records}
                onUpdateRecord={handleUpdateRecord}
              />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 dark:border-slate-800 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Control de Pagos de Inquilino
            </span>
            <span>•</span>
            <span className="text-slate-400">
              {storageType === "cloud_kv"
                ? "Persistencia en la nube (Vercel KV)"
                : storageType === "unconfigured_cloud"
                ? "Modo Vercel (Caché local)"
                : "Persistencia local en data/payments.json"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === "admin" ? "compact" : "admin")}
              className="text-emerald-600 hover:underline font-medium cursor-pointer dark:text-emerald-400"
            >
              {viewMode === "admin" ? "Cambiar a Vista Inquilino" : "Volver a Panel Admin"}
            </button>
            <span>•</span>
            <span>Periodo {currentYear}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
