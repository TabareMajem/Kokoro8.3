import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Mail, Plus, Filter, Users } from 'lucide-react';
import StudentManagementModal from './StudentManagementModal';
import { useStudentStore } from '../../hooks/useStudentStore';

export default function StudentTable({ searchQuery }: { searchQuery: string }) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const students = useStudentStore((state) => state.students);
  const addStudent = useStudentStore((state) => state.addStudent);
  const updateStudent = useStudentStore((state) => state.updateStudent);
  const removeStudent = useStudentStore((state) => state.removeStudent);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = !selectedGrade || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const handleSaveStudent = async (studentData: any) => {
    try {
      if (selectedStudent) {
        await updateStudent(selectedStudent.id, studentData);
      } else {
        await addStudent({
          id: Date.now().toString(),
          ...studentData,
          status: 'active',
          createdAt: new Date().toISOString()
        });
      }
      setIsModalOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Failed to save student:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          {['1st', '2nd', '3rd', '4th', '5th', '6th'].map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(selectedGrade === grade ? null : grade)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedGrade === grade
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setSelectedStudent(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg
            hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Student
        </button>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Students Found
            </h3>
            <p className="text-gray-600">
              {searchQuery || selectedGrade
                ? "No students match your search criteria"
                : "Get started by adding your first student"
              }
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Access Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Parent Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`}
                          alt={student.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm text-gray-600">
                      {student.accessCode}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      student.parentInviteStatus === 'accepted'
                        ? 'bg-green-100 text-green-700'
                        : student.parentInviteStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}>
                      {student.parentInviteStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsModalOpen(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => removeStudent(student.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-gray-600" />
                      </button>
                      {student.parentEmail && (
                        <button
                          onClick={() => {/* Send parent invite */}}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Mail className="w-5 h-5 text-gray-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Student Management Modal */}
      <StudentManagementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        onSave={handleSaveStudent}
        student={selectedStudent}
      />
    </div>
  );
}