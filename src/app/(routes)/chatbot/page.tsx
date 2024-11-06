"use client";
import React, { useEffect } from "react";
import { useChat } from "ai/react";

export default function Dashboard() {
  const { messages, input, setInput, handleSubmit } = useChat();
  useEffect(() => {
    console.log(messages);
  }, [messages]);
  return (
    <div className="flex flex-col items-center min-h-screen">
      <h1 className="mt-4 mb-4 text-2xl text-center">Datics Ai</h1>

      <div className="flex min-h-screen">
        <div className="h-[85vh] w-[80vw] p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`my-2 p-4 rounded-md ${
                message.role === "user"
                  ? "bg-pink-100 text-pink-800 self-end"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div className="font-semibold">
                {message.role === "user" ? "You" : "AI"}:
              </div>
              <div>{message.content}</div>
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-1/2 flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-full bg-gray-200 placeholder-gray-500 text-gray-900"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-full font-semibold text-white bg-pink-500 hover:bg-pink-600"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
