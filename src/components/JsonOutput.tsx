"use client";

import { useState, useCallback, memo, useMemo } from "react";
import { SearchMatch } from "@/utils/jsonUtils";

interface JsonOutputProps {
  data: unknown;
  indentSize?: number;
  searchMatches?: SearchMatch[];
  searchQuery?: string;
}

export default function JsonOutput({
  data,
  indentSize = 2,
  searchMatches = [],
  searchQuery = "",
}: JsonOutputProps) {
  const matchSet = useMemo(() => {
    const set = new Map<string, { isKey: boolean; isValue: boolean }>();
    for (const match of searchMatches) {
      const existing = set.get(match.path) || { isKey: false, isValue: false };
      if (match.type === "key") existing.isKey = true;
      if (match.type === "value") existing.isValue = true;
      set.set(match.path, existing);
    }
    return set;
  }, [searchMatches]);

  const indentStr = useMemo(() => " ".repeat(indentSize), [indentSize]);

  return (
    <div className="json-output">
      <JsonNode
        value={data}
        depth={0}
        path=""
        matchSet={matchSet}
        searchQuery={searchQuery}
        indentStr={indentStr}
      />
    </div>
  );
}

interface JsonNodeProps {
  value: unknown;
  depth: number;
  path: string;
  keyName?: string;
  isLast?: boolean;
  matchSet: Map<string, { isKey: boolean; isValue: boolean }>;
  searchQuery: string;
  indentStr: string;
}

const JsonNode = memo(function JsonNode({
  value,
  depth,
  path,
  keyName,
  isLast = true,
  matchSet,
  searchQuery,
  indentStr,
}: JsonNodeProps) {
  const [collapsed, setCollapsed] = useState(depth > 4);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const indent = indentStr.repeat(depth);
  const comma = isLast ? "" : ",";
  
  const match = matchSet.get(path);
  const isKeyMatch = match?.isKey || false;
  const isValueMatch = match?.isValue || false;

  const renderKey = () => {
    if (keyName === undefined) return null;
    return (
      <span className={`json-key ${isKeyMatch ? "search-highlight" : ""}`}>
        &quot;{highlightText(keyName, searchQuery, isKeyMatch)}&quot;
      </span>
    );
  };

  const renderColon = () => {
    if (keyName === undefined) return null;
    return <span className="json-colon">: </span>;
  };

  // Null
  if (value === null) {
    return (
      <div className="json-line">
        <span className="json-indent">{indent}</span>
        {renderKey()}
        {renderColon()}
        <span className={`json-null ${isValueMatch ? "search-highlight" : ""}`}>null</span>
        {comma}
      </div>
    );
  }

  // String
  if (typeof value === "string") {
    const escapedValue = escapeString(value);
    const isLongString = value.length > 100;
    const displayValue = isLongString ? escapedValue.slice(0, 100) + "..." : escapedValue;
    
    return (
      <div className="json-line" title={isLongString ? value : undefined}>
        <span className="json-indent">{indent}</span>
        {renderKey()}
        {renderColon()}
        <span className={`json-string ${isValueMatch ? "search-highlight" : ""}`}>
          &quot;{highlightText(displayValue, searchQuery, isValueMatch)}&quot;
        </span>
        {comma}
      </div>
    );
  }

  // Number
  if (typeof value === "number") {
    return (
      <div className="json-line">
        <span className="json-indent">{indent}</span>
        {renderKey()}
        {renderColon()}
        <span className={`json-number ${isValueMatch ? "search-highlight" : ""}`}>
          {highlightText(String(value), searchQuery, isValueMatch)}
        </span>
        {comma}
      </div>
    );
  }

  // Boolean
  if (typeof value === "boolean") {
    return (
      <div className="json-line">
        <span className="json-indent">{indent}</span>
        {renderKey()}
        {renderColon()}
        <span className={`json-boolean ${isValueMatch ? "search-highlight" : ""}`}>
          {highlightText(value ? "true" : "false", searchQuery, isValueMatch)}
        </span>
        {comma}
      </div>
    );
  }

  // Array
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <div className="json-line">
          <span className="json-indent">{indent}</span>
          {renderKey()}
          {renderColon()}
          <span className="json-bracket">[]</span>
          {comma}
        </div>
      );
    }

    return (
      <div className="json-node">
        <div className="json-line json-collapsible" onClick={toggleCollapse}>
          <span className="json-indent">{indent}</span>
          <span className="json-toggle">{collapsed ? "▶" : "▼"}</span>
          {renderKey()}
          {renderColon()}
          <span className="json-bracket">[</span>
          {collapsed && (
            <span className="json-collapsed-info">
              {" "}
              {value.length} item{value.length !== 1 ? "s" : ""}{" "}
            </span>
          )}
          {collapsed && <span className="json-bracket">]</span>}
          {collapsed && comma}
        </div>
        {!collapsed && (
          <>
            {value.map((item, index) => (
              <JsonNode
                key={`${path}[${index}]`}
                value={item}
                depth={depth + 1}
                path={`${path}[${index}]`}
                isLast={index === value.length - 1}
                matchSet={matchSet}
                searchQuery={searchQuery}
                indentStr={indentStr}
              />
            ))}
            <div className="json-line">
              <span className="json-indent">{indent}</span>
              <span className="json-bracket">]</span>
              {comma}
            </div>
          </>
        )}
      </div>
    );
  }

  // Object
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);

    if (entries.length === 0) {
      return (
        <div className="json-line">
          <span className="json-indent">{indent}</span>
          {renderKey()}
          {renderColon()}
          <span className="json-bracket">{"{}"}</span>
          {comma}
        </div>
      );
    }

    return (
      <div className="json-node">
        <div className="json-line json-collapsible" onClick={toggleCollapse}>
          <span className="json-indent">{indent}</span>
          <span className="json-toggle">{collapsed ? "▶" : "▼"}</span>
          {renderKey()}
          {renderColon()}
          <span className="json-bracket">{"{"}</span>
          {collapsed && (
            <span className="json-collapsed-info">
              {" "}
              {entries.length} key{entries.length !== 1 ? "s" : ""}{" "}
            </span>
          )}
          {collapsed && <span className="json-bracket">{"}"}</span>}
          {collapsed && comma}
        </div>
        {!collapsed && (
          <>
            {entries.map(([key, val], index) => (
              <JsonNode
                key={`${path}.${key}`}
                value={val}
                depth={depth + 1}
                path={path ? `${path}.${key}` : key}
                keyName={key}
                isLast={index === entries.length - 1}
                matchSet={matchSet}
                searchQuery={searchQuery}
                indentStr={indentStr}
              />
            ))}
            <div className="json-line">
              <span className="json-indent">{indent}</span>
              <span className="json-bracket">{"}"}</span>
              {comma}
            </div>
          </>
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className="json-line">
      <span className="json-indent">{indent}</span>
      {renderKey()}
      {renderColon()}
      <span className="json-unknown">{String(value)}</span>
      {comma}
    </div>
  );
});

function escapeString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

function highlightText(text: string, query: string, shouldHighlight: boolean): React.ReactNode {
  if (!shouldHighlight || !query) {
    return text;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return text;
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <>
      {before}
      <mark className="search-match">{match}</mark>
      {after}
    </>
  );
}
