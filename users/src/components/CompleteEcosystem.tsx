export default function CompleteEcosystem() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl sm:text-6xl font-extrabold mb-6">
            Complete Futsal Ecosystem
          </h2>
          <p className="text-2xl text-green-100 max-w-3xl mx-auto">
            Everything you need to play, manage, and grow your futsal presence in Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl hover:bg-white/20 transition duration-300">
            <h3 className="text-2xl font-bold mb-4 border-b border-white/30 pb-3">For Players</h3>
            <ul className="space-y-2 text-green-50">
              <li>✓ Find and book futsal venues</li>
              <li>✓ Connect with other players</li>
              <li>✓ Review and rate futsals</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl hover:bg-white/20 transition duration-300">
            <h3 className="text-2xl font-bold mb-4 border-b border-white/30 pb-3">For Owners</h3>
            <ul className="space-y-2 text-green-50">
              <li>✓ Manage bookings and pitches</li>
              <li>✓ View booking analytics</li>
              <li>✓ Handle payments via QR</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl hover:bg-white/20 transition duration-300">
            <h3 className="text-2xl font-bold mb-4 border-b border-white/30 pb-3">For Admins</h3>
            <ul className="space-y-2 text-green-50">
              <li>✓ Oversee platform operations</li>
              <li>✓ Approve futsal registrations</li>
              <li>✓ Track revenue & reports</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold mb-6">Join the NepFootsal Community</h3>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Thousands of futsal players and owners across Nepal are connecting through NepFootsal — your trusted hub for all things futsal.
          </p>
          <button className="px-12 py-4 bg-white text-green-700 rounded-full font-bold text-xl hover:bg-green-50 transform hover:scale-110 transition duration-300 shadow-2xl">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
}
