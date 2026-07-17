import { useBoolean, useDropZone, useWebWorker } from '@siberiacancode/reactuse';
import { Loader2Icon, PackageIcon, UploadIcon, XIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const WORKER_URL = `data:text/javascript;charset=utf-8,${encodeURIComponent(`
const GROUPS = [
  ['dependencies', 'dependencies'],
  ['devDependencies', 'dev'],
  ['peerDependencies', 'peer']
];

const clean = (range) => range.replace(/^[\\^~>=<\\s]+/, '').split(' ')[0];

self.addEventListener('message', async (event) => {
  const manifest = JSON.parse(event.data);

  const meta = {
    name: manifest.name ?? 'unknown',
    version: manifest.version ?? null,
    description: manifest.description ?? null,
    license: manifest.license ?? null,
    type: manifest.type ?? null,
    private: !!manifest.private,
    node: manifest.engines?.node ?? null,
    scripts: Object.keys(manifest.scripts ?? {}).length
  };

  const entries = [];
  for (const [field, group] of GROUPS) {
    for (const [name, range] of Object.entries(manifest[field] ?? {})) {
      entries.push({ name, range, group, latest: null, outdated: false });
    }
  }

  self.postMessage({ done: false, entries, meta, total: entries.length });

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];

    try {
      const response = await fetch('https://registry.npmjs.org/' + entry.name + '/latest');
      const data = await response.json();
      entry.latest = data.version ?? null;
      entry.outdated = !!entry.latest && clean(entry.range) !== entry.latest;
    } catch {
      entry.latest = null;
    }

    self.postMessage({ done: false, entries, meta, total: entries.length });
  }

  self.postMessage({ done: true, entries, meta, total: entries.length });
});
`)}`;

interface Entry {
  group: string;
  latest: string | null;
  name: string;
  outdated: boolean;
  range: string;
}

interface Meta {
  description: string | null;
  license: string | null;
  name: string;
  node: string | null;
  private: boolean;
  scripts: number;
  type: string | null;
  version: string | null;
}

interface ManifestReport {
  done: boolean;
  entries: Entry[];
  meta: Meta;
  total: number;
}

const GROUP_LABELS: Record<string, string> = {
  dependencies: 'Dependencies',
  dev: 'Dev dependencies',
  peer: 'Peer dependencies'
};

const Demo = () => {
  const [analyzing, toggleAnalyzing] = useBoolean();

  const worker = useWebWorker<ManifestReport>(WORKER_URL, {
    name: 'manifest-analyzer',
    onMessage: (data) => {
      if (data.done) toggleAnalyzing(false);
    },
    onError: () => toggleAnalyzing(false)
  });

  const analyze = async (file?: File | null) => {
    if (!file) return;
    toggleAnalyzing(true);
    worker.post(await file.text());
  };

  const dropZone = useDropZone<HTMLLabelElement>({
    dataTypes: ['application/json'],
    onDrop: (files) => analyze(files?.[0])
  });

  const onReset = () => {
    toggleAnalyzing(false);
    worker.restart();
  };

  const report = worker.data;
  const meta = report?.meta;

  const groups = Object.entries(GROUP_LABELS)
    .map(([group, label]) => ({
      label,
      entries: report?.entries.filter((entry) => entry.group === group) ?? []
    }))
    .filter((group) => group.entries.length);

  const badges = [
    meta?.private && 'private',
    meta?.type,
    meta?.license,
    meta?.node && `node ${meta.node}`,
    meta?.scripts ? `${meta.scripts} scripts` : null
  ].filter(Boolean);

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='bg-card flex flex-col gap-5 rounded-2xl p-6 shadow-sm'>
        {!report && (
          <>
            <div className='flex flex-col gap-1'>
              <span className='text-muted-foreground text-[10px] tracking-[0.15em] uppercase'>
                Analyzer
              </span>
              <h3 className='text-foreground text-base font-bold'>Inspect package.json</h3>
              <p className='text-muted-foreground text-xs leading-relaxed'>
                Drop your manifest to check dependencies against the npm registry. Everything runs
                in a worker, so the page never freezes.
              </p>
            </div>

            <label
              ref={dropZone.ref}
              className={cn(
                'flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-8 transition-colors',
                dropZone.overed
                  ? 'border-foreground bg-muted/50'
                  : 'border-border hover:bg-muted/30'
              )}
            >
              <input
                accept='.json,application/json'
                className='sr-only'
                type='file'
                onChange={(event) => analyze(event.target.files?.[0])}
              />
              <UploadIcon className='text-muted-foreground size-5' />
              <span className='text-foreground text-xs font-medium'>
                {dropZone.overed ? 'Drop to analyze' : 'Drop package.json or click to browse'}
              </span>
            </label>
          </>
        )}

        {report && meta && (
          <>
            <div className='flex flex-col gap-3'>
              <div className='flex items-start gap-2'>
                <PackageIcon className='text-muted-foreground mt-0.5 size-4 shrink-0' />
                <div className='flex items-baseline gap-2'>
                  <span className='text-foreground truncate text-sm font-bold'>{meta.name}</span>
                  {meta.version && (
                    <span className='text-muted-foreground shrink-0 font-mono text-[10px] tabular-nums'>
                      v{meta.version}
                    </span>
                  )}
                </div>
                <button
                  aria-label='Analyze another file'
                  className='ml-auto shrink-0'
                  data-size='icon'
                  data-variant='ghost'
                  type='button'
                  onClick={onReset}
                >
                  <XIcon className='size-4' />
                </button>
              </div>

              {meta.description && (
                <p className='text-muted-foreground text-[11px] leading-relaxed'>
                  {meta.description}
                </p>
              )}

              {!!badges.length && (
                <div className='flex flex-wrap gap-1.5'>
                  {badges.map((badge) => (
                    <span
                      key={badge as string}
                      className='bg-muted text-muted-foreground rounded-full px-2 py-0.5 font-mono text-[10px]'
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className='border-border flex flex-col gap-4 border-t pt-4'>
              {analyzing && (
                <span className='text-muted-foreground flex items-center gap-1.5 text-[11px]'>
                  <Loader2Icon className='size-3 animate-spin' />
                  Checking npm registry…
                </span>
              )}

              {groups.map((group) => (
                <div key={group.label} className='flex flex-col gap-2'>
                  <span className='text-muted-foreground text-[10px] tracking-[0.15em] uppercase'>
                    {group.label} ({group.entries.length})
                  </span>

                  {group.entries.map((entry) => (
                    <div key={entry.name} className='flex items-baseline gap-2'>
                      <span className='text-foreground truncate font-mono text-xs'>
                        {entry.name}
                      </span>
                      <span className='ml-auto shrink-0 font-mono text-xs tabular-nums'>
                        <span
                          className={cn(
                            entry.outdated ? 'text-amber-500' : 'text-muted-foreground'
                          )}
                        >
                          {entry.range}
                        </span>
                        {entry.outdated && (
                          <span className='text-muted-foreground'> → {entry.latest}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {!!worker.error && (
          <p className='text-destructive text-xs'>Failed to parse: {worker.error.type}</p>
        )}
      </div>
    </section>
  );
};

export default Demo;
