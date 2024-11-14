import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  RemoveMessage,
} from "@langchain/core/messages";
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
    return {
      flights: [
        {
          id: "result_1",
          departure: {
            cityName: "San Francisco",
            airportCode: "SFO",
            timestamp: "2024-05-19T18:00:00Z",
          },
          arrival: {
            cityName: "Rome",
            airportCode: "FCO",
            timestamp: "2024-05-20T14:30:00Z",
          },
          airlines: ["United Airlines", "Lufthansa"],
          priceInUSD: 1200.5,
          numberOfStops: 1,
        },
        {
          id: "result_2",
          departure: {
            cityName: "San Francisco",
            airportCode: "SFO",
            timestamp: "2024-05-19T17:30:00Z",
          },
          arrival: {
            cityName: "Rome",
            airportCode: "FCO",
            timestamp: "2024-05-20T15:00:00Z",
          },
          airlines: ["British Airways"],
          priceInUSD: 1350,
          numberOfStops: 0,
        },
      ],
    };
  },
  {
    name: "weather",
    description: "Call to get the flight information.",
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
  console.log("state when call ing mode", state.messages);
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
async function processStream(
  reader: ReadableStreamDefaultReader<any>,
  update: boolean
) {
  let chunk;
  let responseContent = [];
  const config = {
    configurable: { thread_id: "42" },
    streamMode: "values" as const,
  };

  while (!(chunk = await reader.read()).done) {
    try {
      const chunkData =
        typeof chunk.value === "string" ? JSON.parse(chunk.value) : chunk.value;
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
      const responseContent = await processStream(reader, false);
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
