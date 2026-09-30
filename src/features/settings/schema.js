import { z } from "zod";

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9][0-9\s-]{6,18}$/, "Enter a phone number with country code, e.g. +855 23 900 123");

export const generalSchema = z.object({
  siteName: z.string().trim().min(2, "Enter the site name").max(60, "Keep it under 60 characters"),
  contactEmail: z.string().trim().email("Enter a valid email address"),
  contactPhone: phone,
  // Currency (USD) and timezone are display-only; the API keeps them fixed.
});

/** Keys map to the exact domain method names in PAYMENT_METHOD_LABELS. */
export const PAYMENT_METHOD_LABELS = {
  cash: "Cash",
  bankTransfer: "Bank Transfer",
  abaPay: "ABA Pay (Simulation)",
  creditCard: "Credit Card (Simulation)",
};

export const paymentsSchema = z
  .object({
    cash: z.object({ enabled: z.boolean(), instructions: z.string().trim().max(160, "Keep instructions under 160 characters") }),
    bankTransfer: z.object({
      enabled: z.boolean(),
      bankName: z.string().trim().min(2, "Enter the bank name"),
      accountName: z.string().trim().min(2, "Enter the account name"),
      accountNumber: z.string().trim().regex(/^[0-9\s-]{6,24}$/, "Use digits, spaces or dashes"),
    }),
    abaPay: z.object({ enabled: z.boolean(), merchantId: z.string().trim().min(4, "Enter the merchant ID") }),
    creditCard: z.object({ enabled: z.boolean(), statementDescriptor: z.string().trim().min(3, "At least 3 characters").max(22, "Card statements allow 22 characters") }),
  })
  .refine((values) => Object.values(values).some((method) => method.enabled), {
    message: "Keep at least one payment method enabled so customers can check out.",
    path: ["root"],
  });

export const emailSchema = z.object({
  fromName: z.string().trim().min(2, "Enter a sender name").max(60),
  fromEmail: z.string().trim().email("Enter a valid email address"),
  bookingConfirmation: z.boolean(),
  paymentReceived: z.boolean(),
  cancellation: z.boolean(),
  reviewRequest: z.boolean(),
});

export const otherSchema = z.object({
  // The input registers with `valueAsNumber`, so an empty field arrives as NaN and fails here.
  cancellationWindowDays: z
    .number({ error: "Enter a number of days" })
    .int("Use whole days")
    .min(0, "Cannot be negative")
    .max(60, "Maximum is 60 days"),
  guestCheckout: z.boolean(),
  reviewsRequireApproval: z.boolean(),
});
