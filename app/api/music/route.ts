import { musicFormSchema } from "@/app/(dashboard)/(routes)/music/constants";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = musicFormSchema.parse(body);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!prompt) return new NextResponse("Prompt is required", { status: 400 });

    // check free trial
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    // status 403 for pro sub modal
    if (!freeTrial && !isPro)
      return new NextResponse("Free trial has expired", { status: 403 });

    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt,
        },
      }
    );

    // increase limit by one since response was generated
    if (!isPro) await increaseApiLimit();

    return NextResponse.json(response);
  } catch (error: any) {
    console.log("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
