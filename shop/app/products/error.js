"use client";

export default function Error({ error, reset }) {
  return (
    <div className="p-16 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-4 text-gray-600">
        We could not load this page. Please try again in a moment.
      </p>
      <button
        onClick={() => reset()}//reset function -> an inbult function
        className="mt-6 bg-brand text-white px-6 py-3 rounded"
      >
        Try again
      </button>
    </div>
  );
}
