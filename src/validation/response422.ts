import { z } from "zod";

export const response422Schema = z.object({
  file: z.enum(["simsFile", "piramidaFile"]),
  message: z.string().min(1),
});
