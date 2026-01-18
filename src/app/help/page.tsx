import Link from "next/link";

export default function HelpPage() {
  return (
    <main className="help-container">
      <header className="help-header">
        <Link href="/" className="back-link">
          ← Back to Formatter
        </Link>
        <h1>How It Works</h1>
        <p>A complete guide to using the JSON Formatter</p>
      </header>

      <div className="help-content">
        {/* Getting Started */}
        <section className="help-section">
          <h2>🚀 Getting Started</h2>
          <p>
            The JSON Formatter helps you format, validate, and convert JSON data.
            There are several ways to load your JSON:
          </p>
          <ul>
            <li><strong>Paste</strong> - Click the &quot;📋 Paste&quot; button or paste directly into the input area</li>
            <li><strong>Upload</strong> - Click &quot;📁 Upload&quot; to select a .json file from your computer (up to 10MB)</li>
            <li><strong>URL</strong> - Click &quot;🔗 URL&quot; to fetch JSON from any web URL</li>
            <li><strong>Sample</strong> - Select from pre-built sample JSON to explore features</li>
          </ul>
        </section>

        {/* Formatting Options */}
        <section className="help-section">
          <h2>✨ Formatting Options</h2>
          
          <h3>Indentation</h3>
          <p>
            Choose your preferred indentation level using the &quot;Indent&quot; dropdown:
          </p>
          <ul>
            <li><strong>2 spaces</strong> - Compact, commonly used in web development</li>
            <li><strong>4 spaces</strong> - More readable, common in many languages</li>
            <li><strong>8 spaces</strong> - Extra wide for maximum readability</li>
          </ul>

          <h3>Sort Keys</h3>
          <p>
            Enable &quot;Sort Keys&quot; to alphabetically sort all object keys. This is useful for:
          </p>
          <ul>
            <li>Comparing two JSON objects</li>
            <li>Creating consistent output</li>
            <li>Finding keys more easily</li>
          </ul>
          <p className="help-note">
            Note: Arrays are not sorted, only object keys within them.
          </p>
        </section>

        {/* Error Handling */}
        <section className="help-section">
          <h2>⚠️ Error Handling</h2>
          <p>
            When your JSON has syntax errors, the formatter provides helpful messages:
          </p>
          <ul>
            <li><strong>Human-readable errors</strong> - Instead of cryptic parser messages, you get clear explanations like &quot;Missing value after key&quot; or &quot;Extra comma before closing brace&quot;</li>
            <li><strong>Location info</strong> - Shows the line and column where the error occurred</li>
            <li><strong>Visual indicator</strong> - Highlights the exact position in your JSON with ▶◀ markers</li>
            <li><strong>Hints</strong> - Suggestions on how to fix common mistakes</li>
          </ul>
        </section>

        {/* Schema Detection */}
        <section className="help-section">
          <h2>📊 Schema Detection</h2>
          <p>
            Click the &quot;Schema&quot; tab in the output panel to see an inferred schema of your JSON data.
          </p>
          <h3>What it shows:</h3>
          <ul>
            <li><strong>Data types</strong> - Each key shows its type (string, number, boolean, object, array, null)</li>
            <li><strong>Nested structure</strong> - Visualizes the hierarchy of your data</li>
            <li><strong>Inconsistent types</strong> - Highlights when the same key has different types in different places (marked with ⚠️)</li>
          </ul>
          <p>
            This is useful for understanding API responses, finding data inconsistencies, or generating documentation.
          </p>
        </section>

        {/* Search */}
        <section className="help-section">
          <h2>🔍 Search</h2>
          <p>
            Use the search box in the output panel header to find keys or values:
          </p>
          <ul>
            <li>Type any text to search (case-insensitive)</li>
            <li>Matches are highlighted in yellow</li>
            <li>Shows total match count</li>
            <li>Searches both keys and values</li>
          </ul>
        </section>

        {/* Copy Options */}
        <section className="help-section">
          <h2>📋 Copy Options</h2>
          <ul>
            <li><strong>📄 Copy</strong> - Copies the formatted JSON with indentation</li>
            <li><strong>⚡ Copy Minified</strong> - Copies compact JSON without whitespace (smaller file size)</li>
          </ul>
        </section>

        {/* Export */}
        <section className="help-section">
          <h2>📤 Export / Convert</h2>
          <p>
            Click the &quot;📤 Export&quot; button to convert your JSON to other formats:
          </p>
          
          <div className="format-table">
            <div className="format-row">
              <span className="format-name">JSON (Formatted)</span>
              <span className="format-desc">Pretty-printed with indentation</span>
            </div>
            <div className="format-row">
              <span className="format-name">JSON (Minified)</span>
              <span className="format-desc">Compact, no whitespace</span>
            </div>
            <div className="format-row">
              <span className="format-name">YAML</span>
              <span className="format-desc">Human-readable config format</span>
            </div>
            <div className="format-row">
              <span className="format-name">XML</span>
              <span className="format-desc">Markup language format</span>
            </div>
            <div className="format-row">
              <span className="format-name">CSV</span>
              <span className="format-desc">Spreadsheet format (for arrays of objects)</span>
            </div>
          </div>

          <p>
            You can preview the output, copy to clipboard, or download as a file.
          </p>
        </section>

        {/* Collapsible Nodes */}
        <section className="help-section">
          <h2>🔽 Collapsible Nodes</h2>
          <p>
            Large JSON can be hard to navigate. The formatter makes it easier:
          </p>
          <ul>
            <li>Click on any object or array to collapse/expand it</li>
            <li>Collapsed nodes show a summary (e.g., &quot;5 keys&quot; or &quot;10 items&quot;)</li>
            <li>Deeply nested content (more than 4 levels) is auto-collapsed</li>
          </ul>
        </section>

        {/* Theme */}
        <section className="help-section">
          <h2>🎨 Theme</h2>
          <p>
            Click the theme toggle button to switch between:
          </p>
          <ul>
            <li><strong>☀️ Light</strong> - Bright theme for daytime use</li>
            <li><strong>🌙 Dark</strong> - Dark theme for reduced eye strain</li>
          </ul>
          <p>Your preference is saved and remembered on your next visit.</p>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="help-section">
          <h2>⌨️ Tips</h2>
          <ul>
            <li>Press <kbd>Enter</kbd> in the URL input to fetch</li>
            <li>Press <kbd>Escape</kbd> to close the URL input or export modal</li>
            <li>The input area accepts drag-and-drop for JSON files</li>
            <li>Long strings are truncated in the output - hover to see full value</li>
          </ul>
        </section>

        {/* Privacy */}
        <section className="help-section">
          <h2>🔒 Privacy</h2>
          <p>
            Your data stays private:
          </p>
          <ul>
            <li>All processing happens in your browser</li>
            <li>No data is sent to any server (except when fetching from URLs you provide)</li>
            <li>Nothing is stored or logged</li>
          </ul>
        </section>
      </div>

      <footer className="help-footer">
        <Link href="/" className="btn btn-primary">
          ← Back to JSON Formatter
        </Link>
      </footer>
    </main>
  );
}
