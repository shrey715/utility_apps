"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  QrCode, 
  Calculator, 
  BookOpen, 
  Coins, 
  Palette, 
  Cloud, 
  FileText, 
  Files,
  Github,
  Gamepad2
} from "lucide-react";
import { cn } from "@/lib/utils";

const apps = [
  {
    name: "QR Generator",
    description: "Create QR codes instantly",
    href: "/qr-generator",
    icon: QrCode,
    color: "bg-[#00d4ff]",
    shadow: "shadow-[0_6px_0_#00a9cc]",
    textColor: "text-black",
  },
  {
    name: "SGPA Calculator",
    description: "Calculate your GPA",
    href: "/sgpa-calculator",
    icon: Calculator,
    color: "bg-[#ff4757]",
    shadow: "shadow-[0_6px_0_#cc3a47]",
    textColor: "text-white",
  },
  {
    name: "Dictionary",
    description: "Look up any word",
    href: "/dictionary",
    icon: BookOpen,
    color: "bg-[#2ed573]",
    shadow: "shadow-[0_6px_0_#25aa5c]",
    textColor: "text-black",
  },
  {
    name: "Currency",
    description: "Convert currencies",
    href: "/currency-converter",
    icon: Coins,
    color: "bg-[#ffd93d]",
    shadow: "shadow-[0_6px_0_#ccae31]",
    textColor: "text-black",
  },
  {
    name: "Color Picker",
    description: "Pick & save colors",
    href: "/color-picker",
    icon: Palette,
    color: "bg-[#a55eea]",
    shadow: "shadow-[0_6px_0_#844bbb]",
    textColor: "text-white",
  },
  {
    name: "Weather",
    description: "Check the forecast",
    href: "/weather",
    icon: Cloud,
    color: "bg-[#3742fa]",
    shadow: "shadow-[0_6px_0_#2c35c8]",
    textColor: "text-white",
  },
  {
    name: "Markdown",
    description: "Edit & preview MD",
    href: "/markdown-editor",
    icon: FileText,
    color: "bg-[#ff6b9d]",
    shadow: "shadow-[0_6px_0_#cc567e]",
    textColor: "text-white",
  },
  {
    name: "PDF Merger",
    description: "Combine PDF files",
    href: "/pdf-merger",
    icon: Files,
    color: "bg-[#ff6b35]",
    shadow: "shadow-[0_6px_0_#cc5529]",
    textColor: "text-white",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
};

function AppCard({ app }: { app: typeof apps[0] }) {
  const Icon = app.icon;
  
  return (
    <motion.div variants={itemVariants}>
      <Link href={app.href}>
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ y: 2, scale: 0.98 }}
          className={cn(
            "group relative p-5 rounded-2xl cursor-pointer",
            "bg-[#1e1e1e] border-3 border-[#333]",
            "transition-all duration-100",
            "hover:border-[#444]"
          )}
          style={{ borderWidth: "3px" }}
        >
          {/* Icon Badge */}
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
            "transition-transform duration-100",
            "group-hover:-translate-y-1 group-active:translate-y-1",
            app.color,
            app.shadow,
            app.textColor
          )}>
            <Icon className="w-7 h-7" strokeWidth={2.5} />
          </div>
          
          {/* Content */}
          <h3 className="text-lg font-bold text-white mb-1">
            {app.name}
          </h3>
          <p className="text-sm text-[#888]">
            {app.description}
          </p>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-game-grid">
      {/* Content */}
      <div className="relative z-10 container-app min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="py-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                "bg-[#00d4ff] shadow-[0_4px_0_#00a9cc]",
                "transition-transform duration-100"
              )}
            >
              <Gamepad2 className="w-6 h-6 text-black" strokeWidth={2.5} />
            </motion.div>
            <span className="text-xl font-bold text-white hidden sm:block">
              Random Utility(?) Apps
            </span>
          </div>
          
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
                "active:shadow-none active:translate-y-1",
                "transition-all duration-100"
              )}
            >
              <Github className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.header>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="py-12 md:py-16 text-center"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight text-white">
            Welcome!
          </h1>
          
          <p className="text-lg md:text-xl text-[#00d4ff] max-w-3xl mx-auto font-medium">
            This is a scrap project done for just passing time, but feel free to look around and use anything useful (if anything is useful).
          </p>
        </motion.section>

        {/* Apps Grid */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 pb-12"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {apps.map((app) => (
              <AppCard key={app.name} app={app} />
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
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