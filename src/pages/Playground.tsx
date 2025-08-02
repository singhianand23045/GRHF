
import TestComponent from "@/playground/TestComponent";

const Playground = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-gray-100 via-indigo-100 to-blue-50 px-4">
    <h1 className="text-2xl font-extrabold tracking-tight mb-6 text-indigo-800">Playground Area</h1>
    <p className="mb-6 text-gray-600 text-center max-w-xl">
      This page is for quick testing. Feel free to add, swap, or remove components here without risk!
    </p>
    <TestComponent />
  </div>
);

export default Playground;
