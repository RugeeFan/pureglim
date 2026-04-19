import { z } from "zod";
import {
  bathroomOptions,
  bedroomOptions,
  deepCleaningAddOns,
  frequencyOptions,
} from "../../app/data/constants";

const serviceTypeMap = {
  regular: "regular",
  deep: "end_of_lease",
  end_of_lease: "end_of_lease",
  commercial: "commercial",
};

const addOnIds = deepCleaningAddOns.map((item) => item.id);

export const quoteRequestSchema = z
  .object({
    serviceType: z
      .string()
      .trim()
      .transform((value) => serviceTypeMap[value])
      .refine(Boolean, "Please choose a valid service type."),
    customerName: z.string().trim().min(1, "Full name is required."),
    phone: z.string().trim().min(1, "Phone is required."),
    email: z.string().trim().email("Please enter a valid email address."),
    address: z.string().trim().min(1, "Address is required."),
    bedrooms: z.enum(bedroomOptions).nullable().optional(),
    bathrooms: z.enum(bathroomOptions).nullable().optional(),
    frequency: z.enum(frequencyOptions).nullable().optional(),
    addOns: z.array(z.enum(addOnIds)).default([]),
    estimatedPrice: z
      .number({
        invalid_type_error: "Estimated price must be a number.",
      })
      .int()
      .nonnegative()
      .nullable()
      .optional(),
    companyName: z.string().trim().max(120).optional().default(""),
    siteType: z.string().trim().max(120).optional().default(""),
    siteSchedule: z.string().trim().max(120).optional().default(""),
    notes: z.string().trim().max(4000).optional().default(""),
    discountCode: z.string().trim().max(32).optional().default(""),
    preferredDate: z.string().max(20).optional().default(""),
    preferredTime: z.string().max(60).optional().default(""),
  })
  .superRefine((data, context) => {
    if (data.serviceType === "regular") {
      if (!data.bedrooms) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bedrooms are required for Regular Cleaning.",
          path: ["bedrooms"],
        });
      }

      if (!data.bathrooms) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bathrooms are required for Regular Cleaning.",
          path: ["bathrooms"],
        });
      }

      if (!data.frequency) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Frequency is required for Regular Cleaning.",
          path: ["frequency"],
        });
      }
    }

    if (data.serviceType === "end_of_lease") {
      if (!data.bedrooms) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bedrooms are required for End of Lease Cleaning.",
          path: ["bedrooms"],
        });
      }

      if (!data.bathrooms) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bathrooms are required for End of Lease Cleaning.",
          path: ["bathrooms"],
        });
      }
    }

    if (data.serviceType === "commercial" && !data.siteType) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Site type is required for Commercial Cleaning.",
        path: ["siteType"],
      });
    }
  });
