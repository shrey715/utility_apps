"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Github, ArrowLeft, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({ title, showBack = true }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="flex items-center justify-between py-6">
        {/* Left side - Title or Back */}
        {isHome ? (
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                "bg-[#00d4ff] shadow-[0_4px_0_#00a9cc]"
              )}
            >
              <Gamepad2 className="w-6 h-6 text-black" strokeWidth={2.5} />
            </motion.div>
            <span className="text-xl font-bold text-white hidden sm:block">
              Random Utility(?) Apps
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            {showBack && (
              <Link href="/">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 2 }}
                  className={cn(
                    "p-3 rounded-xl font-bold",
                    "bg-[#252525] border-2 border-[#444] text-white",
                    "shadow-[0_4px_0_#1a1a1a]",
                    "hover:shadow-[0_6px_0_#1a1a1a]",
                    "active:shadow-none",
                    "transition-all duration-100"
                  )}
                >
                  <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                </motion.button>
              </Link>
            )}
            {title && (
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                {title}
              </h1>
            )}
          </div>
        )}

        {/* Right side - Navigation */}
        <div className="flex items-center gap-3">
          {!isHome && (
            <Link href="/">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 2 }}
                className={cn(
                  "p-3 rounded-xl font-bold",
                  "bg-[#252525] border-2 border-[#444] text-white",
                  "shadow-[0_4px_0_#1a1a1a]",
                  "hover:shadow-[0_6px_0_#1a1a1a]",
                  "active:shadow-none",
                  "transition-all duration-100"
                )}
              >
                <Home className="w-5 h-5" strokeWidth={2.5} />
              </motion.button>
            </Link>
          )}
          <Link
            href="https://github.com/shrey715/utility_apps"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: 2 }}
              className={cn(
                "p-3 rounded-xl font-bold",
                "bg-[#252525] border-2 border-[#444] text-white",
                "shadow-[0_4px_0_#1a1a1a]",
                "hover:shadow-[0_6px_0_#1a1a1a]",
                "active:shadow-none",
                "transition-all duration-100"
              )}
            >
              <Github className="w-5 h-5" strokeWidth={2.5} />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
