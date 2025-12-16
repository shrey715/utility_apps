"use client";

import { useState } from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import { Files, Upload, Trash2, GripVertical, FileText, Loader2 } from "lucide-react";
import Dropzone from "react-dropzone";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface FileItem { id: string; file: File; }

const MAX_FILES = 50;

export default function PDFMerger() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDrop = (acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > MAX_FILES) { alert(`Maximum ${MAX_FILES} files`); return; }
    setFiles((prev) => [...prev, ...acceptedFiles.map((file) => ({ id: crypto.randomUUID(), file }))]);
  };

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));
  const clearAll = () => setFiles([]);
  const formatSize = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const handleMerge = async () => {
    if (files.length < 2) return;
    setLoading(true);
    const formData = new FormData();
    files.forEach(({ file }) => formData.append("file", file));

    try {
      const response = await fetch("/api/pdf-merger", { method: "POST", body: formData });
      if (response.ok) {
        const blob = await response.blob();
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "merged.pdf"; a.click();
      }
    } catch (error) { console.error("Merge failed:", error); }
    finally { setLoading(false); }
  };

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

  return (
    <PageWrapper title="PDF Merger" showBack>
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", "bg-[#ff6b35] shadow-[0_4px_0_#cc5529]")}>
              <Files className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Upload PDFs</h2>
              <p className="text-sm text-[#888]">Drag & drop or click (max {MAX_FILES})</p>
            </div>
          </div>

          <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div {...getRootProps()}
                className={cn(
                  "p-8 rounded-xl border-3 border-dashed cursor-pointer transition-all",
                  "flex flex-col items-center justify-center gap-3",
                  isDragActive ? "border-[#ff6b35] bg-[#ff6b35]/10" : "border-[#444] hover:border-[#555]"
                )}
                style={{ borderWidth: "3px" }}>
                <input {...getInputProps()} />
                <Upload className={cn("w-10 h-10 transition-colors", isDragActive ? "text-[#ff6b35]" : "text-[#666]")} />
                <p className="text-[#888] text-center font-medium">{isDragActive ? "Drop files here..." : "Drag PDF files or click"}</p>
              </div>
            )}
          </Dropzone>
        </Card>

        {files.length > 0 && (
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{files.length} {files.length === 1 ? "File" : "Files"}</h3>
                <p className="text-sm text-[#888] font-medium">Total: {formatSize(totalSize)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={clearAll}><Trash2 className="w-4 h-4" /> Clear</Button>
            </div>

            <p className="text-xs text-[#666] mb-3 font-bold">Drag to reorder</p>

            <Reorder.Group axis="y" values={files} onReorder={setFiles} className="space-y-2">
              <AnimatePresence>
                {files.map((item, index) => (
                  <Reorder.Item key={item.id} value={item} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#252525] border-2 border-[#333] cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4 text-[#666]" />
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#ff4757]/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-[#ff4757]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-bold truncate">{item.file.name}</p>
                        <p className="text-xs text-[#888]">{formatSize(item.file.size)}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#666] w-6 text-center font-bold">{index + 1}</span>
                    <button onClick={() => removeFile(item.id)} className="p-2 rounded-lg hover:bg-[#ff4757]/10 text-[#666] hover:text-[#ff4757] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>

            <div className="mt-6 pt-4 border-t-2 border-[#333]">
              <Button color="orange" onClick={handleMerge} disabled={files.length < 2 || loading} className="w-full" size="lg">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Merging...</> : <><Files className="w-5 h-5" /> Merge {files.length} PDFs</>}
              </Button>
              {files.length < 2 && <p className="text-center text-[#666] text-sm mt-2 font-medium">Add at least 2 files</p>}
            </div>
          </Card>
        )}

        {files.length === 0 && (
          <Card hover={false} className="text-center py-16">
            <div className={cn("w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center", "bg-[#252525] border-2 border-[#444]")}>
              <Files className="w-10 h-10 text-[#666]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No PDFs Added</h3>
            <p className="text-[#888]">Upload files to merge them</p>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}