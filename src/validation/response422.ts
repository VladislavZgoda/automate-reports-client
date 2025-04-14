import { z } from "zod";

export const response422OdpySchema = z.object({
  file: z.enum(["simsFile", "piramidaFile"]),
  message: z.string().min(1),
});

export const response422LegalSchema = z.object({
  file: z.enum(["meterReadings", "currentMeterReadings"]),
  message: z.string().min(1),
});
