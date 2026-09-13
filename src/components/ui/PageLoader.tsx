export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-t-white border-r-white/50 border-b-transparent border-l-transparent animate-spin" />
        </div>
        <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
          Loading ZYROX ARENA...
        </span>
      </div>
    </div>
  );
}
