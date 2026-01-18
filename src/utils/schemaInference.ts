export type JsonType = "string" | "number" | "boolean" | "null" | "object" | "array";

export interface SchemaNode {
  types: Set<JsonType>;
  children?: Map<string, SchemaNode>; // For objects
  items?: SchemaNode; // For arrays
  occurrences: number;
  hasInconsistentTypes: boolean;
}

export interface SchemaInfo {
  root: SchemaNode;
  inconsistentPaths: string[];
}

function getJsonType(value: unknown): JsonType {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value as JsonType;
}

function createEmptyNode(): SchemaNode {
  return {
    types: new Set(),
    occurrences: 0,
    hasInconsistentTypes: false,
  };
}

function mergeSchemaNodes(target: SchemaNode, source: SchemaNode): void {
  // Merge types
  source.types.forEach((t) => target.types.add(t));
  target.occurrences += source.occurrences;

  // Check for inconsistent types (more than one non-null type)
  const nonNullTypes = Array.from(target.types).filter((t) => t !== "null");
  target.hasInconsistentTypes = nonNullTypes.length > 1;

  // Merge children (for objects)
  if (source.children) {
    if (!target.children) {
      target.children = new Map();
    }
    source.children.forEach((childNode, key) => {
      if (target.children!.has(key)) {
        mergeSchemaNodes(target.children!.get(key)!, childNode);
      } else {
        target.children!.set(key, childNode);
      }
    });
  }

  // Merge items (for arrays)
  if (source.items) {
    if (!target.items) {
      target.items = source.items;
    } else {
      mergeSchemaNodes(target.items, source.items);
    }
  }
}

function inferSchemaFromValue(value: unknown): SchemaNode {
  const node = createEmptyNode();
  const type = getJsonType(value);
  node.types.add(type);
  node.occurrences = 1;

  if (type === "object" && value !== null) {
    node.children = new Map();
    const obj = value as Record<string, unknown>;
    for (const [key, val] of Object.entries(obj)) {
      node.children.set(key, inferSchemaFromValue(val));
    }
  } else if (type === "array") {
    const arr = value as unknown[];
    if (arr.length > 0) {
      // Infer schema from all array items and merge them
      node.items = createEmptyNode();
      for (const item of arr) {
        const itemSchema = inferSchemaFromValue(item);
        mergeSchemaNodes(node.items, itemSchema);
      }
    }
  }

  return node;
}

function collectInconsistentPaths(
  node: SchemaNode,
  currentPath: string,
  paths: string[]
): void {
  if (node.hasInconsistentTypes) {
    paths.push(currentPath || "(root)");
  }

  if (node.children) {
    node.children.forEach((child, key) => {
      const childPath = currentPath ? `${currentPath}.${key}` : key;
      collectInconsistentPaths(child, childPath, paths);
    });
  }

  if (node.items) {
    const itemPath = currentPath ? `${currentPath}[]` : "[]";
    collectInconsistentPaths(node.items, itemPath, paths);
  }
}

export function inferSchema(data: unknown): SchemaInfo {
  const root = inferSchemaFromValue(data);
  const inconsistentPaths: string[] = [];
  collectInconsistentPaths(root, "", inconsistentPaths);

  return {
    root,
    inconsistentPaths,
  };
}

export function formatTypes(types: Set<JsonType>): string {
  const arr = Array.from(types).sort();
  return arr.join(" | ");
}

export function schemaToObject(node: SchemaNode): unknown {
  const typeStr = formatTypes(node.types);

  if (node.children && node.children.size > 0) {
    const obj: Record<string, unknown> = {};
    node.children.forEach((child, key) => {
      obj[key] = schemaToObject(child);
    });
    return node.hasInconsistentTypes ? { "⚠️ MIXED": typeStr, ...obj } : obj;
  }

  if (node.items) {
    return [schemaToObject(node.items)];
  }

  return node.hasInconsistentTypes ? `⚠️ ${typeStr}` : typeStr;
}
