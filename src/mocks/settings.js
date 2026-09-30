/** Mock admin settings. Saved changes last for the browser session, like other mock data. */
export const MOCK_SETTINGS = {
  general: {
    siteName: "TourTrip Cambodia",
    contactEmail: "hello@tourtrip.com",
    contactPhone: "+855 23 900 123",
    currency: "USD",
    timezone: "Asia/Phnom_Penh (UTC+7)",
  },
  payments: {
    cash: { enabled: true, instructions: "Pay your guide in cash on the tour day." },
    bankTransfer: { enabled: true, bankName: "ABA Bank", accountName: "TourTrip Co., Ltd.", accountNumber: "000 123 456" },
    abaPay: { enabled: true, merchantId: "TT-ABA-DEMO-01" },
    creditCard: { enabled: false, statementDescriptor: "TOURTRIP KH" },
  },
  email: {
    fromName: "TourTrip Cambodia",
    fromEmail: "no-reply@tourtrip.com",
    bookingConfirmation: true,
    paymentReceived: true,
    cancellation: true,
    reviewRequest: false,
  },
  other: {
    cancellationWindowDays: 3,
    guestCheckout: true,
    reviewsRequireApproval: true,
  },
};
