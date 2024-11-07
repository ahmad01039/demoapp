"use client";
import { useState } from "react";
export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponse(data.response || "No response from API.");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">Lang graph demo</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-80">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything"
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Ask
        </button>
      </form>
      
      {response && (
        <div className="mt-8 w-[70vw] bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Response:</h2>
          <p className="text-gray-800">{response}</p>
        </div>
      )}
    </div>
  );
}
