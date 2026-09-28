import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { StorageState } from "@/lib/types";
import { getDefaultDashboardState } from "@/lib/initial-data";
import { syncStorageStateWithBaseRent } from "@/lib/utils";
import { getRedisClient, STORAGE_KEY } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "payments.json");

/**
 * Fallback to local data/payments.json file if running locally.
 */
async function getLocalFile(): Promise<StorageState> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content) as StorageState;
  } catch {
    const defaults = getDefaultDashboardState();
    try {
      await fs.writeFile(DATA_FILE, JSON.stringify(defaults, null, 2), "utf-8");
    } catch {
      // Read-only environment fallback
    }
    return defaults;
  }
}

/**
 * GET /api/data
 */
export async function GET() {
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  };

  try {
    const redis = getRedisClient();

    // 1. If Cloud KV (Vercel KV / Upstash) is configured
    if (redis) {
      try {
        const cloudData = await redis.get<StorageState>(STORAGE_KEY);
        if (cloudData && typeof cloudData === "object") {
          const synced = syncStorageStateWithBaseRent(cloudData);
          return NextResponse.json(
            { success: true, data: synced, storage: "cloud_kv" },
            { headers }
          );
        }

        // If cloud database is empty, seed it with defaults
        const defaults = getDefaultDashboardState();
        await redis.set(STORAGE_KEY, defaults);
        return NextResponse.json(
          { success: true, data: defaults, storage: "cloud_kv" },
          { headers }
        );
      } catch (redisError) {
        console.error("Error reading from Redis:", redisError);
      }
    }

    // 2. Local JSON file fallback
    const localData = await getLocalFile();
    const synced = syncStorageStateWithBaseRent(localData);
    return NextResponse.json(
      {
        success: true,
        data: synced,
        storage: process.env.VERCEL ? "unconfigured_cloud" : "local_json",
      },
      { headers }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al leer datos" },
      { status: 500, headers }
    );
  }
}

/**
 * POST /api/data
 */
export async function POST(request: Request) {
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  };

  try {
    const payload = await request.json();

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { success: false, error: "Estructura de datos inválida" },
        { status: 400, headers }
      );
    }

    const syncedPayload = syncStorageStateWithBaseRent(payload as StorageState);

    const redis = getRedisClient();

    // 1. If Cloud KV is configured, save in Cloud for all users
    if (redis) {
      await redis.set(STORAGE_KEY, syncedPayload);
      return NextResponse.json(
        {
          success: true,
          storage: "cloud_kv",
          message: "Guardado en la nube (Vercel KV) para todos los usuarios",
        },
        { headers }
      );
    }

    // 2. If in Vercel without KV configured
    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          success: false,
          storage: "unconfigured_cloud",
          error:
            "Para persistir en Vercel para todos los usuarios, vincula Vercel KV / Upstash en la sección Storage de Vercel.",
        },
        { status: 503, headers }
      );
    }

    // 3. If running locally, save to data/payments.json
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(syncedPayload, null, 2), "utf-8");

    return NextResponse.json(
      {
        success: true,
        storage: "local_json",
        message: "Guardado en data/payments.json en tu disco",
      },
      { headers }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al guardar los datos" },
      { status: 500, headers }
    );
  }
}
