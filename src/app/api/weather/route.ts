import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { StateGraph } from "@langchain/langgraph";
import { MemorySaver, Annotation, MessagesAnnotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  })
});
const weatherTool = tool(async ({ query }) => {


    // console.log("tool invoked");
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

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}
function shouldContinue(state: typeof StateAnnotation.State) {
  console.log("should conitnue invoked");
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  return "__end__";
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