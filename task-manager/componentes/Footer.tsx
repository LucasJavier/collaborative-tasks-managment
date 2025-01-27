"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-800 p-4 flex flex-col items-center justify-center text-white">
      <p className="text-sm">© 2025 TaskManager</p>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-center text-sm">
        <span>Lucas Bonacci ///</span>
        <span>Crombie</span>
      </div>
    </footer>
  );
}