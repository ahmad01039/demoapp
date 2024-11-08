// import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
// import { tool } from "@langchain/core/tools";
// import { z } from "zod";
// import { StateGraph } from "@langchain/langgraph";
// import { MemorySaver, Annotation, MessagesAnnotation } from "@langchain/langgraph";
// import { ToolNode } from "@langchain/langgraph/prebuilt";
// import { ChatOpenAI } from "@langchain/openai";
// import { NextResponse } from "next/server";

// //if one agent is there 
// // const StateAnnotation = Annotation.Root({
// //   messages: Annotation<BaseMessage[]>({
// //     reducer: (x, y) => x.concat(y),
// //   })
// // });
// //
// //multiple agents 
// const StateAnnotation = Annotation.Root({
//   ...MessagesAnnotation.spec,
//   next: Annotation<"agent1" | "agent2">,
// });



// const weatherTool = tool(async ({ query }) => {
//  console.log("weather tool called ");
//   if (query.toLowerCase().includes("sf") || query.toLowerCase().includes("san francisco")) {
//       return "It's 60 degrees and foggy.";
//     }
//     return "It's 90 degrees and sunny.";
//   }, {
//     name: "weather",
//     description: "Call to get the current weather for a location.",
//     schema: z.object({
//       query: z.string().describe("The query to use in your search."),
//     }),
//   });
// const tools = [weatherTool];
// const toolNode = new ToolNode(tools);
// const model = new ChatOpenAI({
//   model: "gpt-3.5-turbo",
// }).bindTools(tools);
// const model2 = new ChatOpenAI({
//   model: "gpt-3.5-turbo",
// });
// //chatgpt agent
// async function callModel(state: typeof MessagesAnnotation.State) {
//   console.log("Model 1 called ");
//   const response = await model.invoke(state.messages);
  
// console.log("mode 1 response generated",response);
//   return { messages: [response] };
// }
// // const supervisor = async (state: typeof StateAnnotation.State) => {
// //   const response = await model.withStructuredOutput(...).invoke(...);
// //   return { next: response.next_agent };
// // };
// // const agent1 = async (state: typeof StateAnnotation.State) => {
// //   const response = await model.invoke(...);
// //   return { messages: [response] };
// // };

// async function SecondModel(state: typeof MessagesAnnotation.State) {
//  console.log("Model 2 called  with input ",state.messages);


//   const response = await model2.invoke(state.messages);
//   console.log("mode 1 response generated",response);
  
  
//   return { messages: [response] };
  
// }

// function shouldContinue(state: typeof StateAnnotation.State) {
//   const messages = state.messages;
//   const lastMessage = messages[messages.length - 1] as AIMessage;
//   if (lastMessage.tool_calls?.length) {
//     return "tools";
//   }
//   return "__end__";
// }
// const workflow = new StateGraph(StateAnnotation)
//   .addNode("agent1", callModel)
//   .addNode("tools", toolNode)
//   // .addNode("agent2", SecondModel)
//   .addEdge("__start__", "agent1")
//   .addConditionalEdges("agent1", shouldContinue)
//   // .addEdge("agent2","__end__")
//   .addEdge("tools", "agent1")
// const checkpointer = new MemorySaver();
// const appWorkflow = workflow.compile({ checkpointer });
// export async function POST(req: Request) {
//   try {
//     const { query } = await req.json();
//     if (!query || query.trim() === "") {
//       return NextResponse.json({ error: "Query parameter is required." }, { status: 400 });
//     }
//     if (query.toLowerCase().includes("forecast")) {
//       return NextResponse.json({ response: "Forecasts are not available at the moment." });
//     }
//     const finalState = await appWorkflow.invoke(
//       { messages: [new HumanMessage(query)] },
//       { configurable: { thread_id: "42" } },
      
//     );
//     const responseMessage = finalState.messages[finalState.messages.length - 1].content;
//     return NextResponse.json({ response: responseMessage });
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
//   }
// }

// import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
// import { tool } from "@langchain/core/tools";
// import { z } from "zod";
// import { StateGraph } from "@langchain/langgraph";
// import { MemorySaver, Annotation, MessagesAnnotation } from "@langchain/langgraph";
// import { ToolNode } from "@langchain/langgraph/prebuilt";
// import { ChatOpenAI } from "@langchain/openai";
// import { NextResponse } from "next/server";

// // StateAnnotation configuration remains as you’ve set up for multiple agents
// // const StateAnnotation = Annotation.Root({
// //   ...MessagesAnnotation.spec,
// //   next: Annotation<"agent1" | "agent2">,
// // });


// const StateAnnotation = Annotation.Root({
//   messages: Annotation<BaseMessage[]>({
//     reducer: (x, y) => x.concat(y),
//   })
// });
// // Define your weather tool
// const weatherTool = tool(async ({ query }) => {
//  console.log("weather tool called ");
//   if (query.toLowerCase().includes("sf") || query.toLowerCase().includes("san francisco")) {
//       return "It's 60 degrees and foggy.";
//     }
//     return "It's 90 degrees and sunny.";
//   }, {
//     name: "weather",
//     description: "Call to get the current weather for a location.",
//     schema: z.object({
//       query: z.string().describe("The query to use in your search."),
//     }),
//   });

// const tools = [weatherTool];
// const toolNode = new ToolNode(tools);

// const model = new ChatOpenAI({
//   model: "gpt-3.5-turbo",
// }).bindTools(tools);

// const model2 = new ChatOpenAI({
//   model: "gpt-3.5-turbo",
// });

// // ChatGPT Agent Functions
// async function callModel(state: typeof MessagesAnnotation.State) {
//   console.log("Model 1 called ");
//   const response = await model.invoke(state.messages);
//   console.log("mode 1 response generated", response);
//   return { messages: [response] };
// }

// async function SecondModel(state: typeof MessagesAnnotation.State) {
//   console.log("Model 2 called with input ", state.messages);
//   const response = await model2.invoke(state.messages);
//   console.log("Model 2 response generated", response);
//   return { messages: [response] };
// }

// // Decide on the Next Step in Workflow
// function shouldContinue(state: typeof StateAnnotation.State) {
//   const messages = state.messages;
//   const lastMessage = messages[messages.length - 1] as AIMessage;
//   if (lastMessage.tool_calls?.length) {
//     return "tools";
//   }
//   return "__end__";
// }

// // Workflow Configuration
// const workflow = new StateGraph(StateAnnotation)
//   .addNode("agent1", callModel)
//   .addNode("tools", toolNode)
//   // .addNode("agent2", SecondModel)
//   .addEdge("__start__", "agent1")
//   .addConditionalEdges("agent1", shouldContinue)
//   // .addEdge("agent2","__end__")
//   .addEdge("tools", "agent1");


// const checkpointer = new MemorySaver();
// const appWorkflow = workflow.compile({
//   checkpointer,
//   interruptBefore: ["tools"],  // HITL integration point
// });

// // Server Endpoint
// export async function POST(req: Request) {
//   try {
//     const { query } = await req.json();
//     if (!query || query.trim() === "") {
//       return NextResponse.json({ error: "Query parameter is required." }, { status: 400 });
//     }
//     if (query.toLowerCase().includes("forecast")) {
//       return NextResponse.json({ response: "Forecasts are not available at the moment." });
//     }

//     // Invoke the workflow
//     const finalState = await appWorkflow.invoke(
//       { messages: [new HumanMessage(query)] },
//       { configurable: { thread_id: "42" } }
//     );

//     const responseMessage = finalState.messages[finalState.messages.length - 1].content;
//     return NextResponse.json({ response: responseMessage });
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
//   }
// }

import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { StateGraph } from "@langchain/langgraph";
import { MemorySaver, Annotation, MessagesAnnotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";

// StateAnnotation configuration
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  })
});

// Define your weather tool
const weatherTool = tool(async ({ query }) => {
 console.log("weather tool called ");
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

const model2 = new ChatOpenAI({
  model: "gpt-3.5-turbo",
});

// ChatGPT Agent Functions
async function callModel(state: typeof MessagesAnnotation.State) {
  console.log("Model 1 called ");
  const response = await model.invoke(state.messages);
  console.log("mode 1 response generated", response);
  return { messages: [response] };
}

async function SecondModel(state: typeof MessagesAnnotation.State) {
  console.log("Model 2 called with input ", state.messages);
  const response = await model2.invoke(state.messages);
  console.log("Model 2 response generated", response);
  return { messages: [response] };
}

// Check if the state is paused, and if so, resume it
function shouldContinue(state: typeof StateAnnotation.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  // Check if the state is paused
  if (state.isPaused) {
    console.log("State is paused. Resuming...");
    return "resume"; // Resume the state
  }

  // If the state has tool calls, continue to tools, else end
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  return "__end__";
}

// Workflow Configuration
const workflow = new StateGraph(StateAnnotation)
  .addNode("agent1", callModel)
  .addNode("tools", toolNode)
  .addNode("resume", SecondModel)  // Add a node for resuming
  .addEdge("__start__", "agent1")
  .addConditionalEdges("agent1", shouldContinue)
  .addEdge("tools", "agent1")
  .addEdge("resume", "__end__"); // If resuming, end the workflow

const checkpointer = new MemorySaver();
const appWorkflow = workflow.compile({
  checkpointer,
  interruptBefore: ["tools"],  // HITL integration point
});

// Server Endpoint
export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || query.trim() === "") {
      return NextResponse.json({ error: "Query parameter is required." }, { status: 400 });
    }
    if (query.toLowerCase().includes("forecast")) {
      return NextResponse.json({ response: "Forecasts are not available at the moment." });
    }

    // Invoke the workflow
    const finalState = await appWorkflow.invoke(
      { messages: [new HumanMessage(query)] },
      { configurable: { thread_id: "42" } }
    );

    const responseMessage = finalState.messages[finalState.messages.length - 1].content;
    return NextResponse.json({ response: responseMessage });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}
