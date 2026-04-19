export function SectionTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm uppercase tracking-[0.35em] text-accentSoft">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold text-text md:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-textMuted">{description}</p>
    </div>
  );
}
