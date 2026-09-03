type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  summary?: string;
};

export function SectionHeading({ eyebrow, title, summary }: SectionHeadingProps) {
  return (
    <div className="section-heading mb-10 max-w-3xl">
      <p className="section-eyebrow inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">{title}</h2>
      {summary ? <p className="mt-4 text-base leading-8 text-slate-300">{summary}</p> : null}
    </div>
  );
}
