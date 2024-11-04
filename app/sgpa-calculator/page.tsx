"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaEdit, FaCalculator, FaHome, FaTrash } from 'react-icons/fa';
import CourseModal from './CourseModal';

interface Course {
  name: string;
  credits: number;
  cutoffs: { [key: number]: number }; 
  marks: { mark: number; total: number; weightage: number }[];
  grade: number;
}

export default function SGPACalculator() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const router = useRouter();

  const addOrUpdateCourse = (course: Course) => {
    if (currentCourse) {
      setCourses(courses.map(c => (c.name === currentCourse.name ? course : c)));
    } else {
      setCourses([...courses, course]);
    }
    setIsModalOpen(false);
  };

  const deleteCourse = (courseName: string) => {
    setCourses(courses.filter(course => course.name !== courseName));
  };

  const calculateSGPA = () => {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const weightedGrades = courses.reduce((sum, course) => sum + course.grade * course.credits, 0);
    return totalCredits > 0 ? (weightedGrades / totalCredits).toFixed(2) : '0';
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-6">
      <div className="flex flex-row justify-between mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-left">SGPA Calculator</h1>
        <button onClick={() => router.push('/')} className="bg-gray-700 p-4 rounded-full shadow-md hover:bg-gray-600">
          <FaHome size={28} />
        </button>
      </div>

      <div className="flex-grow w-full max-w-full p-6 rounded-lg shadow-lg relative overflow-auto mb-6 border border-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
          {courses.map(course => (
            <div
              key={course.name}
              className="flex flex-col justify-between p-4 bg-gray-600 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
              onClick={() => { setCurrentCourse(course); setIsModalOpen(true); }}
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">{course.name}</h3>
                <p className="text-gray-300">Grade: {course.grade}</p>
                <p className="text-gray-300">Credits: {course.credits}</p>
              </div>
              <div className="flex justify-between mt-2">
                <FaEdit className="text-gray-200 hover:text-blue-400 transition-colors duration-200" />
                <FaTrash
                  className="text-gray-200 hover:text-red-400 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCourse(course.name);
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 right-4">
          <button
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 flex items-center"
            onClick={() => { setCurrentCourse(null); setIsModalOpen(true); }}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-full bg-transparent px-6 py-4">
        <button
          className="bg-green-600 text-white text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 flex items-center mb-4 sm:mb-0"
          onClick={calculateSGPA}
        >
          <FaCalculator className="mr-2" /> Calculate SGPA
        </button>
        <p className="text-3xl sm:text-4xl font-bold text-white">Your SGPA: {calculateSGPA()}</p>
      </div>

      {isModalOpen && (
        <CourseModal
          course={currentCourse}
          onClose={() => setIsModalOpen(false)}
          onSave={addOrUpdateCourse}
        />
      )}
    </div>
  );
}