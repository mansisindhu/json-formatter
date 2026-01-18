export interface ParsedError {
  message: string;
  hint: string;
  position?: number;
  line?: number;
  column?: number;
}

interface ErrorPattern {
  pattern: RegExp;
  getMessage: (match: RegExpMatchArray, input: string, position?: number) => string;
  getHint: (match: RegExpMatchArray, input: string, position?: number) => string;
}

const errorPatterns: ErrorPattern[] = [
  // Trailing comma before closing brace/bracket
  {
    pattern: /Unexpected token (\}|\]) .* position (\d+)/i,
    getMessage: (match) => {
      const bracket = match[1] === "}" ? "brace" : "bracket";
      return `Extra comma before closing ${bracket}`;
    },
    getHint: () => "Remove the trailing comma before the closing brace or bracket.",
  },
  // Missing value after colon
  {
    pattern: /Unexpected token (\}|,) .* position (\d+)/i,
    getMessage: (match, input, position) => {
      if (position !== undefined) {
        // Look backwards for a key
        const before = input.substring(Math.max(0, position - 50), position);
        const keyMatch = before.match(/"([^"]+)"\s*:\s*$/);
        if (keyMatch) {
          return `Missing value after key "${keyMatch[1]}"`;
        }
      }
      return "Missing value after key";
    },
    getHint: () => "Add a value after the colon. Every key must have a value.",
  },
  // Missing comma between elements
  {
    pattern: /Unexpected token .* position (\d+)/i,
    getMessage: (match, input, position) => {
      if (position !== undefined) {
        const before = input.substring(Math.max(0, position - 20), position);
        const after = input.substring(position, position + 20);
        
        // Check if it looks like missing comma between values
        if (/["}\]0-9]\s*$/.test(before) && /^\s*["{\[]/.test(after)) {
          return "Missing comma between elements";
        }
        
        // Check for unterminated string
        if (before.match(/"[^"]*$/)) {
          return "Unterminated string";
        }
      }
      return "Unexpected character found";
    },
    getHint: (match, input, position) => {
      if (position !== undefined) {
        const before = input.substring(Math.max(0, position - 20), position);
        if (before.match(/"[^"]*$/)) {
          return "Make sure all strings are properly closed with a double quote.";
        }
      }
      return "Check for missing commas, quotes, or brackets near this position.";
    },
  },
  // Unterminated string
  {
    pattern: /Unterminated string/i,
    getMessage: () => "Unterminated string",
    getHint: () => "Make sure all strings are properly closed with a double quote.",
  },
  // Unexpected end of input
  {
    pattern: /Unexpected end of (JSON input|input)/i,
    getMessage: () => "Unexpected end of input",
    getHint: () => "The JSON is incomplete. Check for missing closing brackets, braces, or quotes.",
  },
  // Invalid property name
  {
    pattern: /Expected property name/i,
    getMessage: () => "Expected a property name",
    getHint: () => "Object keys must be strings in double quotes, like \"name\".",
  },
  // Single quotes instead of double quotes
  {
    pattern: /Unexpected token '/i,
    getMessage: () => "Single quotes are not valid in JSON",
    getHint: () => "JSON requires double quotes for strings. Replace ' with \".",
  },
];

function extractPosition(input: string, errorMessage: string): number | undefined {
  const posMatch = errorMessage.match(/position\s+(\d+)/i);
  if (posMatch) {
    return parseInt(posMatch[1], 10);
  }
  return undefined;
}

function calculateLineAndColumn(
  input: string,
  position: number
): { line: number; column: number } {
  const lines = input.substring(0, position).split("\n");
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

function analyzeContext(input: string, position: number): { before: string; after: string; char: string } {
  const start = Math.max(0, position - 30);
  const end = Math.min(input.length, position + 30);
  return {
    before: input.substring(start, position),
    after: input.substring(position, end),
    char: input[position] || "",
  };
}

export function parseJsonError(input: string, error: SyntaxError): ParsedError {
  const errorMessage = error.message;
  const position = extractPosition(input, errorMessage);
  
  let line: number | undefined;
  let column: number | undefined;
  
  if (position !== undefined) {
    const loc = calculateLineAndColumn(input, position);
    line = loc.line;
    column = loc.column;
  }

  // Try to match against known patterns
  for (const { pattern, getMessage, getHint } of errorPatterns) {
    const match = errorMessage.match(pattern);
    if (match) {
      // Additional context-aware analysis
      let message = getMessage(match, input, position);
      let hint = getHint(match, input, position);
      
      // Special case: detect trailing comma more accurately
      if (position !== undefined) {
        const context = analyzeContext(input, position);
        
        // Check for trailing comma
        if (/,\s*$/.test(context.before) && /^[\}\]]/.test(context.char)) {
          message = `Extra comma before closing ${context.char === "}" ? "brace" : "bracket"}`;
          hint = "Remove the trailing comma. JSON doesn't allow trailing commas.";
        }
        
        // Check for missing colon
        if (/"[^"]+"\s*$/.test(context.before) && !/^\s*:/.test(context.char + context.after)) {
          const keyMatch = context.before.match(/"([^"]+)"\s*$/);
          if (keyMatch) {
            message = `Missing colon after key "${keyMatch[1]}"`;
            hint = "Add a colon (:) between the key and value.";
          }
        }
        
        // Check for unquoted key
        if (/{\s*$/.test(context.before) || /,\s*$/.test(context.before)) {
          if (/^[a-zA-Z_]/.test(context.char)) {
            message = "Unquoted property name";
            hint = "Object keys must be wrapped in double quotes, like \"key\".";
          }
        }
      }
      
      return { message, hint, position, line, column };
    }
  }

  // Default fallback
  return {
    message: "Invalid JSON syntax",
    hint: "Check for missing commas, quotes, colons, or brackets.",
    position,
    line,
    column,
  };
}

export function getErrorSnippet(input: string, position: number): string {
  const start = Math.max(0, position - 30);
  const end = Math.min(input.length, position + 30);
  const before = input.substring(start, position);
  const after = input.substring(position, end);
  const char = input[position] || "";

  const prefix = start > 0 ? "..." : "";
  const suffix = end < input.length ? "..." : "";

  return `${prefix}${before}▶${char}◀${after}${suffix}`;
}
