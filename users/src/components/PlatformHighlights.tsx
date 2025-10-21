import { Smartphone, Building, Layout } from 'lucide-react';

export default function PlatformHighlights() {
  return (
    <section id="platforms" className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4">
            Platform Highlights
          </h2>
        </div>

        <div className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl h-96 flex items-center justify-center shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="text-white text-center">
                  <Smartphone size={80} className="mx-auto mb-4" />
                  <p className="text-3xl font-bold">NepFootsal Player Portal</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              {/* <div className="text-4xl mb-4">🕹️</div> */}
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                NepFootsal Player Portal
              </h3>
              <p className="text-xl text-gray-600 mb-6">
                Your go-to web app for discovering and booking futsal venues.
              </p>

              <ul className="space-y-3 text-gray-700 text-lg">
                <li className="flex items-center gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Real-time availability of pitches</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Instant booking confirmation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Location-based search</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Reviews and ratings</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* <div className="text-4xl mb-4">🧾</div> */}
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                NepFootsal Owner Portal
              </h3>
              <p className="text-xl text-gray-600 mb-6">
                Simplify your futsal operations.
              </p>

              <ul className="space-y-3 text-gray-700 text-lg">
                <li className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Manage pitches and booking slots</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>View daily, weekly, and monthly analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Display QR for easy onsite payments</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Track subscription and renewal dates</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl h-96 flex items-center justify-center shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="text-white text-center">
                  <Building size={80} className="mx-auto mb-4" />
                  <p className="text-3xl font-bold">NepFootsal Owner Portal</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl h-96 flex items-center justify-center shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="text-white text-center">
                  <Layout size={80} className="mx-auto mb-4" />
                  <p className="text-3xl font-bold">NepFootsal Admin Dashboard</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              {/* <div className="text-4xl mb-4">🧠</div> */}
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                NepFootsal Admin Dashboard
              </h3>
              <p className="text-xl text-gray-600 mb-6">
                For platform administrators (you).
              </p>

              <ul className="space-y-3 text-gray-700 text-lg">
                <li className="flex items-center gap-3">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Manage all futsals and users</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Track revenue and active subscriptions</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Analyze booking data by region</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>AI-powered review summarization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
