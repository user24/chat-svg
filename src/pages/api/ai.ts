import type { NextApiRequest, NextApiResponse } from 'next'
import ai from '../../utils/ai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { query } = req;

  const answer = await ai.ask({
    key: process.env.OPENAI_KEY as string,
    topic: query.topic as string,
    template: `Create minimal svg file,
      that renders {topic}.
      Include a desc attribute. Use complimentary color theory. 
  `});
  
  res.status(200).json({ answer })
}