import { ThumbnailEditor } from '@/components/editor/ThumbnailEditor';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-[768px] px-4 py-8">
        <ThumbnailEditor />
      </main>
    </div>
  );
}
