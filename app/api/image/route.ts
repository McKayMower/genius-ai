import { imageFormRequestSchema } from "@/app/(dashboard)/(routes)/image/constants";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount, resolution } = imageFormRequestSchema.parse(body);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", {
        status: 500,
      });
    }

    // check free trial
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    // status 403 for pro sub modal
    if (!freeTrial && !isPro)
      return new NextResponse("Free trial has expired", { status: 403 });

    const response = await openai.createImage({
      prompt: prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    // increase limit by one since response was generated
    if (!isPro) await increaseApiLimit();

    return NextResponse.json(response.data.data);
  } catch (error: any) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
