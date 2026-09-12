import type { ProductItem } from "@/components/ProductDetailModal";
import heroIphoneWebp from "@/assets/hero-iphone.webp";
import iphone15Pro from "@/assets/iphone-15-pro.webp";
import iphone14 from "@/assets/iphone-14.webp";
import iphone13 from "@/assets/iphone-13.webp";
import iphone12 from "@/assets/iphone-12.webp";

export const STORAGE_SHEET_URL_KEY = "terephones_google_sheet_url";

export const DEFAULT_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRS0rZTaegIAfLgamTF-li05aIL96-4GiakjguCPF6BCq7-eCb_dumv-mY43ChHDDEorAYFQ0NXDmhD/pub?gid=626696730&single=true&output=csv";

/**
 * Intelligent image selector based on iPhone model name
 */
export function getProductImageByModel(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("16 pro") || n.includes("16 pro max")) {
    return heroIphoneWebp;
  }
  if (n.includes("16") || n.includes("16e")) {
    return heroIphoneWebp;
  }
  if (n.includes("15")) {
    return iphone15Pro;
  }
  if (n.includes("14")) {
    return iphone14;
  }
  if (n.includes("13")) {
    return iphone13;
  }
  if (n.includes("12") || n.includes("11")) {
    return iphone12;
  }
  return heroIphoneWebp;
}

/**
 * Intelligent specs auto-completer based on iPhone model
 */
export function getSpecsByModel(name: string, storage?: string, battery?: string) {
  const n = name.toLowerCase();
  const cap = storage || (n.includes("256") ? "256 GB" : "128 GB");
  const bat = battery || "Saúde 85%+ Testada";

  if (n.includes("16 pro max")) {
    return {
      storage: cap,
      screen: '6.9" Super Retina XDR ProMotion 120Hz',
      camera: "Tripla 48MP Fusion + Ultra-Wide 48MP + Teleobjetiva 5x",
      chip: "Apple A18 Pro com Ray Tracing",
      warranty: "90 Dias de Garantia Terephones",
      condition: "Seminovo Grade A+ Impecável",
    };
  }
  if (n.includes("16 pro")) {
    return {
      storage: cap,
      screen: '6.3" Super Retina XDR ProMotion 120Hz',
      camera: "Tripla 48MP Fusion + Ultra-Wide 48MP + Teleobjetiva 5x",
      chip: "Apple A18 Pro",
      warranty: "90 Dias de Garantia Terephones",
      condition: "Seminovo Grade A+ Impecável",
    };
  }
  if (n.includes("16e")) {
    return {
      storage: cap,
      screen: '6.1" Super Retina XDR OLED',
      camera: "Câmera 48MP Fusion com Zoom 2x",
      chip: "Apple A18",
      warranty: "90 Dias de Garantia Terephones",
      condition: "Seminovo Grade A+ Impecável",
    };
  }
  if (n.includes("16")) {
    return {
      storage: cap,
      screen: '6.1" Super Retina XDR com Dynamic Island',
      camera: "Dupla 48MP Fusion + Ultra-Wide c/ Controle de Câmera",
      chip: "Apple A18 Bionic",
      warranty: "90 Dias de Garantia Terephones",
      condition: "Seminovo Grade A+ Impecável",
    };
  }
  if (n.includes("15 pro")) {
    return {
      storage: cap,
      screen: '6.1" Super Retina XDR OLED 120Hz ProMotion',
      camera: "Tripla 48MP + Teleobjetiva 3x + Macro",
      chip: "A17 Pro (Arquitetura 3nm)",
      warranty: "90 Dias de Garantia Terephones",
      condition: "Seminovo Grade A+ Impecável",
    };
  }
  if (n.includes("15")) {
    return {
      storage: cap,
      screen: '6.1" Super Retina XDR com Dynamic Island',
      camera: "Dupla 48MP c/ zoom óptico 2x de alta resolução",
      chip: "A16 Bionic Ultra Rápido",
      warranty: "90 Dias de Garantia Terephones",
      condition: "Seminovo Grade A+ Impecável",
    };
  }
  if (n.includes("14 plus")) {
    return {
      storage: cap,
      screen: '6.7" Super Retina XDR OLED tela grande',
      camera: "Dupla 12MP Avançada c/ Modo Ação e Cinema",
      chip: "A15 Bionic com GPU de 5 núcleos",
      warranty: "90 Dias de Garantia Terephones",
      condition: "Seminovo Grade A+ Impecável",
    };
  }
  if (n.includes("14 pro")) {
    return {
      storage: cap,
      screen: '6.1" Super Retina XDR Always-On 120Hz',
      camera: "Sistema Pro 48MP com sensor quad-pixel",
      chip: "A16 Bionic com Neural Engine",
      warranty: "90 Dias de Garantia Terephones",
      condition: "Seminovo Grade A+ Impecável",
    };
  }
  if (n.includes("14")) {
    return {
      storage: cap,
      screen: '6.1" Super Retina XDR OLED True Tone',
      camera: "Dupla 12MP Avançada c/ Gravação 4K HDR",
      chip: "A15 Bionic com GPU de 5 núcleos",
      warranty: "90 Dias de Garantia Terephones",
      condition: "Seminovo Grade A+ Impecável",
    };
  }
  if (n.includes("13 pro max")) {
    return {
      storage: cap,
      screen: '6.7" Super Retina XDR 120Hz ProMotion',
      camera: "Sistema Pro Triplo 12MP com Teleobjetiva 3x",
      chip: "A15 Bionic Alta Performance",
      warranty: "90 Dias de Garantia Terephones",
      condition: "Seminovo Grade A+ Impecável",
    };
  }
  if (n.includes("13 pro")) {
    return {
      storage: cap,
      screen: '6.1" ProMotion 120Hz Super Fluida',
      camera: "Sistema Pro Triplo 12MP com modo macro e tele 3x",
      chip: "A15 Bionic Alta Performance",
      warranty: "90 Dias de Garantia Terephones",
      condition: "Seminovo Grade A+ Impecável",
    };
  }
  if (n.includes("13")) {
    return {
      storage: cap,
      screen: '6.1" Super Retina XDR OLED brilhante',
      camera: "Dupla 12MP c/ Estabilização Sensor-Shift",
      chip: "A15 Bionic Super Eficiente",
      warranty: "90 Dias de Garantia Terephones",
      condition: "Seminovo Grade A+",
    };
  }
  if (n.includes("12 pro max")) {
    return {
      storage: cap,
      screen: '6.7" Super Retina XDR OLED tela grande',
      camera: "Sistema Pro Triplo 12MP com Sensor LiDAR",
      chip: "A14 Bionic com conexão 5G",
      warranty: "90 Dias de Garantia Terephones",
      condition: "Seminovo Grade A+ Impecável",
    };
  }
  if (n.includes("12")) {
    return {
      storage: cap,
      screen: '6.1" Super Retina XDR OLED HDR10',
      camera: "Dupla 12MP c/ Modo Noturno em todas as lentes",
      chip: "A14 Bionic com conexão 5G",
      warranty: "90 Dias de Garantia Terephones",
      condition: "Seminovo Grade A+",
    };
  }
  return {
    storage: cap,
    screen: '6.1" Retina Display',
    camera: "Câmera Apple Avançada",
    chip: "Apple Bionic Chip",
    warranty: "90 Dias de Garantia Terephones",
    condition: "Seminovo Grade A+",
  };
}

/**
 * Normalizes any Google Sheets link to a public CSV download URL
 */
export function normalizeGoogleSheetUrl(inputUrl: string): string {
  const trimmed = inputUrl.trim();
  if (!trimmed) return "";

  // If already a published CSV export URL
  if (trimmed.includes("output=csv") || trimmed.includes("format=csv")) {
    return trimmed;
  }

  // If public web published doc: https://docs.google.com/spreadsheets/d/e/2PACX-.../pubhtml...
  const pubMatch = trimmed.match(/\/d\/e\/([a-zA-Z0-9-_]+)/);
  if (pubMatch && pubMatch[1]) {
    return `https://docs.google.com/spreadsheets/d/e/${pubMatch[1]}/pub?output=csv`;
  }

  // Standard sheet URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit...
  const idMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (idMatch && idMatch[1]) {
    return `https://docs.google.com/spreadsheets/d/${idMatch[1]}/export?format=csv`;
  }

  // If user just pasted the raw ID
  if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) {
    return `https://docs.google.com/spreadsheets/d/${trimmed}/export?format=csv`;
  }

  return trimmed;
}

/**
 * Parses CSV text taking into account quoted fields with commas and linebreaks
 */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let insideQuotes = false;

  const cleanText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++;
        } else {
          insideQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === "," || char === "\t" || char === ";") {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if (char === "\n") {
        currentRow.push(currentField.trim());
        if (currentRow.some(cell => cell.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Converts parsed CSV rows into ProductItem array
 */
export function transformCsvToProducts(rows: string[][]): ProductItem[] {
  if (rows.length < 2) return [];

  const headers = rows[0].map(h =>
    h
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
  );

  const modelIdx = headers.findIndex(h => h.includes("modelo") || h.includes("aparelho") || h.includes("nome") || h.includes("produto"));
  const batteryIdx = headers.findIndex(h => h === "%" || h.includes("bateria") || h.includes("saude"));
  const priceIdx = headers.findIndex(h => h.includes("preco") || h.includes("valor") || h.includes("venda"));
  const statusIdx = headers.findIndex(h => h.includes("status") || h.includes("dispon") || h.includes("cliente") || h.includes("fornecedor"));
  const categoryIdx = headers.findIndex(h => h.includes("categoria") || h.includes("tipo") || h.includes("condicao"));
  const imgIdx = headers.findIndex(h => h.includes("imagem") || h.includes("foto") || h.includes("url"));

  if (modelIdx === -1) return [];

  const products: ProductItem[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const rawModel = row[modelIdx]?.trim();
    if (!rawModel) continue;

    // Check if item is marked as sold
    if (statusIdx !== -1) {
      const statusValue = row[statusIdx]?.trim().toLowerCase() || "";
      if (statusValue.includes("vendido") || statusValue.includes("entregue")) {
        continue;
      }
    }

    const rawBattery = batteryIdx !== -1 ? (row[batteryIdx]?.trim() || "") : "";
    const rawPrice = priceIdx !== -1 ? (row[priceIdx]?.trim() || "") : "";
    const customImg = imgIdx !== -1 ? (row[imgIdx]?.trim() || "") : "";
    const customCat = categoryIdx !== -1 ? (row[categoryIdx]?.trim() || "") : "";

    // Parse numeric price
    let priceNumber = 0;
    if (rawPrice) {
      const cleaned = rawPrice
        .replace(/[^\d.,]/g, "")
        .replace(/\./g, "")
        .replace(",", ".");
      priceNumber = parseFloat(cleaned) || 0;
    }

    // Format Battery badge
    let batteryText = rawBattery;
    let badgeText = "Seminovo Grade A+";
    if (rawBattery) {
      if (/^\d+%?$/.test(rawBattery)) {
        const num = rawBattery.replace("%", "");
        batteryText = `${num}% de Saúde Original`;
        badgeText = `Bateria ${num}%`;
      } else if (rawBattery.toLowerCase().includes("trocada")) {
        batteryText = "Bateria Nova Trocada (100% Saúde)";
        badgeText = "Bateria 100% Nova";
      } else {
        batteryText = rawBattery;
        badgeText = rawBattery;
      }
    }

    // Determine category
    let cat = "Seminovos";
    if (customCat) {
      cat = customCat.toLowerCase().includes("novo") && !customCat.toLowerCase().includes("semi") ? "Novos" : "Seminovos";
    } else if (rawModel.toLowerCase().includes("novo") && !rawModel.toLowerCase().includes("semi")) {
      cat = "Novos";
    }

    // Extract storage
    const storageMatch = rawModel.match(/(\d+\s*GB|\d+\s*TB)/i);
    const storage = storageMatch ? storageMatch[1].toUpperCase() : "128 GB";

    // Clean model title for display
    let displayName = rawModel
      .replace(/\(SEMINOVO\)/gi, "")
      .replace(/\(NOVO\)/gi, "")
      .trim();

    displayName = displayName
      .split(" ")
      .map(w => {
        const lower = w.toLowerCase();
        if (["pro", "max", "plus", "gb", "tb"].includes(lower)) return w.toUpperCase();
        if (lower === "iphone") return "iPhone";
        if (lower === "16e") return "iPhone 16e";
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      })
      .join(" ");

    const specs = getSpecsByModel(displayName, storage, batteryText);
    const image = customImg || getProductImageByModel(displayName);

    products.push({
      name: displayName,
      price: priceNumber,
      cat,
      badge: badgeText,
      img: image,
      specs: `${storage} • ${badgeText} • Pronta Entrega`,
      storage: specs.storage,
      condition: specs.condition,
      warranty: specs.warranty,
      battery: batteryText,
      screen: specs.screen,
      camera: specs.camera,
      chip: specs.chip,
    });
  }

  return products;
}

/**
 * Fetches and syncs inventory from Google Sheets
 */
export async function fetchGoogleSheetInventory(sheetUrl: string): Promise<ProductItem[]> {
  const csvUrl = normalizeGoogleSheetUrl(sheetUrl);
  if (!csvUrl) {
    throw new Error("URL da planilha inválida ou vazia.");
  }

  const response = await fetch(csvUrl, {
    cache: "no-store",
    headers: {
      Accept: "text/csv,text/plain",
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao carregar planilha (status ${response.status}). Verifique se foi publicada como CSV.`);
  }

  const csvText = await response.text();
  const rows = parseCSV(csvText);
  const products = transformCsvToProducts(rows);

  if (products.length === 0) {
    throw new Error("Nenhum produto válido encontrado na planilha.");
  }

  return products;
}
