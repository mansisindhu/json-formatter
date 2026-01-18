"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import JsonOutput from "./JsonOutput";
import ThemeToggle from "./ThemeToggle";
import SchemaView from "./SchemaView";
import { sampleJsonData } from "./SampleData";
import { parseJsonError, getErrorSnippet } from "@/utils/errorParser";
import { inferSchema, SchemaInfo } from "@/utils/schemaInference";
import { sortObjectKeys, searchJson, SearchMatch } from "@/utils/jsonUtils";
import ExportModal from "./ExportModal";

interface ParseResult {
  success: true;
  data: unknown;
  formatted: string;
  schema: SchemaInfo;
}

interface ParseError {
  success: false;
  message: string;
  hint: string;
  position?: number;
  line?: number;
  column?: number;
}

type Result = ParseResult | ParseError;

type ViewMode = "formatted" | "schema";

export default function JsonFormatter() {
  const [input, setInput] = useState<string>("");
  const [indentSize, setIndentSize] = useState<number>(2);
  const [sortKeys, setSortKeys] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("formatted");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>("");
  const [loadError, setLoadError] = useState<string>("");
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseJson = useCallback(
    (jsonString: string): Result => {
      if (!jsonString.trim()) {
        return {
          success: false,
          message: "Please enter some JSON to format",
          hint: "Paste your JSON in the input area, upload a file, or fetch from a URL.",
        };
      }

      try {
        let parsed = JSON.parse(jsonString);
        
        // Sort keys if enabled
        if (sortKeys) {
          parsed = sortObjectKeys(parsed);
        }
        
        const formatted = JSON.stringify(parsed, null, indentSize);
        const schema = inferSchema(parsed);
        
        return {
          success: true,
          data: parsed,
          formatted,
          schema,
        };
      } catch (err) {
        if (err instanceof SyntaxError) {
          const parsed = parseJsonError(jsonString, err);
          return {
            success: false,
            message: parsed.message,
            hint: parsed.hint,
            position: parsed.position,
            line: parsed.line,
            column: parsed.column,
          };
        }
        return {
          success: false,
          message: "An unknown error occurred",
          hint: "Check that your input is valid JSON.",
        };
      }
    },
    [indentSize, sortKeys]
  );

  const result = useMemo(() => parseJson(input), [input, parseJson]);

  // Search matches
  const searchMatches = useMemo<SearchMatch[]>(() => {
    if (!result.success || !searchQuery.trim()) {
      return [];
    }
    return searchJson(result.data, searchQuery.trim(), false);
  }, [result, searchQuery]);

  const handleClear = useCallback(() => {
    setInput("");
    setSearchQuery("");
    setLoadError("");
  }, []);

  const handleCopy = useCallback(() => {
    if (result.success) {
      navigator.clipboard.writeText(result.formatted);
    }
  }, [result]);

  const handleCopyMinified = useCallback(() => {
    if (result.success) {
      const minified = JSON.stringify(result.data);
      navigator.clipboard.writeText(minified);
    }
  }, [result]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setLoadError("");
    } catch {
      // Clipboard access denied
    }
  }, []);

  const handleSampleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value, 10);
    if (index >= 0 && index < sampleJsonData.length) {
      setInput(JSON.stringify(sampleJsonData[index].data));
      setLoadError("");
    }
    e.target.value = "";
  }, []);

  // File upload handler
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setLoadError("Please select a JSON file");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setLoadError("File is too large. Maximum size is 10MB.");
      return;
    }

    setIsLoading(true);
    setLoadError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      setIsLoading(false);
    };
    reader.onerror = () => {
      setLoadError("Failed to read file");
      setIsLoading(false);
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleFileButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // URL fetch handler
  const handleFetchUrl = useCallback(async () => {
    if (!urlInput.trim()) {
      setLoadError("Please enter a URL");
      return;
    }

    // Basic URL validation
    let url: URL;
    try {
      url = new URL(urlInput.trim());
    } catch {
      setLoadError("Invalid URL format");
      return;
    }

    setIsLoading(true);
    setLoadError("");

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      setInput(text);
      setShowUrlInput(false);
      setUrlInput("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch URL";
      setLoadError(`Failed to fetch: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [urlInput]);

  const handleUrlKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetchUrl();
    } else if (e.key === 'Escape') {
      setShowUrlInput(false);
      setUrlInput("");
      setLoadError("");
    }
  }, [handleFetchUrl]);

  return (
    <div className="formatter-container">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      <div className="toolbar">
        <div className="toolbar-left">
          <button onClick={handlePaste} className="btn btn-secondary">
            📋 Paste
          </button>
          <button onClick={handleFileButtonClick} className="btn btn-secondary" disabled={isLoading}>
            📁 Upload
          </button>
          <button 
            onClick={() => setShowUrlInput(!showUrlInput)} 
            className={`btn btn-secondary ${showUrlInput ? 'active' : ''}`}
          >
            🔗 URL
          </button>
          <select
            onChange={handleSampleChange}
            className="sample-select"
            defaultValue=""
            aria-label="Load sample JSON"
          >
            <option value="" disabled>
              📝 Sample...
            </option>
            {sampleJsonData.map((sample, index) => (
              <option key={index} value={index}>
                {sample.name}
              </option>
            ))}
          </select>
          <button onClick={handleClear} className="btn btn-secondary">
            🗑️ Clear
          </button>
        </div>
        <div className="toolbar-right">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
              className="toggle-checkbox"
            />
            <span className="toggle-text">Sort Keys</span>
          </label>
          <label className="indent-label">
            Indent:
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="indent-select"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </label>
          {result.success && (
            <>
              <button onClick={handleCopyMinified} className="btn btn-secondary">
                ⚡ Copy Minified
              </button>
              <button onClick={handleCopy} className="btn btn-primary">
                📄 Copy
              </button>
              <button onClick={() => setShowExportModal(true)} className="btn btn-secondary">
                📤 Export
              </button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* URL Input Bar */}
      {showUrlInput && (
        <div className="url-input-bar">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={handleUrlKeyDown}
            placeholder="Enter URL to fetch JSON (e.g., https://api.example.com/data.json)"
            className="url-input"
            autoFocus
          />
          <button 
            onClick={handleFetchUrl} 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Fetch"}
          </button>
          <button 
            onClick={() => {
              setShowUrlInput(false);
              setUrlInput("");
              setLoadError("");
            }} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Loading/Error indicator */}
      {(isLoading || loadError) && (
        <div className={`load-status ${loadError ? 'load-error' : 'load-loading'}`}>
          {isLoading ? (
            <>
              <span className="loading-spinner">⏳</span>
              <span>Loading...</span>
            </>
          ) : (
            <>
              <span>⚠️</span>
              <span>{loadError}</span>
              <button onClick={() => setLoadError("")} className="dismiss-btn">✕</button>
            </>
          )}
        </div>
      )}

      <div className="editor-container">
        <div className="panel input-panel">
          <div className="panel-header">
            <h2>Input</h2>
            <span className="char-count">{input.length} characters</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here, upload a file, or fetch from URL..."
            className="json-input"
            spellCheck={false}
          />
        </div>

        <div className="panel output-panel">
          <div className="panel-header">
            <div className="panel-header-left">
              <h2>Output</h2>
              {result.success && (
                <div className="view-tabs">
                  <button
                    className={`view-tab ${viewMode === "formatted" ? "active" : ""}`}
                    onClick={() => setViewMode("formatted")}
                  >
                    Formatted
                  </button>
                  <button
                    className={`view-tab ${viewMode === "schema" ? "active" : ""}`}
                    onClick={() => setViewMode("schema")}
                  >
                    Schema
                    {result.schema.inconsistentPaths.length > 0 && (
                      <span className="schema-badge">
                        {result.schema.inconsistentPaths.length}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
            <div className="panel-header-right">
              {result.success && viewMode === "formatted" && (
                <div className="search-box">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="search-input"
                  />
                  {searchQuery && (
                    <span className="search-count">
                      {searchMatches.length} match{searchMatches.length !== 1 ? "es" : ""}
                    </span>
                  )}
                </div>
              )}
              {result.success && (
                <span className="char-count">
                  {result.formatted.length} characters
                </span>
              )}
            </div>
          </div>
          <div className="json-output-container">
            {!input.trim() ? (
              <div className="placeholder-message">
                Formatted JSON will appear here
              </div>
            ) : result.success ? (
              viewMode === "formatted" ? (
                <JsonOutput
                  data={result.data}
                  indentSize={indentSize}
                  searchMatches={searchMatches}
                  searchQuery={searchQuery}
                />
              ) : (
                <SchemaView
                  schema={result.schema.root}
                  inconsistentPaths={result.schema.inconsistentPaths}
                />
              )
            ) : (
              <div className="error-container">
                <div className="error-header">
                  <span className="error-icon">⚠️</span>
                  <span className="error-title">Invalid JSON</span>
                </div>
                <div className="error-message">{result.message}</div>
                <div className="error-hint">
                  <strong>💡 Hint:</strong> {result.hint}
                </div>
                {result.line !== undefined && result.column !== undefined && (
                  <div className="error-location">
                    📍 Line {result.line}, Column {result.column}
                  </div>
                )}
                {result.position !== undefined && (
                  <div className="error-context">
                    <div className="error-context-label">
                      Error location:
                    </div>
                    <pre className="error-snippet">
                      {getErrorSnippet(input, result.position)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && result.success && (
        <ExportModal
          data={result.data}
          formattedJson={result.formatted}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
