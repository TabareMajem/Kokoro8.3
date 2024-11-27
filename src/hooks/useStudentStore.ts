import { create } from 'zustand';
import type { Student } from '../types/teacher';

type StudentStore = {
  students: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  removeStudent: (id: string) => void;
  generateAccessCode: () => string;
};

export const useStudentStore = create<StudentStore>((set, get) => ({
  students: [],
  addStudent: (student) => {
    const accessCode = get().generateAccessCode();
    set((state) => ({
      students: [...state.students, { ...student, accessCode }]
    }));
  },
  updateStudent: (id, data) => set((state) => ({
    students: state.students.map(student =>
      student.id === id ? { ...student, ...data } : student
    )
  })),
  removeStudent: (id) => set((state) => ({
    students: state.students.filter(student => student.id !== id)
  })),
  generateAccessCode: () => {
    // Generate a 6-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}));