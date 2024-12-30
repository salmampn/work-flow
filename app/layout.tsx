import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Workflow",
    default: "Workflow",
  },
  authors: {
    name: "Salma Manda",
  },
  description:
    "Build Todo App with Next.js, Supabase, and Tailwind CSS. Learn how to build a full-stack application with Next.js, Supabase, and Tailwind CSS.",
  openGraph: {
    title: "Workflow",
    description: "Build dashboard with next.js and supabase ",
    // url: "https://daily-todo-task.vercel.app/",
    siteName: "Workflow",
    // images: "/og.png",
    type: "website",
  },
  keywords: ["next.js", "todo app", "supabase"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${poppins.className} antialiased dark:bg-[#09090B]`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <main className=''>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
