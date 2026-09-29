import { ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <main className="not-found-page">
      <p className="eyebrow">404 / Lost in transit</p>
      <h1>This page has no route.</h1>
      <p>The portfolio page you requested does not exist or may have moved.</p>
      <a className="text-action" href="/">
        <ArrowLeft aria-hidden="true" size={17} />
        Back to Charity&apos;s work
      </a>
    </main>
  );
}
