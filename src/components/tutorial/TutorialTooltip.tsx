interface TutorialTooltipProps {
  onClose: () => void;
}

export const TutorialTooltip = ({ onClose }: TutorialTooltipProps) => (
  <div className="absolute bottom-6 right-6">
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs">
      <h4 className="font-medium mb-2">Pro tip: Map + Space = Magic</h4>
      <p className="text-sm text-gray-600 mb-3">
        Use split view to see both the map and space feed at once. Perfect for
        exploring what's happening nearby.
      </p>
      <button onClick={onClose} className="text-sm text-blue-600 font-medium">
        Got it
      </button>
    </div>
  </div>
);
