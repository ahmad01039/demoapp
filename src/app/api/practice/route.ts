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
import { stat } from "fs";

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
    return { temperature: "60 degrees", condition: "Sunny" };

    }
   

    return { temperature: "10 degrees", condition: "foggy" };

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
console.log("state when call ing mode",state.messages)
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
.addEdge("tools", "__end__");

const checkpointer = new MemorySaver();
const appWorkflow = workflow.compile({
  checkpointer,
});
async function processStream(reader: ReadableStreamDefaultReader<any>, update:boolean) {
  let chunk;
  let responseContent = [];
  const config = {
    configurable: { thread_id: "42" },
    streamMode: "values" as const,
  };

  while (!(chunk = await reader.read()).done) {
    try {
      const chunkData = typeof chunk.value === 'string' ? JSON.parse(chunk.value) : chunk.value;
     responseContent = chunkData.messages;
} catch (error) {
      console.error("Error parsing chunk:", error);
    }
  }

  return responseContent;
}
export async function POST(req: Request) {
  try {
    const { query } = await req.json();

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