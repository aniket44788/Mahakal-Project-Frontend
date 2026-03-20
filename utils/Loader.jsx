const Loader = ({ visible }) => {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center 
      bg-black/50 backdrop-blur-sm
      transition-all duration-500 ease-in-out
      ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div
        className={`flex flex-col items-center gap-4
        transform transition-all duration-500
        ${visible ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
      >
        {/* Spinner */}
        <div className="w-14 h-14 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-white text-sm tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;