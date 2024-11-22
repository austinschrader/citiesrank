export const NeighborhoodMap = () => (
  <div className="relative h-[500px] rounded-lg overflow-hidden bg-muted mb-8">
    <div className="absolute inset-0 p-6">
      <div className="grid grid-cols-3 gap-4 h-full">
        {["Upper East Side", "Chelsea", "Brooklyn Heights"].map((hood, i) => (
          <div
            key={i}
            className="relative group cursor-pointer bg-black/20 rounded-lg p-4 
                           hover:bg-black/40 transition-all duration-300">
            <h3 className="text-white font-semibold mb-2">{hood}</h3>
            <div className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Click to explore this neighborhood
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
