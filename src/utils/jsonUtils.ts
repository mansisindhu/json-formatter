/**
 * Recursively sort object keys alphabetically
 * Arrays are not sorted, only objects within them
 */
export function sortObjectKeys(value: unknown): unknown {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }

  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(value as Record<string, unknown>).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  for (const key of keys) {
    sorted[key] = sortObjectKeys((value as Record<string, unknown>)[key]);
  }

  return sorted;
}

/**
 * Search for matching keys or values in JSON data
 * Returns paths to all matches
 */
export interface SearchMatch {
  path: string;
  type: "key" | "value";
  text: string;
}

export function searchJson(
  data: unknown,
  query: string,
  caseSensitive: boolean = false
): SearchMatch[] {
  const matches: SearchMatch[] = [];
  const searchQuery = caseSensitive ? query : query.toLowerCase();

  function search(value: unknown, path: string): void {
    if (value === null) {
      const text = "null";
      if (text.includes(searchQuery)) {
        matches.push({ path, type: "value", text });
      }
      return;
    }

    if (typeof value === "string") {
      const compareText = caseSensitive ? value : value.toLowerCase();
      if (compareText.includes(searchQuery)) {
        matches.push({ path, type: "value", text: value });
      }
      return;
    }

    if (typeof value === "number" || typeof value === "boolean") {
      const text = String(value);
      const compareText = caseSensitive ? text : text.toLowerCase();
      if (compareText.includes(searchQuery)) {
        matches.push({ path, type: "value", text });
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        search(item, `${path}[${index}]`);
      });
      return;
    }

    if (typeof value === "object") {
      for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
        const keyPath = path ? `${path}.${key}` : key;
        
        // Check if key matches
        const compareKey = caseSensitive ? key : key.toLowerCase();
        if (compareKey.includes(searchQuery)) {
          matches.push({ path: keyPath, type: "key", text: key });
        }
        
        // Recursively search value
        search(val, keyPath);
      }
    }
  }

  search(data, "");
  return matches;
}

/**
 * Check if a path matches any of the search matches
 */
export function isPathMatched(
  path: string,
  matches: SearchMatch[]
): { isKeyMatch: boolean; isValueMatch: boolean } {
  let isKeyMatch = false;
  let isValueMatch = false;

  for (const match of matches) {
    if (match.path === path) {
      if (match.type === "key") isKeyMatch = true;
      if (match.type === "value") isValueMatch = true;
    }
  }

  return { isKeyMatch, isValueMatch };
}
