import { z } from "zod";

const tokenSchema = z.object({
  accessToken: z.string().min(1),
});

export default tokenSchema;
