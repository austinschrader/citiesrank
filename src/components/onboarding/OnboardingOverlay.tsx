import { Activity, MapPin, Users } from "lucide-react";

interface OnboardingOverlayProps {
  onClose: () => void;
}

export const OnboardingOverlay = ({ onClose }: OnboardingOverlayProps) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg mx-4">
        <h2 className="text-2xl font-bold mb-2">Welcome to MapSpace</h2>
        <p className="text-gray-600 mb-6">The living layer of your world</p>

        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">See what's happening</h3>
              <p className="text-sm text-gray-600">
                Real-time updates from places you care about
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Join the conversation</h3>
              <p className="text-sm text-gray-600">
                Share moments and connect with your local community
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium">Discover your city</h3>
              <p className="text-sm text-gray-600">
                Find active spaces and trending places nearby
              </p>
            </div>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700"
          onClick={onClose}
        >
          Start Exploring
        </button>
      </div>
    </div>
  );
};
