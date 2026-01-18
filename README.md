# JSON Formatter

A powerful, feature-rich web application for formatting, validating, and converting JSON data. Built with Next.js and React, this tool provides an intuitive interface for working with JSON files and data.

## ✨ Features

### Core Functionality
- **JSON Formatting** - Beautify minified or messy JSON with customizable indentation (2, 4, or 8 spaces)
- **JSON Validation** - Real-time validation with helpful error messages and visual indicators
- **Key Sorting** - Alphabetically sort object keys for consistent output
- **Syntax Highlighting** - Color-coded JSON output with proper syntax highlighting

### Input Methods
- **Paste** - Direct paste from clipboard
- **File Upload** - Upload JSON files up to 10MB
- **URL Fetch** - Fetch JSON data from any web URL
- **Sample Data** - Explore features with pre-built sample JSON structures

### Advanced Features
- **Schema Inference** - Automatically detect and visualize JSON schema structure
- **Inconsistency Detection** - Identify paths with mixed data types
- **Search Functionality** - Search through keys and values with highlighting
- **Collapsible Nodes** - Expand/collapse objects and arrays for easier navigation
- **Export & Convert** - Convert JSON to multiple formats:
  - JSON (Formatted)
  - JSON (Minified)
  - YAML
  - XML
  - CSV (for arrays of objects)

### User Experience
- **Dark/Light Theme** - Toggle between themes with preference persistence
- **Error Handling** - Human-readable error messages with:
  - Line and column numbers
  - Visual error indicators (▶◀)
  - Helpful hints for fixing common mistakes
- **Copy Options** - Copy formatted or minified JSON to clipboard
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mansisindhu/json-formatter.git
cd json-formatter
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

### Basic Formatting
1. Paste your JSON into the input area, upload a file, or fetch from a URL
2. The formatted output appears automatically in the output panel
3. Adjust indentation and enable key sorting as needed
4. Copy the formatted JSON or export it in your preferred format

### Error Handling
When JSON has syntax errors:
- The error message explains what's wrong in plain language
- Line and column numbers show exactly where the error occurred
- Visual markers (▶◀) highlight the problematic area
- Hints suggest how to fix common mistakes

### Schema View
Click the "Schema" tab to see:
- The inferred structure of your JSON data
- Data types for each key (string, number, boolean, object, array, null)
- Warnings for paths with inconsistent types
- A visual tree representation of nested structures

### Search
Use the search box in the output panel to:
- Find specific keys or values
- See match counts
- View highlighted results in the formatted JSON

### Export & Convert
Click the "Export" button to:
- Preview the converted output
- Copy to clipboard
- Download as a file in your chosen format

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Linting**: ESLint with Next.js config

## 📁 Project Structure

```
json-formatter/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page
│   │   ├── layout.tsx       # Root layout
│   │   ├── help/
│   │   │   └── page.tsx      # Help/documentation page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── JsonFormatter.tsx # Main formatter component
│   │   ├── JsonOutput.tsx    # JSON rendering with syntax highlighting
│   │   ├── SchemaView.tsx    # Schema visualization
│   │   ├── ExportModal.tsx   # Export/conversion modal
│   │   ├── ThemeToggle.tsx   # Theme switcher
│   │   └── SampleData.ts     # Sample JSON data
│   ├── hooks/
│   │   └── useTheme.ts       # Theme management hook
│   └── utils/
│       ├── jsonUtils.ts      # JSON utilities (sort, search)
│       ├── errorParser.ts   # Error parsing and formatting
│       ├── schemaInference.ts # Schema detection logic
│       └── exportFormats.ts  # Format conversion (YAML, XML, CSV)
├── public/                   # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Key Features Explained

### Error Parser
The error parser transforms cryptic JSON syntax errors into user-friendly messages:
- Detects common issues (trailing commas, missing quotes, etc.)
- Provides context-aware hints
- Shows exact error location with visual markers

### Schema Inference
Automatically analyzes JSON structure to:
- Build a type tree of the entire data structure
- Detect inconsistencies (same key with different types)
- Visualize nested hierarchies

### Export Formats
- **YAML**: Human-readable configuration format
- **XML**: Markup language format with proper escaping
- **CSV**: Spreadsheet format for arrays of objects (with nested key flattening)

## 🔒 Privacy

- All processing happens **client-side** in your browser
- No data is sent to any server (except when fetching from URLs you provide)
- Nothing is stored or logged
- Your JSON data never leaves your device

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚢 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Deploy with zero configuration

The app can also be deployed to any platform that supports Next.js.

## 📄 License

This project is open source and available for use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [JSON Specification](https://www.json.org/)

---

Built with ❤️ using Next.js and React
