"use client";

import { useState, useCallback, useMemo } from "react";
import {
  jsonToYaml,
  jsonToXml,
  jsonToCsv,
  downloadFile,
  exportOptions,
  ExportFormat,
} from "@/utils/exportFormats";

interface ExportModalProps {
  data: unknown;
  formattedJson: string;
  onClose: () => void;
}

export default function ExportModal({ data, formattedJson, onClose }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("json");
  const [copied, setCopied] = useState(false);

  const exportContent = useMemo(() => {
    switch (selectedFormat) {
      case "json":
        return { success: true, content: formattedJson };
      case "json-minified":
        return { success: true, content: JSON.stringify(data) };
      case "yaml":
        return { success: true, content: jsonToYaml(data) };
      case "xml":
        return { success: true, content: jsonToXml(data) };
      case "csv": {
        const result = jsonToCsv(data);
        if (result.success) {
          return { success: true, content: result.csv! };
        }
        return { success: false, error: result.error };
      }
      default:
        return { success: false, error: "Unknown format" };
    }
  }, [selectedFormat, data, formattedJson]);

  const handleCopy = useCallback(() => {
    if (exportContent.success && exportContent.content) {
      navigator.clipboard.writeText(exportContent.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [exportContent]);

  const handleDownload = useCallback(() => {
    if (exportContent.success && exportContent.content) {
      const option = exportOptions.find((o) => o.format === selectedFormat);
      if (option) {
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `export-${timestamp}.${option.extension}`;
        downloadFile(exportContent.content, filename, option.mimeType);
      }
    }
  }, [exportContent, selectedFormat]);

  const selectedOption = exportOptions.find((o) => o.format === selectedFormat);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Export / Convert</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="export-format-selector">
            <label>Format:</label>
            <div className="format-buttons">
              {exportOptions.map((option) => (
                <button
                  key={option.format}
                  className={`format-btn ${selectedFormat === option.format ? "active" : ""}`}
                  onClick={() => setSelectedFormat(option.format)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="export-preview">
            <div className="export-preview-header">
              <span>Preview ({selectedOption?.extension.toUpperCase()})</span>
              {exportContent.success && (
                <span className="preview-size">
                  {exportContent.content?.length.toLocaleString()} characters
                </span>
              )}
            </div>
            <div className="export-preview-content">
              {exportContent.success ? (
                <pre>{exportContent.content}</pre>
              ) : (
                <div className="export-error">
                  <span>⚠️</span>
                  <span>{exportContent.error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={handleCopy}
            disabled={!exportContent.success}
          >
            {copied ? "✓ Copied!" : "📋 Copy"}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={!exportContent.success}
          >
            💾 Download .{selectedOption?.extension}
          </button>
        </div>
      </div>
    </div>
  );
}
