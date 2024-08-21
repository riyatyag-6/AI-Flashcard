import { NextResponse } from "next/server";
//import OpenAI from "openai";
import Groq from "groq-sdk";

const systemPrompt = `
You are a flashcard creator.  Your task is to generate concise and effective flashcards based on the given topic or content, follow these guidelines:
1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambigious phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information on the flashcard.
8. Tailor the difficulty level of the flashcards to the user's specified prefrence.
9. If given a body of text, extract the most important and relevant information to use as the flashcard.
10. Aime to create a balances set of flashcards that covers the topic comprehensively.
11. Only generate 10 flashcards.

Remember the goal is to facilitate effective learning and retention of information through these flashcards.

Return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
 /* const openai = new OpenAI();
  const data = await req.text();

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: data },
    ],
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });
*/


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const data = await req.text();

const completion = await groq.chat.completions.create({
    messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data },
    ],
    model: 'llama3-8b-8192',
    response_format: { type: 'json_object' },
});



  // Parse the JSON response from the OpenAI API
  const flashcards = JSON.parse(completion.choices[0].message.content);

  // Return the flashcards as a JSON response
  return NextResponse.json(flashcards.flashcards);
}
