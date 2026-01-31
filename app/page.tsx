import { ThumbnailEditor } from '@/components/editor/ThumbnailEditor';
import { KakaoAdFit } from '@/components/ui/KakaoAdFit';

export default function Home() {
  return (
    <div className="h-dvh overflow-hidden bg-zinc-50 dark:bg-black">
      {/* Desktop: Left sidebar ad (160x600) */}
      <div className="fixed left-4 top-1/2 z-20 hidden -translate-y-1/2 xl:block">
        <KakaoAdFit
          unit="DAN-SqUziNjsmYTfdmze"
          width={160}
          height={600}
          className="overflow-hidden shadow-lg"
        />
      </div>

      {/* Main content with left margin for desktop ad */}
      <div className="h-full xl:ml-[176px]">
        <ThumbnailEditor />
      </div>
    </div>
  );
}
