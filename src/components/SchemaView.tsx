"use client";

import { memo } from "react";
import { SchemaNode, formatTypes } from "@/utils/schemaInference";

interface SchemaViewProps {
  schema: SchemaNode;
  inconsistentPaths: string[];
}

export default function SchemaView({ schema, inconsistentPaths }: SchemaViewProps) {
  return (
    <div className="schema-view">
      {inconsistentPaths.length > 0 && (
        <div className="schema-warnings">
          <div className="schema-warning-header">
            <span className="warning-icon">⚠️</span>
            <span>Inconsistent Types Detected</span>
          </div>
          <ul className="schema-warning-list">
            {inconsistentPaths.map((path, i) => (
              <li key={i}>
                <code>{path}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="schema-tree">
        <SchemaNodeView node={schema} path="" />
      </div>
    </div>
  );
}

interface SchemaNodeViewProps {
  node: SchemaNode;
  path: string;
  keyName?: string;
}

const SchemaNodeView = memo(function SchemaNodeView({
  node,
  path,
  keyName,
}: SchemaNodeViewProps) {
  const typeStr = formatTypes(node.types);
  const hasChildren = node.children && node.children.size > 0;
  const hasItems = node.items;
  const isInconsistent = node.hasInconsistentTypes;

  // Simple leaf node
  if (!hasChildren && !hasItems) {
    return (
      <div className={`schema-line ${isInconsistent ? "schema-inconsistent" : ""}`}>
        {keyName && <span className="schema-key">{keyName}: </span>}
        <span className={`schema-type schema-type-${Array.from(node.types)[0]}`}>
          {typeStr}
        </span>
        {isInconsistent && <span className="schema-warning-badge">mixed</span>}
      </div>
    );
  }

  // Object node
  if (hasChildren) {
    return (
      <div className="schema-node">
        <div className={`schema-line ${isInconsistent ? "schema-inconsistent" : ""}`}>
          {keyName && <span className="schema-key">{keyName}: </span>}
          <span className="schema-type schema-type-object">{"{"}</span>
          {isInconsistent && <span className="schema-warning-badge">mixed</span>}
        </div>
        <div className="schema-children">
          {Array.from(node.children!.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, child]) => (
              <SchemaNodeView
                key={key}
                node={child}
                path={path ? `${path}.${key}` : key}
                keyName={key}
              />
            ))}
        </div>
        <div className="schema-line">
          <span className="schema-type schema-type-object">{"}"}</span>
        </div>
      </div>
    );
  }

  // Array node
  if (hasItems) {
    return (
      <div className="schema-node">
        <div className={`schema-line ${isInconsistent ? "schema-inconsistent" : ""}`}>
          {keyName && <span className="schema-key">{keyName}: </span>}
          <span className="schema-type schema-type-array">[</span>
          {isInconsistent && <span className="schema-warning-badge">mixed</span>}
        </div>
        <div className="schema-children">
          <SchemaNodeView
            node={node.items!}
            path={`${path}[]`}
          />
        </div>
        <div className="schema-line">
          <span className="schema-type schema-type-array">]</span>
        </div>
      </div>
    );
  }

  return null;
});
