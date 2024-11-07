import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { StateGraph } from "@langchain/langgraph";
import { MemorySaver, Annotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  })
});
const weatherTool = tool(async ({ query }) => {


    console.log("tool invoked");
    if (query.toLowerCase().includes("sf") || query.toLowerCase().includes("san francisco")) {
      return "It's 60 degrees and foggy.";
    }
    return "It's 90 degrees and sunny.";
  }, {
    name: "weather",
    description: "Call to get the current weather for a location.",
    schema: z.object({
      query: z.string().describe("The query to use in your search."),
    }),
  });
  

const tools = [weatherTool];
const toolNode = new ToolNode(tools);

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
}).bindTools(tools);

async function callModel(state: typeof StateAnnotation.State) {
  try {
    console.log("Model invoked");
    const messages = state.messages
      .map((message) => {
        if (message instanceof HumanMessage || message instanceof AIMessage) {
          const content = message.content;
          if (typeof content === 'string' && content.trim().length > 0) {
            return {
              role: message instanceof HumanMessage ? 'user' : 'assistant',
              content: content.trim(),
            };
          }
          return null; 
        }
        return null; 
      })
      .filter((message) => message !== null); 

    if (messages.length === 0) {
      throw new Error("No valid messages to process.");
    }

    const result = await model.invoke(messages);

    // console.log("Response from OpenAI:", result);
    return { messages: [new AIMessage(result)] };

  } catch (err) {
    console.error("Error in callModel:", err);
    throw new Error("Failed to process the model request");
  }
}

// function shouldContinue(state: typeof StateAnnotation.State) {
//   const messages = state.messages;
//   const lastMessage = messages[messages.length - 1] as AIMessage;

//   if (lastMessage.tool_calls?.length) {
//     return "tools";
//   }
//   return "__end__";
// }
function shouldContinue(state: typeof StateAnnotation.State) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;

  console.log("should continue invoked");
    // Safely check if content exists and is a string before using toLowerCase
    const content = lastMessage.content;
    
    // Check if the model response already has weather-related content
    if (content && typeof content === "string" && content.toLowerCase().includes("weather")) {
        console.log("return tool");

      
 
      if (lastMessage.tool_calls?.length&&lastMessage.tool_calls?.length > 0) {
        console.log("Tool already invoked, moving to end.");  // Debugging line
        return "__end__";  // Stop the recursion
      }
      
      return "tools";  
    }
  
    // If no tool calls detected or completed, end the process
    if (!lastMessage.tool_calls?.length) {
      console.log("No tool calls detected, stopping process.");  // Debugging line
      return "__end__";
    }
  

    return "tools";
  }
  
  
  


const workflow = new StateGraph(StateAnnotation) 
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent")


const checkpointer = new MemorySaver();
const appWorkflow = workflow.compile({ checkpointer });

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
console.log("text came ",query);
    if (!query || query.trim() === "") {
      return NextResponse.json({ error: "Query parameter is required." }, { status: 400 });
    }

    if (query.toLowerCase().includes("forecast")) {
      return NextResponse.json({ response: "Forecasts are not available at the moment." });
    }

    const finalState = await appWorkflow.invoke(
      { messages: [new HumanMessage(query)] },
      { configurable: { thread_id: "42" } },
      
    );

    const responseMessage = finalState.messages[finalState.messages.length - 1].content;
    return NextResponse.json({ response: responseMessage });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}