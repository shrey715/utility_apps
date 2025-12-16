"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Download, Copy, Check, QrCode } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const sizeOptions = [
  { label: "S", value: 128 },
  { label: "M", value: 200 },
  { label: "L", value: 300 },
  { label: "XL", value: 400 },
];

export default function QrGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(200);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleCopy = async () => {
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadSVG = () => {
    if (svgRef.current) {
      const svg = svgRef.current.outerHTML;
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qrcode.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const downloadImage = (format: "png" | "jpeg") => {
    if (svgRef.current) {
      const svgNode = svgRef.current;
      const svgString = new XMLSerializer().serializeToString(svgNode);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.width = size;
      image.height = size;
      image.src = url;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(image, 0, 0, size, size);
        }
        URL.revokeObjectURL(url);
        const imgURI = canvas.toDataURL(`image/${format}`);
        const link = document.createElement("a");
        link.download = `qrcode.${format}`;
        link.href = imgURI;
        link.click();
      };
    }
  };

  return (
    <PageWrapper title="QR Generator" showBack>
      <div className="max-w-4xl mx-auto">
        {/* Input Section */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              "bg-[#00d4ff] shadow-[0_4px_0_#00a9cc]"
            )}>
              <QrCode className="w-6 h-6 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Enter Content</h2>
              <p className="text-sm text-[#888]">Text, URL, or any data</p>
            </div>
          </div>

          <input
            type="text"
            placeholder="Type something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={cn(
              "w-full px-4 py-3 rounded-xl text-lg font-medium",
              "bg-[#252525] border-2 border-[#444] text-white",
              "placeholder:text-[#666]",
              "focus:outline-none focus:border-[#00d4ff]",
              "transition-colors duration-200"
            )}
          />

          {/* Size Selector */}
          <div className="mt-6">
            <label className="block text-sm font-bold text-[#888] mb-3">Size</label>
            <div className="flex gap-2">
              {sizeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSize(opt.value)}
                  className={cn(
                    "w-12 h-12 rounded-xl font-bold text-lg",
                    "transition-all duration-100",
                    size === opt.value
                      ? "bg-[#00d4ff] text-black shadow-[0_4px_0_#00a9cc] -translate-y-0.5"
                      : "bg-[#252525] border-2 border-[#444] text-white hover:border-[#555]"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-bold text-[#888] mb-3">Foreground</label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl border-2 border-[#444] cursor-pointer overflow-hidden"
                  style={{ backgroundColor: fgColor }}
                >
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-[#888] font-mono text-sm font-bold">{fgColor.toUpperCase()}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#888] mb-3">Background</label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl border-2 border-[#444] cursor-pointer overflow-hidden"
                  style={{ backgroundColor: bgColor }}
                >
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-[#888] font-mono text-sm font-bold">{bgColor.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* QR Display */}
        <AnimatePresence mode="wait">
          {text ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              <Card className="text-center">
                <div className="flex flex-col items-center">
                  {/* QR Code */}
                  <div
                    className="p-6 rounded-2xl mb-6 border-2 border-[#333]"
                    style={{ backgroundColor: bgColor }}
                  >
                    <QRCodeSVG
                      value={text}
                      size={size}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      ref={svgRef}
                      level="H"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button color="cyan" onClick={downloadSVG}>
                      <Download className="w-4 h-4" /> SVG
                    </Button>
                    <Button color="green" onClick={() => downloadImage("png")}>
                      <Download className="w-4 h-4" /> PNG
                    </Button>
                    <Button color="orange" onClick={() => downloadImage("jpeg")}>
                      <Download className="w-4 h-4" /> JPEG
                    </Button>
                    <Button variant="secondary" onClick={handleCopy}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <Card hover={false} className="text-center py-16">
              <div className={cn(
                "w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center",
                "bg-[#252525] border-2 border-[#444]"
              )}>
                <QrCode className="w-10 h-10 text-[#666]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No QR Code Yet</h3>
              <p className="text-[#888]">Enter some text above to generate</p>
            </Card>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}