import * as z from "zod";

export const codeFormSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt is required" }),
});

export type codeFormRequest = z.infer<typeof codeFormSchema>;
