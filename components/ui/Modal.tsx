"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]",
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - blocks interaction with background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/80"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container - centered */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
              className={cn(
                "w-full pointer-events-auto",
                sizes[size]
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={cn(
                  "relative rounded-2xl",
                  "bg-[#1a1a1a] border-3 border-[#333]",
                  "shadow-[0_8px_0_#0a0a0a]",
                  "max-h-[85vh] overflow-hidden flex flex-col"
                )}
                style={{ borderWidth: "3px" }}
              >
                {/* Header */}
                {title && (
                  <div className="flex items-center justify-between p-5 border-b-2 border-[#333]">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button
                      onClick={onClose}
                      className={cn(
                        "p-2 rounded-xl transition-all duration-100",
                        "bg-[#252525] border-2 border-[#444] text-white",
                        "hover:border-[#555] hover:bg-[#333]"
                      )}
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                {/* Close button if no title */}
                {!title && (
                  <button
                    onClick={onClose}
                    className={cn(
                      "absolute top-4 right-4 p-2 rounded-xl z-10 transition-all duration-100",
                      "bg-[#252525] border-2 border-[#444] text-white",
                      "hover:border-[#555] hover:bg-[#333]"
                    )}
                  >
                    <X size={18} />
                  </button>
                )}

                {/* Content */}
                <div className="p-5 overflow-y-auto">
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
