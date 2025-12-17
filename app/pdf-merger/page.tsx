"use client";

import { useState } from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import { Files, Upload, Trash2, GripVertical, FileText, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import Dropzone from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface FileItem { id: string; file: File; }

const MAX_FILES = 50;

export default function PDFMerger() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  const handleDrop = (acceptedFiles: File[]) => {
    setError(null);
    if (files.length + acceptedFiles.length > MAX_FILES) { 
      setError(`Maximum ${MAX_FILES} files allowed`); 
      return; 
    }
    setFiles((prev) => [...prev, ...acceptedFiles.map((file) => ({ id: crypto.randomUUID(), file }))]);
  };

  const removeFile = (id: string) => { setFiles((prev) => prev.filter((f) => f.id !== id)); setError(null); };
  const clearAll = () => { setFiles([]); setError(null); };
  const formatSize = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  // Client-side PDF merging - no server limits!
  const handleMerge = async () => {
    if (files.length < 2) return;
    setError(null);
    setProgress("Starting merge...");
    setLoading(true);

    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const { file } = files[i];
        setProgress(`Processing ${i + 1}/${files.length}: ${file.name}`);
        
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer, { 
            ignoreEncryption: true 
          });
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } catch (pdfError) {
          console.error(`Error processing ${file.name}:`, pdfError);
          setError(`Failed to process "${file.name}". The file may be corrupted or password-protected.`);
          setLoading(false);
          setProgress(null);
          return;
        }
      }

      setProgress("Generating merged PDF...");
      
      // Save and download
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
      
      setProgress("Done!");
      setTimeout(() => setProgress(null), 2000);
    } catch (err) { 
      console.error("Merge failed:", err);
      setError("An error occurred while merging PDFs. Please try again.");
    }
    finally { 
      setLoading(false); 
    }
  };

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

  return (
    <PageWrapper title="PDF Merger" showBack>
      <div className="max-w-3xl mx-auto">
        {/* Info banner */}
        <div className="mb-4 p-3 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-sm text-[#00d4ff] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span><strong>Client-side processing</strong> – Your files never leave your device. No size limits!</span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[#ff4757]/10 border border-[#ff4757]/30 text-sm text-[#ff4757] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {progress && (
          <div className="mb-4 p-3 rounded-lg bg-[#ffa502]/10 border border-[#ffa502]/30 text-sm text-[#ffa502] flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />}
            {!loading && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
            {progress}
          </div>
        )}

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
                        <p className="text-white font-medium truncate">{item.file.name}</p>
                        <p className="text-[#888] text-xs font-medium">{formatSize(item.file.size)}</p>
                      </div>
                    </div>
                    <span className="text-[#666] text-xs font-bold">#{index + 1}</span>
                    <button onClick={() => removeFile(item.id)} className="p-2 rounded-lg hover:bg-[#ff4757]/10 text-[#ff4757]">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>

            <Button color="orange" className="w-full mt-6" size="lg" onClick={handleMerge} disabled={files.length < 2 || loading}>
              {loading ? <><Loader2 className="animate-spin" /> Merging...</> : <><Files /> Merge {files.length} PDFs</>}
            </Button>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}