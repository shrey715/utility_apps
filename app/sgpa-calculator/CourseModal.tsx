"use client";
import { useState, useEffect } from 'react';
import { FaPlus, FaSave, FaTimes } from 'react-icons/fa';

interface Course {
  name: string;
  credits: number;
  cutoffs: { [key: number]: number };
  marks: { mark: number; total: number; weightage: number }[];
  grade: number;
}

interface CourseModalProps {
  course: Course | null;
  onSave: (course: Course) => void;
  onClose: () => void;
}

export default function CourseModal({ course, onSave, onClose }: CourseModalProps) {
  const [name, setName] = useState(course?.name || '');
  const [credits, setCredits] = useState(course?.credits || 0);
  const [cutoffs, setCutoffs] = useState<{ [key: number]: number }>({
    10: course?.cutoffs?.[10] || 90,
    9: course?.cutoffs?.[9] || 80,
    8: course?.cutoffs?.[8] || 70,
    7: course?.cutoffs?.[7] || 60,
    6: course?.cutoffs?.[6] || 50,
    5: course?.cutoffs?.[5] || 40,
  });
  const [marks, setMarks] = useState(course?.marks || [{ mark: 0, total: 0, weightage: 0 }]);
  const [grade, setGrade] = useState(course?.grade || 0);

  useEffect(() => {
    calculateGrade();
  }, [marks]);

  const addMark = () => {
    setMarks([...marks, { mark: 0, total: 0, weightage: 0 }]);
  };

  const handleMarkChange = (index: number, key: keyof typeof marks[0], value: number) => {
    const updatedMarks = [...marks];
    updatedMarks[index][key] = value;
    setMarks(updatedMarks);
  };

  const calculateGrade = () => {
    const totalWeight = marks.reduce((sum, mark) => sum + mark.weightage, 0);
    const totalMarks = marks.reduce((sum, mark) => sum + (mark.mark / mark.total) * mark.weightage, 0);
    const coursePercentage = (totalMarks / totalWeight) * 100;

    for (let i = 10; i >= 5; i--) {
      if (coursePercentage >= cutoffs[i]) {
        setGrade(i);
        return;
      }
    }
    setGrade(0);
  };

  const saveCourse = () => {
    onSave({ name, credits, cutoffs, marks, grade });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="bg-slate-950 p-6 rounded-lg shadow-lg w-full max-w-2xl border border-white overflow-y-auto max-h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{course ? 'Edit Course' : 'Add Course'}</h2>
          <FaTimes className="text-red-500 cursor-pointer" onClick={onClose} />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-white">Course Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-white">Course Credits</label>
            <input
              type="number"
              value={credits}
              onChange={e => setCredits(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">Cutoffs</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {Object.keys(cutoffs).map(key => (
            <div key={key}>
              <label className="block mb-2 text-white">{key} Grade Cutoff</label>
              <input
                type="number"
                value={cutoffs[Number(key)]}
                onChange={e => setCutoffs({ ...cutoffs, [Number(key)]: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              />
            </div>
          ))}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">Marks</h3>
        <div className="grid grid-cols-1 gap-4 mb-4">
          {marks.map((mark, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 text-white">Marks Obtained</label>
                <input
                  type="number"
                  value={mark.mark}
                  onChange={e => handleMarkChange(index, 'mark', Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block mb-2 text-white">Total Marks</label>
                <input
                  type="number"
                  value={mark.total}
                  onChange={e => handleMarkChange(index, 'total', Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block mb-2 text-white">Weightage</label>
                <input
                  type="number"
                  value={mark.weightage}
                  onChange={e => handleMarkChange(index, 'weightage', Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          className="bg-green-500 text-white text-lg px-4 py-2 rounded-lg shadow-md hover:bg-green-600 flex items-center mb-4"
          onClick={addMark}
        >
          <FaPlus className="mr-2" /> Add Mark
        </button>
        <button
          className="bg-blue-500 text-white text-lg px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 flex items-center mb-4"
          onClick={saveCourse}
        >
          <FaSave className="mr-2" /> Save Course
        </button>
      </div>
    </div>
  );
}