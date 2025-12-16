import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SGPA Calculator",
  description: "Free SGPA and GPA calculator for students. Add courses, enter marks, and calculate your semester GPA instantly. Supports custom grade cutoffs.",
  keywords: ["sgpa calculator", "gpa calculator", "semester gpa", "grade calculator", "college gpa calculator", "university gpa", "calculate sgpa online"],
  openGraph: {
    title: "Free SGPA & GPA Calculator | Random Utility Apps",
    description: "Calculate your semester GPA instantly. Add courses, enter marks, supports custom grade cutoffs.",
  },
};

export default function SGPACalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
