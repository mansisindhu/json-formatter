/**
 * Convert JSON to YAML format
 */
export function jsonToYaml(data: unknown, indent: number = 0): string {
  const spaces = "  ".repeat(indent);

  if (data === null) {
    return "null";
  }

  if (typeof data === "undefined") {
    return "~";
  }

  if (typeof data === "boolean") {
    return data ? "true" : "false";
  }

  if (typeof data === "number") {
    return String(data);
  }

  if (typeof data === "string") {
    // Check if string needs quoting
    if (
      data === "" ||
      data.includes("\n") ||
      data.includes(":") ||
      data.includes("#") ||
      data.startsWith(" ") ||
      data.endsWith(" ") ||
      /^[\d.]+$/.test(data) ||
      ["true", "false", "null", "yes", "no", "on", "off"].includes(data.toLowerCase())
    ) {
      return JSON.stringify(data);
    }
    return data;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return "[]";
    }
    const items = data.map((item) => {
      const value = jsonToYaml(item, indent + 1);
      if (typeof item === "object" && item !== null) {
        return `${spaces}- ${value.trimStart()}`;
      }
      return `${spaces}- ${value}`;
    });
    return "\n" + items.join("\n");
  }

  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) {
      return "{}";
    }
    const lines = entries.map(([key, value]) => {
      const yamlValue = jsonToYaml(value, indent + 1);
      const safeKey = /^[\w-]+$/.test(key) ? key : JSON.stringify(key);
      if (typeof value === "object" && value !== null && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0)) {
        return `${spaces}${safeKey}:${yamlValue}`;
      }
      return `${spaces}${safeKey}: ${yamlValue}`;
    });
    return (indent === 0 ? "" : "\n") + lines.join("\n");
  }

  return String(data);
}

/**
 * Convert JSON to XML format
 */
export function jsonToXml(data: unknown, rootName: string = "root"): string {

  function escapeXml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function toXmlElement(value: unknown, tagName: string, depth: number): string {
    const ind = "  ".repeat(depth);
    const safeTag = tagName.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/^[^a-zA-Z_]/, "_");

    if (value === null) {
      return `${ind}<${safeTag} xsi:nil="true"/>`;
    }

    if (typeof value === "undefined") {
      return `${ind}<${safeTag}/>`;
    }

    if (typeof value === "boolean" || typeof value === "number") {
      return `${ind}<${safeTag}>${value}</${safeTag}>`;
    }

    if (typeof value === "string") {
      return `${ind}<${safeTag}>${escapeXml(value)}</${safeTag}>`;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return `${ind}<${safeTag}/>`;
      }
      const items = value.map((item) => toXmlElement(item, "item", depth + 1));
      return `${ind}<${safeTag}>\n${items.join("\n")}\n${ind}</${safeTag}>`;
    }

    if (typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) {
        return `${ind}<${safeTag}/>`;
      }
      const children = entries.map(([key, val]) => toXmlElement(val, key, depth + 1));
      return `${ind}<${safeTag}>\n${children.join("\n")}\n${ind}</${safeTag}>`;
    }

    return `${ind}<${safeTag}>${escapeXml(String(value))}</${safeTag}>`;
  }

  const xmlContent = toXmlElement(data, rootName, 0);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${xmlContent}`;
}

/**
 * Convert JSON array to CSV format
 * Works best with arrays of flat objects
 */
export function jsonToCsv(data: unknown): { success: boolean; csv?: string; error?: string } {
  if (!Array.isArray(data)) {
    // If it's a single object, wrap it in an array
    if (typeof data === "object" && data !== null) {
      data = [data];
    } else {
      return {
        success: false,
        error: "CSV export requires an array of objects or a single object",
      };
    }
  }

  const arr = data as unknown[];
  if (arr.length === 0) {
    return { success: true, csv: "" };
  }

  // Collect all unique keys from all objects
  const allKeys = new Set<string>();
  const flatRows: Record<string, string>[] = [];

  for (const item of arr) {
    if (typeof item !== "object" || item === null) {
      // Convert primitives to a single-column row
      flatRows.push({ value: String(item) });
      allKeys.add("value");
      continue;
    }

    const flatRow: Record<string, string> = {};
    flattenObject(item as Record<string, unknown>, "", flatRow, allKeys);
    flatRows.push(flatRow);
  }

  const headers = Array.from(allKeys).sort();

  // Build CSV
  const escapeCsvValue = (val: string): string => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const headerRow = headers.map(escapeCsvValue).join(",");
  const dataRows = flatRows.map((row) =>
    headers.map((h) => escapeCsvValue(row[h] ?? "")).join(",")
  );

  return {
    success: true,
    csv: [headerRow, ...dataRows].join("\n"),
  };
}

function flattenObject(
  obj: Record<string, unknown>,
  prefix: string,
  result: Record<string, string>,
  keys: Set<string>
): void {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value === null) {
      result[fullKey] = "null";
      keys.add(fullKey);
    } else if (typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value as Record<string, unknown>, fullKey, result, keys);
    } else if (Array.isArray(value)) {
      result[fullKey] = JSON.stringify(value);
      keys.add(fullKey);
    } else {
      result[fullKey] = String(value);
      keys.add(fullKey);
    }
  }
}

/**
 * Download content as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export type ExportFormat = "json" | "json-minified" | "yaml" | "xml" | "csv";

export interface ExportOption {
  format: ExportFormat;
  label: string;
  extension: string;
  mimeType: string;
}

export const exportOptions: ExportOption[] = [
  { format: "json", label: "JSON (Formatted)", extension: "json", mimeType: "application/json" },
  { format: "json-minified", label: "JSON (Minified)", extension: "json", mimeType: "application/json" },
  { format: "yaml", label: "YAML", extension: "yaml", mimeType: "text/yaml" },
  { format: "xml", label: "XML", extension: "xml", mimeType: "application/xml" },
  { format: "csv", label: "CSV", extension: "csv", mimeType: "text/csv" },
];
