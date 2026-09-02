type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  summary?: string;
};

export function SectionHeading({ eyebrow, title, summary }: SectionHeadingProps) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="font-mono text-sm uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">{title}</h2>
      {summary ? <p className="mt-4 text-base leading-8 text-slate-300">{summary}</p> : null}
    </div>
  );
}
