import Link from "next/link";
import JsonFormatter from "@/components/JsonFormatter";

export default function Home() {
  return (
    <main className="app-container">
      <header className="app-header">
        <h1>JSON Formatter</h1>
        <p>Paste raw or minified JSON to format it into a clean, readable structure</p>
        <Link href="/help" className="help-link">
          ❓ How it works
        </Link>
      </header>
      <JsonFormatter />
    </main>
  );
}
