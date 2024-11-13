
"use client";
import { useState } from "react";
import { Message } from "../../../components/message";  

interface ApiResponse {
  [key: string]: {
    lc: number;
    type: string;
    id: string[]; 
    kwargs: {
      content: string;
      additional_kwargs?: any;
      response_metadata?: any;
    };
    response?: string | object; 
  };
}

interface MessageData {
  id: string;
  role: "user" | "assistant"; 
  content: string;
  toolInvocations: any[];
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string>(""); 
  const [messages, setMessages] = useState<MessageData[]>([]); 

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data: ApiResponse = await res.json(); 

      const mappedMessages: MessageData[] = Object.values(data).map((messageData) => {
        const role = messageData.id.includes("HumanMessage") ? "user" : "assistant";

        return {
          id: messageData.id.join("."),
          role: role, 
          content: messageData.kwargs.content, 
          toolInvocations: messageData.kwargs.additional_kwargs || [], 
        };
      });

      setMessages(mappedMessages); 

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-pink-800">Datics Bot</h1>
      <div className="flex min-h-screen w-full justify-center">
        <div className="h-[85vh] w-[80vw] p-4 overflow-y-auto space-y-4">
          {messages.map((message,index) => (
            <div key={index}>
              <Message
                chatId={index.toString()}
                role={message.role}
                content={message.content}
                toolInvocations={message.toolInvocations || []}  
              />
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={handleFormSubmit}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-1/2 flex items-center space-x-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-full bg-gray-200 placeholder-gray-500 text-gray-900"
          placeholder="Ask anything"
          required
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
