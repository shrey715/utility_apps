"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Plus, Trash2, Check, Download } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface PaletteData { id: string; name: string; colors: string[]; }

const STORAGE_KEY = "color-picker-palettes";

export default function ColorPicker() {
  const [color, setColor] = useState("#a55eea");
  const [palettes, setPalettes] = useState<PaletteData[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setPalettes(JSON.parse(saved));
    else setPalettes([{ id: crypto.randomUUID(), name: "My Palette", colors: [] }]);
  }, []);

  useEffect(() => {
    if (palettes.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
  }, [palettes]);

  const handleCopy = (colorValue: string) => {
    setCopied(colorValue);
    setTimeout(() => setCopied(null), 1500);
  };

  const addPalette = () => setPalettes([...palettes, { id: crypto.randomUUID(), name: `Palette ${palettes.length + 1}`, colors: [] }]);
  const deletePalette = (id: string) => setPalettes(palettes.filter((p) => p.id !== id));
  const renamePalette = (id: string, name: string) => setPalettes(palettes.map((p) => (p.id === id ? { ...p, name } : p)));
  const addColorToPalette = (paletteId: string) => setPalettes(palettes.map((p) => p.id === paletteId ? { ...p, colors: [...p.colors, color] } : p));
  const removeColorFromPalette = (paletteId: string, colorIndex: number) => setPalettes(palettes.map((p) => p.id === paletteId ? { ...p, colors: p.colors.filter((_, i) => i !== colorIndex) } : p));

  const exportPalette = (palette: PaletteData) => {
    const css = palette.colors.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n");
    const content = `:root {\n${css}\n}`;
    const blob = new Blob([content], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${palette.name.toLowerCase().replace(/\s+/g, "-")}.css`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#ffffff";
  };

  return (
    <PageWrapper title="Color Picker" showBack>
      <div className="max-w-5xl mx-auto">
        <Card className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", "bg-[#a55eea] shadow-[0_4px_0_#844bbb]")}>
              <Palette className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Pick a Color</h2>
              <p className="text-sm text-[#888]">Click to copy hex code</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-8">
            <CopyToClipboard text={color} onCopy={() => handleCopy(color)}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full lg:w-64 h-48 rounded-2xl cursor-pointer relative overflow-hidden border-3 border-[#333]"
                style={{ backgroundColor: color, borderWidth: "3px" }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ color: getContrastColor(color) }}>
                  {copied === color ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                      <Check className="w-6 h-6" />
                      <span className="font-bold">Copied!</span>
                    </motion.div>
                  ) : (
                    <>
                      <span className="text-2xl font-black font-mono">{color.toUpperCase()}</span>
                      <span className="text-sm opacity-70 mt-1 font-medium">Click to copy</span>
                    </>
                  )}
                </div>
              </motion.div>
            </CopyToClipboard>

            <div className="flex-1 flex justify-center">
              <HexColorPicker color={color} onChange={setColor} style={{ width: "100%", maxWidth: 300, height: 200 }} />
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-sm font-bold text-[#888] mb-2">Hex Code</label>
              <input
                type="text"
                value={color}
                onChange={(e) => { const val = e.target.value; if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) setColor(val); }}
                className={cn("w-full px-4 py-3 rounded-xl font-mono text-center font-bold", "bg-[#252525] border-2 border-[#444] text-white", "focus:outline-none focus:border-[#a55eea]")}
              />
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Your Palettes</h3>
            <Button color="purple" size="sm" onClick={addPalette}><Plus className="w-4 h-4" /> New</Button>
          </div>

          <AnimatePresence mode="popLayout">
            {palettes.map((palette) => (
              <motion.div key={palette.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <input type="text" value={palette.name} onChange={(e) => renamePalette(palette.id, e.target.value)}
                      className="bg-transparent text-lg font-bold text-white focus:outline-none border-b-2 border-transparent focus:border-[#444]" />
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => addColorToPalette(palette.id)}><Plus className="w-4 h-4" /> Add Current</Button>
                      {palette.colors.length > 0 && <Button variant="secondary" size="sm" onClick={() => exportPalette(palette)}><Download className="w-4 h-4" /> CSS</Button>}
                      <Button variant="ghost" size="sm" onClick={() => deletePalette(palette.id)} className="text-[#ff4757]"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {palette.colors.map((c, i) => (
                      <motion.div key={`${c}-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative group">
                        <CopyToClipboard text={c} onCopy={() => handleCopy(c)}>
                          <motion.div whileHover={{ scale: 1.1 }} className="w-14 h-14 rounded-xl cursor-pointer border-2 border-[#333]" style={{ backgroundColor: c }} title={c} />
                        </CopyToClipboard>
                        <button onClick={() => removeColorFromPalette(palette.id, i)}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ff4757] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Trash2 className="w-3 h-3" />
                        </button>
                        {copied === c && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                    {palette.colors.length === 0 && <p className="text-[#666] text-sm py-4 font-medium">No colors yet. Pick a color and click &quot;Add Current&quot;</p>}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
