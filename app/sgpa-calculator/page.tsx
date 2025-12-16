"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Save, X, Trash2, Edit3, GraduationCap } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  name: string;
  credits: number;
  cutoffs: { [key: number]: number };
  marks: { mark: number; total: number; weightage: number }[];
  grade: number;
}

type CutoffsType = { [key: number]: number };

const defaultCutoffs: CutoffsType = {
  10: 90, 9: 80, 8: 70, 7: 60, 6: 50, 5: 40,
};

const gradeColors: { [key: number]: { bg: string; shadow: string; text: string } } = {
  10: { bg: "bg-[#2ed573]", shadow: "shadow-[0_4px_0_#25aa5c]", text: "text-black" },
  9: { bg: "bg-[#00d4ff]", shadow: "shadow-[0_4px_0_#00a9cc]", text: "text-black" },
  8: { bg: "bg-[#3742fa]", shadow: "shadow-[0_4px_0_#2c35c8]", text: "text-white" },
  7: { bg: "bg-[#a55eea]", shadow: "shadow-[0_4px_0_#844bbb]", text: "text-white" },
  6: { bg: "bg-[#ffd93d]", shadow: "shadow-[0_4px_0_#ccae31]", text: "text-black" },
  5: { bg: "bg-[#ff6b35]", shadow: "shadow-[0_4px_0_#cc5529]", text: "text-white" },
  0: { bg: "bg-[#ff4757]", shadow: "shadow-[0_4px_0_#cc3a47]", text: "text-white" },
};

export default function SGPACalculator() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [animatedSGPA, setAnimatedSGPA] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("sgpa-courses");
    if (saved) setCourses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("sgpa-courses", JSON.stringify(courses));
  }, [courses]);

  const calculateSGPA = useCallback(() => {
    if (courses.length === 0) return 0;
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    const weightedGrades = courses.reduce((sum, c) => sum + c.grade * c.credits, 0);
    return totalCredits > 0 ? weightedGrades / totalCredits : 0;
  }, [courses]);

  useEffect(() => {
    const targetSGPA = calculateSGPA();
    const duration = 400;
    const startTime = Date.now();
    const start = animatedSGPA;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimatedSGPA(start + (targetSGPA - start) * progress);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses, calculateSGPA]);

  const addOrUpdateCourse = (course: Course) => {
    if (editingCourse) {
      setCourses(courses.map((c) => (c.id === editingCourse.id ? course : c)));
    } else {
      setCourses([...courses, { ...course, id: crypto.randomUUID() }]);
    }
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const deleteCourse = (id: string) => setCourses(courses.filter((c) => c.id !== id));

  return (
    <PageWrapper title="SGPA Calculator" showBack>
      <div className="max-w-6xl mx-auto">
        {/* SGPA Display */}
        <Card className="mb-8 text-center">
          <p className="text-[#888] text-sm font-bold mb-2">YOUR GPA</p>
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-7xl md:text-8xl font-black text-[#00d4ff]"
          >
            {animatedSGPA.toFixed(2)}
          </motion.div>
          <p className="text-[#666] text-sm font-bold mt-2">
            {courses.length} {courses.length === 1 ? "Course" : "Courses"} •{" "}
            {courses.reduce((sum, c) => sum + c.credits, 0)} Credits
          </p>
        </Card>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          <AnimatePresence mode="popLayout">
            {courses.map((course) => {
              const colors = gradeColors[course.grade] || gradeColors[0];
              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Card
                    className="relative group cursor-pointer"
                    onClick={() => { setEditingCourse(course); setIsModalOpen(true); }}
                  >
                    {/* Grade Badge */}
                    <div className={cn(
                      "absolute -top-3 -right-3 w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg",
                      colors.bg, colors.shadow, colors.text
                    )}>
                      {course.grade}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1 pr-10 line-clamp-1">
                      {course.name}
                    </h3>
                    <p className="text-[#888] text-sm font-medium">
                      {course.credits} {course.credits === 1 ? "Credit" : "Credits"}
                    </p>

                    <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingCourse(course); setIsModalOpen(true); }}
                        className="p-2 rounded-lg bg-[#333] hover:bg-[#444] transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteCourse(course.id); }}
                        className="p-2 rounded-lg bg-[#ff4757]/20 hover:bg-[#ff4757]/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-[#ff4757]" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setEditingCourse(null); setIsModalOpen(true); }}
            className={cn(
              "h-full min-h-[140px] rounded-2xl border-3 border-dashed border-[#444]",
              "flex flex-col items-center justify-center gap-3",
              "hover:border-[#00d4ff] hover:bg-[#00d4ff]/5 transition-all",
              "text-[#666] hover:text-[#00d4ff]"
            )}
            style={{ borderWidth: "3px" }}
          >
            <Plus className="w-8 h-8" />
            <span className="text-sm font-bold">Add Course</span>
          </motion.button>
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
          <Card hover={false} className="text-center py-16">
            <div className={cn(
              "w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center",
              "bg-[#252525] border-2 border-[#444]"
            )}>
              <GraduationCap className="w-10 h-10 text-[#666]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Courses Yet</h3>
            <p className="text-[#888] mb-6">Add your first course to start</p>
            <Button color="cyan" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4" /> Add Course
            </Button>
          </Card>
        )}

        {/* Modal */}
        <CourseModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingCourse(null); }}
          onSave={addOrUpdateCourse}
          course={editingCourse}
        />
      </div>
    </PageWrapper>
  );
}

function CourseModal({ isOpen, onClose, onSave, course }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
  course: Course | null;
}) {
  const [name, setName] = useState("");
  const [credits, setCredits] = useState(3);
  const [cutoffs, setCutoffs] = useState<CutoffsType>(defaultCutoffs);
  const [marks, setMarks] = useState([{ mark: 0, total: 100, weightage: 100 }]);
  const [grade, setGrade] = useState(0);

  useEffect(() => {
    if (course) {
      setName(course.name);
      setCredits(course.credits);
      setCutoffs(course.cutoffs);
      setMarks(course.marks);
      setGrade(course.grade);
    } else {
      setName("");
      setCredits(3);
      setCutoffs(defaultCutoffs);
      setMarks([{ mark: 0, total: 100, weightage: 100 }]);
      setGrade(0);
    }
  }, [course, isOpen]);

  const calculateGrade = useCallback(() => {
    const totalWeight = marks.reduce((sum, m) => sum + m.weightage, 0);
    if (totalWeight === 0) return 0;
    const totalMarks = marks.reduce(
      (sum, m) => sum + (m.total > 0 ? (m.mark / m.total) * m.weightage : 0), 0
    );
    const percentage = (totalMarks / totalWeight) * 100;
    for (let i = 10; i >= 5; i--) if (percentage >= cutoffs[i]) return i;
    return 0;
  }, [marks, cutoffs]);

  useEffect(() => setGrade(calculateGrade()), [marks, cutoffs, calculateGrade]);

  const addMark = () => setMarks([...marks, { mark: 0, total: 100, weightage: 0 }]);

  const updateMark = (index: number, field: keyof (typeof marks)[0], value: number) => {
    const updated = [...marks];
    updated[index][field] = value;
    setMarks(updated);
  };

  const removeMark = (index: number) => {
    if (marks.length > 1) setMarks(marks.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ id: course?.id || "", name: name.trim(), credits, cutoffs, marks, grade });
  };

  const colors = gradeColors[grade] || gradeColors[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={course ? "Edit Course" : "Add Course"} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Course Name" placeholder="e.g., Data Structures" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Credits" type="number" value={credits} onChange={(e) => setCredits(Number(e.target.value))} min={1} max={10} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-[#888]">Marks Components</label>
            <button onClick={addMark} className="text-sm text-[#00d4ff] font-bold flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {marks.map((mark, index) => (
              <div key={index} className="flex flex-wrap gap-2 items-end p-3 rounded-lg bg-[#1a1a1a] border border-[#333]">
                <div className="w-full sm:flex-1 min-w-[80px]">
                  <label className="block text-xs text-[#666] mb-1 font-bold">Obtained</label>
                  <input type="number" value={mark.mark} onChange={(e) => updateMark(index, "mark", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#252525] border-2 border-[#444] text-white text-sm focus:outline-none focus:border-[#00d4ff]" />
                </div>
                <div className="flex-1 min-w-[80px]">
                  <label className="block text-xs text-[#666] mb-1 font-bold">Total</label>
                  <input type="number" value={mark.total} onChange={(e) => updateMark(index, "total", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#252525] border-2 border-[#444] text-white text-sm focus:outline-none focus:border-[#00d4ff]" />
                </div>
                <div className="flex-1 min-w-[80px]">
                  <label className="block text-xs text-[#666] mb-1 font-bold">Weight %</label>
                  <input type="number" value={mark.weightage} onChange={(e) => updateMark(index, "weightage", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#252525] border-2 border-[#444] text-white text-sm focus:outline-none focus:border-[#00d4ff]" />
                </div>
                <button onClick={() => removeMark(index)} className="p-2 rounded-lg hover:bg-[#ff4757]/10 text-[#ff4757] disabled:opacity-30 self-end" disabled={marks.length === 1}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-[#252525] border-2 border-[#333]">
          <span className="text-[#888] font-bold">Calculated Grade</span>
          <div className={cn("px-4 py-2 rounded-lg font-black text-lg", colors.bg, colors.shadow, colors.text)}>
            {grade}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t-2 border-[#333]">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button color="cyan" onClick={handleSave} disabled={!name.trim()}>
            <Save className="w-4 h-4" /> {course ? "Update" : "Add"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}