"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Header } from "./Header";

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function PageWrapper({
  children,
  title,
  showBack = true,
  className,
  fullWidth = false,
}: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-game-grid">
      {/* Content */}
      <div className={cn(
        "relative z-10 min-h-screen flex flex-col",
        !fullWidth && "container-app"
      )}>
        <Header title={title} showBack={showBack} />
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={cn("flex-1 pb-8", className)}
        >
          {children}
        </motion.main>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="py-6 text-center border-t-2 border-[#252525]"
        >
          <p className="text-[#888] text-sm font-medium">
            Shreyas Deb - 2024 - Right before Mid-Sems :)
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
