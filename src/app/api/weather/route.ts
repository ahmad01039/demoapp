// import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
// import { tool } from "@langchain/core/tools";
// import { z } from "zod";
// import { StateGraph } from "@langchain/langgraph";
// import {
//   MemorySaver,
//   Annotation,
//   MessagesAnnotation,
// } from "@langchain/langgraph";
// import { ToolNode } from "@langchain/langgraph/prebuilt";
// import { ChatOpenAI } from "@langchain/openai";
// import { NextResponse } from "next/server";

// //if one agent is there
// const StateAnnotation = Annotation.Root({
//   messages: Annotation<BaseMessage[]>({
//     reducer: (x, y) => x.concat(y),
//   }),
// });
// //
// //multiple agents
// // const StateAnnotation = Annotation.Root({
// //   ...MessagesAnnotation.spec,
// //   next: Annotation<"agent1" | "agent2">,
// // });

// const weatherTool = tool(
//   async ({ query }) => {
//     console.log("weather tool called ");
//     if (
//       query.toLowerCase().includes("sf") ||
//       query.toLowerCase().includes("san francisco")
//     ) {
//       return "It's 60 degrees and foggy.";
//     }
//     return "It's 90 degrees and sunny.";
//   },
//   {
//     name: "weather",
//     description: "Call to get the current weather for a location.",
//     schema: z.object({
//       query: z.string().describe("The query to use in your search."),
//     }),
//   }
// );
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

//   console.log("mode 1 response generated", response);
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
//   console.log("Model 2 called  with input ", state.messages);

//   const response = await model2.invoke(state.messages);
//   console.log("mode 1 response generated", response);

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
//   .addEdge("tools", "agent1");
// const checkpointer = new MemorySaver();
// const appWorkflow = workflow.compile({
//   checkpointer,
//   interruptBefore: ["tools"],
// });
// export async function POST(req: Request) {
//   try {
//     const { query } = await req.json();
//     if (!query || query.trim() === "") {
//       return NextResponse.json(
//         { error: "Query parameter is required." },
//         { status: 400 }
//       );
//     }
//     if (query.toLowerCase().includes("forecast")) {
//       return NextResponse.json({
//         response: "Forecasts are not available at the moment.",
//       });
//     }
//     const finalState = await appWorkflow.invoke(
//       { messages: [new HumanMessage(query)] },
//       { configurable: { thread_id: "42" } }
//     );
//     const responseMessage =
//       finalState.messages[finalState.messages.length - 1].content;
//     return NextResponse.json({ response: responseMessage });
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json(
//       { error: "An error occurred while processing your request." },
//       { status: 500 }
//     );
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

//new code for  human in the loop chunk 
import { AIMessage, BaseMessage, HumanMessage,RemoveMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";

import { z } from "zod";
import { StateGraph } from "@langchain/langgraph";
import {
  MemorySaver,
  Annotation,
  MessagesAnnotation,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

const weatherTool = tool(
  async ({ query }) => {
    console.log("weather tool called ");
    if (
      query.toLowerCase().includes("sf") ||
      query.toLowerCase().includes("san francisco")
    ) {
      return "It's 60 degrees and foggy.";
    }
   
     return "It's 90 degrees and sunny.";
  },
  {
    name: "weather",
    description: "Call to get the current weather for a location.",
    schema: z.object({
      query: z.string().describe("The query to use in your search."),
    }),
  }
);


const tools = [weatherTool];
const toolNode = new ToolNode(tools);

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
}).bindTools(tools);

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  console.log("Model 1 response generated", response);
  return { messages: [response] };
}

function shouldContinue(state: typeof StateAnnotation.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }

  return "__end__";
}

const workflow = new StateGraph(StateAnnotation)
  .addNode("agent1", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent1")
  .addConditionalEdges("agent1", shouldContinue)
.addEdge("tools", "agent1");

const checkpointer = new MemorySaver();
const appWorkflow = workflow.compile({
  checkpointer,
  interruptBefore: ["tools"],
});
async function processStream(reader: ReadableStreamDefaultReader<any>, update:boolean) {
  let chunk;
  let responseContent = {};
  const config = {
    configurable: { thread_id: "42" },
    streamMode: "values" as const,
  };

  while (!(chunk = await reader.read()).done) {
    try {
      const chunkData = typeof chunk.value === 'string' ? JSON.parse(chunk.value) : chunk.value;
      const messagesArray = chunkData.messages;

      if (messagesArray && messagesArray.length > 0) {
        const lastMessage = messagesArray[messagesArray.length - 1];
       console.log("args coming to me is this ");
        console.log( lastMessage.tool_calls);
//  if(update && lastMessage.tool_calls && lastMessage.tool_calls.length > 0){
 

// }

// if(update && lastMessage.tool_calls && lastMessage.tool_calls.length > 0){
// console.log("upadting the state now ....... ");
//   lastMessage.tool_calls[0].args = { query: "San Francisco" }
//   await appWorkflow.updateState(config, { messages: lastMessage });

//   // const event=
//   //  if (event instanceof ReadableStream) {
// //  const reader = event.getReader();
// // return await processStream(reader,false);


// // }
//  return NextResponse.json(responseContent);
//   // return NextResponse.json({messages:"solved"});


// }

        if (lastMessage.content !== undefined) {
          responseContent = lastMessage.content.trim() === "" ? {} : { response: lastMessage.content };
        } else {
          console.log("Last message is not an AIMessage or has no content.");
        }
      } else {
        console.log("No messages array found in this chunk:", chunkData);
      }
    } catch (error) {
      console.error("Error parsing chunk:", error);
    }
  }

  return responseContent;
}



export async function POST(req: Request) {
  try {
    const { query, resume } = await req.json();

    if (!query || query.trim() === "") {
      return NextResponse.json(
        { error: "Query parameter is required." },
        { status: 400 }
      );
    }

    const config = {
      configurable: { thread_id: "42" },
      streamMode: "values" as const,
    };

    const pausedState = await appWorkflow.getState(config);
    console.log("paused state coming to me is this ");
    console.log(pausedState);

    const bool = pausedState?.next?.length > 0 ? 1 : 0;



    if (bool && (query.includes("yes") || query.includes("true")) ) {
      console.log("tool call found successufllfllfllflfl")
      const events = await appWorkflow.stream(null, { ...config, streamMode: "values" });
    

      if (events instanceof ReadableStream) {
        const reader = events.getReader();
        const responseContent = await processStream(reader,true);
        
        
        
        return NextResponse.json(responseContent);
        
      }
    }
    else if(bool){
      console.log("tool call found but lets remove it ")
      const messages = pausedState?.values?.messages;
      if (messages && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        await appWorkflow.updateState(config, {
          messages: new RemoveMessage({ id: lastMessage.id })
        });
        console.log("Last message removed successfully:", lastMessage.id);
        const events = await appWorkflow.stream(null, { ...config, streamMode: "values" });
 
        if (events instanceof ReadableStream) {
          const reader = events.getReader();
          const responseContent = await processStream(reader,true);
          
          
          
          return NextResponse.json(responseContent);
          
        }


      }

      // await appWorkflow.updateState(config, { messages: new RemoveMessage({ id: messages[0].id }) }) 
    }
    

    const finalState = await appWorkflow.stream(
      { messages: [new HumanMessage(query)] },
      config
    );

    if (finalState instanceof ReadableStream) {
      const reader = finalState.getReader();
      const responseContent = await processStream(reader,false);
      return NextResponse.json(responseContent);
    }

    return NextResponse.json({ response: "hey" });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}


