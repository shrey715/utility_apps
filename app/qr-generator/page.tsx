"use client";
import React, { useRef } from 'react';
import { FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

const Qrgenerator = () => {
  const router = useRouter();
  const [text, setText] = React.useState('');
  const svgRef = useRef<SVGSVGElement | null>(null);

  const downloadSVG = () => {
    if (svgRef.current) {
      const svg = svgRef.current.outerHTML;
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const triggerDownload = (imgURI: string, format: string) => {
    const a = document.createElement('a');
    a.download = `qrcode.${format}`;
    a.target = '_blank';
    a.href = imgURI;
    a.dispatchEvent(new MouseEvent('click', {
      view: window,
      bubbles: false,
      cancelable: true
    }));
  };

  const downloadImage = (format: 'png' | 'jpeg' | 'jpg') => {
    if (svgRef.current) {
      const svgNode = svgRef.current;
      const svgString = new XMLSerializer().serializeToString(svgNode);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const DOMURL = window.URL || window.webkitURL || window;
      const url = DOMURL.createObjectURL(svgBlob);

      const image = new Image();
      image.width = svgNode.width.baseVal.value;
      image.height = svgNode.height.baseVal.value;
      image.src = url;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(image, 0, 0);
        DOMURL.revokeObjectURL(url);

        const imgURI = canvas.toDataURL(`image/${format}`).replace(`image/${format}`, 'image/octet-stream');
        triggerDownload(imgURI, format);
      };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-6">
      <div className="flex flex-row justify-between mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-left">QR Generator</h1>
        <button onClick={() => router.push('/')} className="bg-gray-700 p-4 rounded-full shadow-md hover:bg-gray-600">
          <FaHome size={28} />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mb-10">
        <input
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-fit px-4 py-3 rounded-xl shadow-lg text-black text-lg sm:text-xl bg-gray-300"
          placeholder="Enter text to generate QR code"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-5">
        <motion.div
          className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl aspect-square"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {text && (
            <QRCodeSVG
              value={text}
              className="w-full h-full"
              style={{ maxWidth: '100%', height: 'auto' }}
              ref={svgRef}
            />
          )}
        </motion.div>
        
        {text && (
          <motion.div
            className="mt-4 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              className="bg-blue-600 text-white text-lg px-6 py-3 rounded-full shadow-lg hover:bg-blue-700"
              onClick={downloadSVG}
            >
              Download SVG
            </button>
            <button
              className="bg-green-600 text-white text-lg px-6 py-3 rounded-full shadow-lg hover:bg-green-700"
              onClick={() => downloadImage('png')}
            >
              Download PNG
            </button>
            <button
              className="bg-yellow-600 text-white text-lg px-6 py-3 rounded-full shadow-lg hover:bg-yellow-700"
              onClick={() => downloadImage('jpeg')}
            >
              Download JPEG
            </button>
            <button
              className="bg-red-600 text-white text-lg px-6 py-3 rounded-full shadow-lg hover:bg-red-700"
              onClick={() => downloadImage('jpg')}
            >
              Download JPG
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Qrgenerator;