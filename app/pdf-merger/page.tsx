"use client";
import { useState } from 'react';
import { FaHome, FaTrash, FaSpinner } from 'react-icons/fa';
import Dropzone from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { ReactSortable } from 'react-sortablejs';

interface FileWithId {
  id: number;
  file: File;
}

const PDFMerger = () => {
  const router = useRouter();
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [idCounter, setIdCounter] = useState(0);

  const max = 100;

  const handleDrop = (acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > max) {
      alert(`You can only merge ${max} files.`);
      return;
    }
    const newFiles = acceptedFiles.map((file) => ({
      id: idCounter,
      file,
    }));
    setFiles([...files, ...newFiles]);
    setIdCounter(idCounter + 1);
  };

  const handleRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    setLoading(true);
    const formData = new FormData();
    files.forEach(({ file }) => {
      formData.append('file', file);
    });

    const response = await fetch('/api/pdf-merger', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      URL.revokeObjectURL(url);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 flex flex-col items-center text-white space-y-8">
      <header className="flex justify-between w-full mb-4 md:mb-8">
        <h1 className="text-3xl md:text-5xl font-bold flex items-center gap-2">
          PDF Merger
        </h1>
        <button onClick={() => router.push('/')} className="bg-gray-700 p-2 md:p-4 rounded-full shadow-md hover:bg-gray-600">
          <FaHome size={20} />
        </button>
      </header>

      <div className="w-full md:w-1/2 flex flex-col items-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold">Drop PDF files here</h2>
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <section
              className={`w-full p-6 border-4 border-dashed rounded-md flex flex-col items-center transition-all duration-200 cursor-copy ${
                isDragActive ? 'border-green-500 bg-green-100' : 'border-gray-600 bg-gray-800'
              }`}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <p className="text-lg text-white">
                {isDragActive ? 'Drop the files here ...' : 'Drag & drop some files here, or click to select files'}
              </p>
            </section>
          )}
        </Dropzone>

        <ReactSortable list={files} setList={setFiles} className="w-full">
          {files.map(({ id, file }, index) => (
            <div key={id} className="flex justify-between items-center w-full p-2 bg-gray-700 rounded-md mb-2">
              <span>{file.name}</span>
              <button onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
            </div>
          ))}
        </ReactSortable>

        {files.length > 0 && (
          <button
            onClick={handleMerge}
            className="bg-green-700 p-3 rounded-full shadow-md hover:bg-green-600 transition-all duration-200"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Merge PDFs'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PDFMerger;