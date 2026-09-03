import { ChevronDown, Download, FileText } from "lucide-react";

type DocumentsDropdownProps = {
  resumeUrl?: string | null;
  cvUrl?: string | null;
  coverLetterUrl?: string | null;
  compact?: boolean;
  align?: "left" | "right";
};

export function DocumentsDropdown({
  resumeUrl,
  cvUrl,
  coverLetterUrl,
  compact = false,
  align = "left",
}: DocumentsDropdownProps) {
  const panelAlignment = align === "right" ? "right-0" : "left-0";

  return (
    <details className="group relative z-30">
      <summary className={`button-secondary cursor-pointer list-none ${compact ? "min-h-10 px-4 py-2 text-sm" : ""}`}>
        <FileText aria-hidden="true" size={18} />
        Documents
        <ChevronDown className="transition group-open:rotate-180" aria-hidden="true" size={16} />
      </summary>
      <div className={`absolute ${panelAlignment} z-30 mt-2 grid w-72 max-w-[calc(100vw-2rem)] gap-2 rounded-md border border-white/10 bg-ink/95 p-2 shadow-soft backdrop-blur`}>
        {resumeUrl ? (
          <>
            <DocumentAction label="View Resume" url={resumeUrl} />
            <DocumentAction label="Download Resume" url={resumeUrl} download />
          </>
        ) : (
          <UnavailableDocument label="Resume not uploaded yet" />
        )}
        {cvUrl ? (
          <>
            <DocumentAction label="View CV" url={cvUrl} />
            <DocumentAction label="Download CV" url={cvUrl} download />
          </>
        ) : null}
        {coverLetterUrl ? (
          <>
            <DocumentAction label="View Cover Letter" url={coverLetterUrl} />
            <DocumentAction label="Download Cover Letter" url={coverLetterUrl} download />
          </>
        ) : (
          <UnavailableDocument label="Cover letter not uploaded yet" />
        )}
      </div>
    </details>
  );
}

function DocumentAction({
  label,
  url,
  download = false,
}: {
  label: string;
  url: string;
  download?: boolean;
}) {
  return (
    <a
      className="flex min-h-10 items-center gap-2 rounded px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10 hover:text-cyan-100"
      href={url}
      target={download ? undefined : "_blank"}
      rel={download ? undefined : "noreferrer"}
      download={download}
    >
      <Download aria-hidden="true" size={16} />
      {label}
    </a>
  );
}

function UnavailableDocument({ label }: { label: string }) {
  return (
    <span className="flex min-h-10 items-center gap-2 rounded px-3 py-2 text-sm text-slate-500">
      <Download aria-hidden="true" size={16} />
      {label}
    </span>
  );
}
