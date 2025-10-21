export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: 'url(https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/70 to-emerald-900/80"></div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold mb-6 drop-shadow-2xl">
          NepFootsal
        </h1>
        <p className="text-3xl sm:text-4xl lg:text-5xl mb-6 font-light drop-shadow-lg">
          Play. Manage. Connect.
        </p>
        <p className="text-xl sm:text-2xl mb-4 font-medium text-green-100">
          All in one place.
        </p>

        <div className="max-w-3xl mx-auto mb-10 text-lg sm:text-xl leading-relaxed text-gray-100 drop-shadow">
          <p className="mb-4">
            {/* Welcome to <span className="font-bold text-white">NepFootsal</span> —  */}
            Nepal's first all-in-one futsal management and booking platform connecting players, futsal owners, and administrators.
          </p>
          {/* <p>
            Discover, book, and manage futsal experiences with ease — whether you're a player looking for a pitch or a venue owner managing bookings.
          </p> */}
        </div>

        <button
          onClick={() => {
            const element = document.getElementById('ecosystem');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-10 py-4 bg-white text-green-700 rounded-full font-bold text-lg hover:bg-green-50 transform hover:scale-110 transition duration-300 shadow-2xl animate-bounce"
        >
          Get Started Today
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-8 h-8 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
