import apiClient from "../../lib/axios";
import { MOCK_ADMIN, MOCK_ADMIN_CREDENTIALS } from "../../mocks/auth";

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const useMock = import.meta.env.VITE_USE_MOCK !== "false";

export async function signIn(credentials) {
  if (!useMock) return apiClient.post("/auth/admin/login", credentials).then(({ data }) => data);

  await wait(900);
  const emailMatches = credentials.email.trim().toLowerCase() === MOCK_ADMIN_CREDENTIALS.email;
  const passwordMatches = credentials.password === MOCK_ADMIN_CREDENTIALS.password;

  if (!emailMatches || !passwordMatches) {
    throw new Error("The email or password is incorrect");
  }

  return { challengeId: "mock-admin-challenge", destination: credentials.email };
}

export async function verifyOtp({ challengeId, code }) {
  if (!useMock) return apiClient.post("/auth/admin/verify-otp", { challengeId, code }).then(({ data }) => data);

  await wait(900);
  if (challengeId !== "mock-admin-challenge" || code !== MOCK_ADMIN_CREDENTIALS.otp) {
    throw new Error("That verification code is incorrect");
  }

  return {
    token: `mock-token-${Date.now()}`,
    user: MOCK_ADMIN,
  };
}

export async function resendOtp(challengeId) {
  if (!useMock) return apiClient.post("/auth/admin/resend-otp", { challengeId }).then(({ data }) => data);
  await wait(600);
  return { sent: true };
}

export async function signUp(userData) {
  if (!useMock) return apiClient.post("/auth/register", userData).then(({ data }) => data);
  await wait(850);
  return {
    success: true,
    message: "Account created successfully",
    user: {
      id: `usr-${Date.now()}`,
      name: userData.firstName ? `${userData.firstName} ${userData.lastName}` : (userData.fullName || "Traveler"),
      email: userData.email,
      phone: userData.phone,
      dob: userData.dob,
      role: "traveler",
    },
  };
}


