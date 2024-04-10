import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from '@langchain/core/prompts';

const randColor = () => '#'+(Math.random()*0xFFFFFF<<0).toString(16);

const example = {
    tree: () => `<svg width="250" height="250" xmlns="http://www.w3.org/2000/svg">
    <desc>A side view of a tree with brown trunk, green leaves, and blue sky background.</desc>
      <rect x="0" y="0" width="150" height="150" fill="${randColor()}" /> <!--background-->
      <rect x="70" y="110" width="10" height="40" fill="#8B4513" /> <!--trunk-->
      <circle cx="75" cy="90" r="40" fill="#228B22" /> <!--leaves-->
      <circle cx="75" cy="70" r="30" fill="#228B22" />
      <circle cx="75" cy="50" r="20" fill="#228B22" />
      <circle cx="75" cy="30" r="10" fill="#228B22" />
      <rect x="0" y="0" width="150" height="20" fill="#87CEEB" /> <!--sky-->
  </svg>`
};

const ask = async ({key, topic, template=''}:{key:string, topic:string, template?:string}) => {
    if (process.env.NEXT_PUBLIC_MOCK_AI) {
        await new Promise((r) => setTimeout(r, 500));
        return example.tree();
    }

    // https://api.js.langchain.com/classes/langchain_openai.OpenAI.html
    const llm = new OpenAI({
        openAIApiKey: key,
        maxTokens: 500
    });

    const prompt = PromptTemplate.fromTemplate(template);
    const formattedPrompt = await prompt.format({ topic });

    let count = 1;
    const invokations = [];
    while (count--) {
        invokations.push(llm.invoke(formattedPrompt));
    }

    return await Promise.all(invokations);
}

export default {
    ask
};