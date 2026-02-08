export default function Loading() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-12 h-12 mx-auto mb-6">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
        </div>
        <p className="text-sm text-neutral-400 tracking-widest uppercase">Loading</p>
      </div>
    </div>
  );
}
