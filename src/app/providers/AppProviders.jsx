import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import "../../lib/chart";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import { AuthProvider } from "../../features/auth/AuthContext";
import { CustomerAuthProvider } from "../../features/storefront/auth/CustomerAuthContext";

function ThemedToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme}
      position="top-right"
      closeButton
      richColors
      toastOptions={{
        style: {
          background: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
          boxShadow: "var(--shadow-soft)",
        },
      }}
    />
  );
}

export function AppProviders({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CustomerAuthProvider>
            {children}
            <ThemedToaster />
          </CustomerAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
