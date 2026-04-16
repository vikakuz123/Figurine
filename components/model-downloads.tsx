import { Download } from "lucide-react";

const formats = ["stl", "obj", "glb"] as const;

export function ModelDownloads({
  slug,
  name
}: {
  slug: string;
  name: string;
}) {
  return (
    <div className="rounded-[24px] border border-line bg-page/50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-textMuted">Файлы модели</p>
          <h3 className="mt-3 text-xl font-semibold text-text">Скачать в разных форматах</h3>
          <p className="mt-2 text-sm leading-6 text-textMuted">
            Для каждой модели доступны файлы в форматах STL, OBJ и GLB.
          </p>
        </div>
        <div className="rounded-2xl bg-blue-500/10 p-3 text-accentSoft">
          <Download size={18} />
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {formats.map((format) => (
          <a
            key={format}
            href={`/models/${slug}.${format}`}
            download
            className="rounded-2xl border border-line px-4 py-3 text-sm text-text transition hover:border-blue-400/25 hover:bg-blue-500/10"
          >
            {name} .{format}
          </a>
        ))}
      </div>
    </div>
  );
}
