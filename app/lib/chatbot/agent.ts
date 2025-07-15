import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { productRecommendationTool } from "./tools";

export const runAgent = async (input: string) => {
  const model = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const executor = await initializeAgentExecutorWithOptions(
    [productRecommendationTool],
    model,
    { agentType: "openai-functions", verbose: true }
  );

  const result = await executor.call({ input });
  return result.output;
};
