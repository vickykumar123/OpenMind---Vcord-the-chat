import type {Metadata} from "next";
import {Open_Sans} from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import {ThemeProvider} from "@/components/providers/ThemeProvider";
import {cn} from "@/lib/utils";
import {ModalProvider} from "@/components/providers/ModalProvider";
import {SocketProvider} from "@/components/providers/SocketProvider";

const font = Open_Sans({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "OpenMind - Vcord the chat",
  description: "OpenMind is fully anonymous chat application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SocketProvider>
              <ModalProvider />
              {children}
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
