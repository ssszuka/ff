export function RouteLoading() {
  return (
    <div className="fixed inset-0 bg-dark-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" />
        <p className="text-dark-300 text-sm">Loading...</p>
      </div>
    </div>
  );
}
