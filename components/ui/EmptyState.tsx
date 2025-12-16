"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  gradient = "from-gray-500/20 to-gray-600/20",
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
    >
      <div
        className={cn(
          "w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br flex items-center justify-center",
          gradient
        )}
      >
        <Icon className="w-10 h-10 text-white/70" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/50 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
