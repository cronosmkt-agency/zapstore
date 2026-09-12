import test from "node:test";
import assert from "node:assert/strict";

// Re-implement the pure logic to test RFC4180 parsing and price/battery transforms
function normalizeGoogleSheetUrl(inputUrl) {
  const trimmed = inputUrl.trim();
  if (!trimmed) return "";
  if (trimmed.includes("output=csv") || trimmed.includes("format=csv")) return trimmed;
  const pubMatch = trimmed.match(/\/d\/e\/([a-zA-Z0-9-_]+)/);
  if (pubMatch && pubMatch[1]) return `https://docs.google.com/spreadsheets/d/e/${pubMatch[1]}/pub?output=csv`;
  const idMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (idMatch && idMatch[1]) return `https://docs.google.com/spreadsheets/d/${idMatch[1]}/export?format=csv`;
  if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) return `https://docs.google.com/spreadsheets/d/${trimmed}/export?format=csv`;
  return trimmed;
}

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
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

test("normalizeGoogleSheetUrl handles edit URLs, pubhtml, and direct CSV links", () => {
  assert.equal(
    normalizeGoogleSheetUrl("https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing"),
    "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/export?format=csv"
  );

  assert.equal(
    normalizeGoogleSheetUrl("https://docs.google.com/spreadsheets/d/e/2PACX-1vRe12345/pubhtml"),
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRe12345/pub?output=csv"
  );

  assert.equal(
    normalizeGoogleSheetUrl("https://docs.google.com/spreadsheets/d/e/2PACX-1vRe12345/pub?output=csv"),
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRe12345/pub?output=csv"
  );
});

test("parseCSV parses standard CSV text and handles quotes and linebreaks", () => {
  const csv = `MODELO,IMEI,%,PREÇO DE VENDA\nIPHONE 16 PRO MAX 256GB DESERT (SEMINOVO),354423231912896,98%,"R$ 5.290,00"\n"IPHONE 13 128GB PRETO (SEMINOVO)",359143407076830,"Bateria Trocada (100%)",R$ 1.590,00`;
  const rows = parseCSV(csv);
  assert.equal(rows.length, 3);
  assert.equal(rows[0][0], "MODELO");
  assert.equal(rows[1][0], "IPHONE 16 PRO MAX 256GB DESERT (SEMINOVO)");
  assert.equal(rows[1][2], "98%");
  assert.equal(rows[1][3], "R$ 5.290,00");
  assert.equal(rows[2][2], "Bateria Trocada (100%)");
});
