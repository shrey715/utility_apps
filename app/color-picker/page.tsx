"use client";
import React, { useState, useEffect } from 'react';
import { FaHome, FaCopy, FaPlus, FaPalette, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { HexColorPicker } from 'react-colorful';

interface Palette {
  name: string;
  colors: string[];
}

const ColorBox: React.FC<{ color: string; setCopied: React.Dispatch<React.SetStateAction<boolean>> }> = ({ color, setCopied }) => (
  <div className="w-full max-w-xs h-56 rounded-lg shadow-lg border-2 border-white relative flex justify-center items-center" style={{ backgroundColor: color }}>
    <p className="text-2xl font-semibold text-white mix-blend-luminosity">{color}</p>
    <CopyToClipboard text={color} onCopy={() => setCopied(true)}>
      <button className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded-full shadow hover:bg-gray-600">
        <FaCopy size={16} />
      </button>
    </CopyToClipboard>
  </div>
);

const PaletteItem: React.FC<{ color: string; onDelete: () => void; onCopy: () => void }> = ({ color, onDelete, onCopy }) => (
  <div className="relative">
    <CopyToClipboard text={color} onCopy={onCopy}>
      <div
        className="w-12 h-12 rounded-full cursor-pointer border border-gray-500 flex items-center justify-center"
        style={{ backgroundColor: color }}
        title={color}
      >
        <FaCopy className="text-white opacity-75" size={12} />
      </div>
    </CopyToClipboard>
    <button
      onClick={onDelete}
      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
    >
      <FaTrash size={10} />
    </button>
  </div>
);

const Palette: React.FC<{
  palette: Palette;
  onAddColor: () => void;
  onDeletePalette: () => void;
  onRenamePalette: (newName: string) => void;
  onDeleteColor: (colorIndex: number) => void;
  onColorCopy: () => void;
}> = ({ palette, onAddColor, onDeletePalette, onRenamePalette, onDeleteColor, onColorCopy }) => (
  <div className="w-full bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 flex-wrap">
        <FaPalette />
        <input
          type="text"
          value={palette.name}
          onChange={(e) => onRenamePalette(e.target.value)}
          className="bg-transparent text-xl font-semibold text-white focus:outline-none w-full sm:w-auto border-b focus:border-b-2"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onAddColor}
          className="text-lg bg-gray-700 px-5 py-2 rounded shadow hover:bg-gray-600"
        >
          <FaPlus />
        </button>
        <button
          onClick={onDeletePalette}
          className="text-lg bg-red-500 px-5 py-2 rounded shadow hover:bg-red-600"
        >
          <FaTrash />
        </button>
      </div>
    </div>

    <div className="flex flex-wrap gap-4">
      {palette.colors.map((color, colorIndex) => (
        <PaletteItem
          key={colorIndex}
          color={color}
          onDelete={() => onDeleteColor(colorIndex)}
          onCopy={onColorCopy}
        />
      ))}
    </div>
  </div>
);

const ColorPicker: React.FC = () => {
  const router = useRouter();
  const [color, setColor] = useState('#121212');
  const [palettes, setPalettes] = useState<Palette[]>([{ name: 'Palette 1', colors: [] }]);
  const [copied, setCopied] = useState(false);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  const addPalette = () => {
    setPalettes([...palettes, { name: `Palette ${palettes.length + 1}`, colors: [] }]);
  };

  const addColorToPalette = (index: number) => {
    const newPalettes = [...palettes];
    newPalettes[index].colors.push(color);
    setPalettes(newPalettes);
  };

  const deleteColorFromPalette = (paletteIndex: number, colorIndex: number) => {
    const newPalettes = [...palettes];
    newPalettes[paletteIndex].colors.splice(colorIndex, 1);
    setPalettes(newPalettes);
  };

  const deletePalette = (index: number) => {
    const newPalettes = palettes.filter((_, i) => i !== index);
    setPalettes(newPalettes);
  };

  const handlePaletteNameChange = (index: number, newName: string) => {
    const newPalettes = [...palettes];
    newPalettes[index].name = newName;
    setPalettes(newPalettes);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 flex flex-col items-center text-white space-y-8">
      <header className="flex justify-between w-full mb-8">
        <h1 className="text-5xl font-bold flex items-center gap-2">
          <FaPalette /> Color Picker
        </h1>
        <button onClick={() => router.push('/')} className="bg-gray-700 p-4 rounded-full shadow-md hover:bg-gray-600">
          <FaHome size={28} />
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-4xl justify-center items-center">
        <ColorBox color={color} setCopied={setCopied} />
        <HexColorPicker color={color} onChange={handleColorChange} className="flex-grow" />
      </div>

      <div className="w-full max-w-4xl space-y-6 my-12 mx-5 flex flex-col justify-center items-center">
        <button
          onClick={addPalette}
          className="text-lg bg-gray-700 px-5 py-2 rounded shadow hover:bg-gray-600 flex flex-row items-center gap-2"
        >
          <FaPlus /> Add Palette
        </button>
        {palettes.map((palette, paletteIndex) => (
          <Palette
            key={paletteIndex}
            palette={palette}
            onAddColor={() => addColorToPalette(paletteIndex)}
            onDeletePalette={() => deletePalette(paletteIndex)}
            onRenamePalette={(newName) => handlePaletteNameChange(paletteIndex, newName)}
            onDeleteColor={(colorIndex) => deleteColorFromPalette(paletteIndex, colorIndex)}
            onColorCopy={() => setCopied(true)}
          />
        ))}
      </div>

      {copied && <div className="text-green-400 text-lg font-medium">Color copied to clipboard!</div>}
    </div>
  );
};

export default ColorPicker;
