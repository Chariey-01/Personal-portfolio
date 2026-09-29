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
  const panelAlignment = align === "right" ? "documents-panel-right" : "";

  return (
    <details className={`documents-menu ${compact ? "documents-menu-compact" : ""}`}>
      <summary>
        <FileText aria-hidden="true" size={18} />
        Documents
        <ChevronDown className="transition group-open:rotate-180" aria-hidden="true" size={16} />
      </summary>
      <div className={`documents-panel ${panelAlignment}`}>
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
      className="document-action"
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
    <span className="document-unavailable">
      <Download aria-hidden="true" size={16} />
      {label}
    </span>
  );
}
