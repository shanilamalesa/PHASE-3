// app/page.js
import Counter from "./components/Counter";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold">Welcome to Mctaba</h1>
      <p className="mt-4 text-gray-600">A shop with good things at fair prices.</p>
      <div className="mt-6">
        <Counter />
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Rendered at {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}