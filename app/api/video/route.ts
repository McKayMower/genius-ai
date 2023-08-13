import { musicFormSchema } from "@/app/(dashboard)/(routes)/music/constants";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
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

    // status 403 for pro sub modal
    if (!freeTrial)
      return new NextResponse("Free trial has expired", { status: 403 });

    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt_a: prompt,
        },
      }
    );

    // increase limit by one since response was generated
    await increaseApiLimit();

    return NextResponse.json(response);
  } catch (error: any) {
    console.log("[VIDEO_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
