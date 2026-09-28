import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { StorageState } from "@/lib/types";
import { getDefaultDashboardState } from "@/lib/initial-data";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "payments.json");

/**
 * Ensures the data directory and payments.json exist.
 */
async function ensureDataFile(): Promise<StorageState> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content) as StorageState;
  } catch {
    // If not found or invalid, write defaults
    const defaults = getDefaultDashboardState();
    await fs.writeFile(DATA_FILE, JSON.stringify(defaults, null, 2), "utf-8");
    return defaults;
  }
}

/**
 * GET /api/data
 * Returns the stored data from data/payments.json
 */
export async function GET() {
  try {
    const data = await ensureDataFile();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al leer el archivo de persistencia JSON" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/data
 * Writes new data directly into data/payments.json
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { success: false, error: "Estructura de datos inválida" },
        { status: 400 }
      );
    }

    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(payload, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Persistencia guardada exitosamente en data/payments.json",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al guardar en el archivo JSON" },
      { status: 500 }
    );
  }
}
