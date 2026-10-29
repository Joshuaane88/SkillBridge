import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const GITHUB_URL = import.meta.env.VITE_GITHUB_URL as string | undefined;

export function SiteHeader() {
  return (
    <header className="no-print border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" aria-label="skillbridge home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/privacy" className="text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            Privacy
          </Link>
          <Link
            to="/analyze"
            className="rounded-sm border border-foreground px-3.5 py-1.5 font-medium transition-colors hover:bg-foreground hover:text-background"
          >
            Analyze
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>skillbridge — open source under the MIT license.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-foreground">
            Privacy & security
          </Link>
          {GITHUB_URL ? (
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              Source on GitHub
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
