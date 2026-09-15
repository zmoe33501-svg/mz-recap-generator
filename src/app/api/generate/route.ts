import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import prisma from '@/lib/prisma'; // DB ချိတ်ရင် Comment ဖြုတ်ပါ

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { movieTitle } = await req.json();

    if (!movieTitle) {
      return NextResponse.json({ error: 'Movie title is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are a professional movie recap scriptwriter and YouTube strategist.
      Create a comprehensive package for the movie: "${movieTitle}".
      
      Provide the response in the following JSON format ONLY:
      {
        "suggestedTitles": ["title 1", "title 2", "title 3"],
        "scriptBurmese": "Write a 3-paragraph engaging movie recap script in Burmese language here.",
        "thumbnailPrompts": ["Midjourney prompt 1", "Midjourney prompt 2"]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON safely from Gemini output
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!parsedData) {
      throw new Error("Failed to parse AI response.");
    }

    // Production တွင် DB သို့ သိမ်းရန်
    /*
    const project = await prisma.recapProject.create({
      data: {
        movieTitle,
        generatedScript: parsedData.scriptBurmese,
        suggestedTitles: JSON.stringify(parsedData.suggestedTitles),
        thumbnailPrompts: JSON.stringify(parsedData.thumbnailPrompts),
      }
    });
    */

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
