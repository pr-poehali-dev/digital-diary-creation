import { useState } from 'react';
import LoginPage from '@/components/LoginPage';
import TeacherDashboard from '@/components/TeacherDashboard';
import StudentDashboard from '@/components/StudentDashboard';
import AdminDashboard from '@/components/AdminDashboard';

type User = {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  name: string;
  avatar?: string;
};

type Teacher = {
  id: string;
  name: string;
  email: string;
  password: string;
  subjects: string[];
  classIds: string[];
  avatar?: string;
};

type Class = {
  id: string;
  name: string;
};

type Student = {
  id: string;
  name: string;
  email: string;
  password: string;
  classId: string;
  avatar?: string;
};

type Grade = {
  id: string;
  studentId: string;
  subject: string;
  grade: number;
  date: string;
  teacherId: string;
};

type Schedule = {
  id: string;
  classId: string;
  day: string;
  time: string;
  subject: string;
};

type Homework = {
  id: string;
  classId: string;
  subject: string;
  description: string;
  dueDate: string;
};

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: '0',
      email: 'Админ',
      password: 'Админ2011',
      role: 'admin',
      name: 'Администратор Школы',
      avatar: '👑'
    },
    {
      id: '1',
      email: 'RomanYarg',
      password: '1qaz2wsx',
      role: 'teacher',
      name: 'Роман Ярославович',
      avatar: '👨‍🏫'
    }
  ]);

  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'Роман Ярославович',
      email: 'RomanYarg',
      password: '1qaz2wsx',
      subjects: [],
      classIds: [],
      avatar: '👨‍🏫'
    }
  ]);

  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);

  const handleLogin = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
    }
    return !!user;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addClass = (name: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    const newClass: Class = {
      id: Date.now().toString(),
      name
    };
    setClasses([...classes, newClass]);
  };

  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    const newTeacher: Teacher = {
      ...teacher,
      id: Date.now().toString()
    };
    setTeachers([...teachers, newTeacher]);

    const newUser: User = {
      id: newTeacher.id,
      email: teacher.email,
      password: teacher.password,
      role: 'teacher',
      name: teacher.name,
      avatar: teacher.avatar
    };
    setUsers([...users, newUser]);
  };

  const updateTeacher = (teacherId: string, updates: Partial<Teacher>) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setTeachers(teachers.map(t => t.id === teacherId ? { ...t, ...updates } : t));
    setUsers(users.map(u => u.id === teacherId ? { ...u, name: updates.name || u.name, avatar: updates.avatar || u.avatar } : u));
  };

  const deleteTeacher = (teacherId: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setTeachers(teachers.filter(t => t.id !== teacherId));
    setUsers(users.filter(u => u.id !== teacherId));
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    const newStudent: Student = {
      ...student,
      id: Date.now().toString()
    };
    setStudents([...students, newStudent]);
    
    const newUser: User = {
      id: newStudent.id,
      email: student.email,
      password: student.password,
      role: 'student',
      name: student.name,
      avatar: student.avatar
    };
    setUsers([...users, newUser]);
  };

  const updateStudent = (studentId: string, updates: Partial<Student>) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setStudents(students.map(s => s.id === studentId ? { ...s, ...updates } : s));
    setUsers(users.map(u => u.id === studentId ? { ...u, name: updates.name || u.name, avatar: updates.avatar || u.avatar } : u));
  };

  const deleteStudent = (studentId: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setStudents(students.filter(s => s.id !== studentId));
    setUsers(users.filter(u => u.id !== studentId));
    setGrades(grades.filter(g => g.studentId !== studentId));
  };

  const addGrade = (grade: Omit<Grade, 'id' | 'teacherId'>) => {
    if (!currentUser || currentUser.role !== 'teacher') return;
    
    const teacher = teachers.find(t => t.id === currentUser.id);
    if (!teacher || !teacher.subjects.includes(grade.subject)) return;

    const newGrade: Grade = {
      ...grade,
      id: Date.now().toString(),
      teacherId: currentUser.id
    };
    setGrades([...grades, newGrade]);
  };

  const addSchedule = (schedule: Omit<Schedule, 'id'>) => {
    const newSchedule: Schedule = {
      ...schedule,
      id: Date.now().toString()
    };
    setSchedules([...schedules, newSchedule]);
  };

  const addHomework = (hw: Omit<Homework, 'id'>) => {
    const newHomework: Homework = {
      ...hw,
      id: Date.now().toString()
    };
    setHomework([...homework, newHomework]);
  };

  const updateUserProfile = (avatar: string, name: string) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, avatar, name };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    
    if (currentUser.role === 'student') {
      setStudents(students.map(s => s.id === currentUser.id ? { ...s, avatar, name } : s));
    } else if (currentUser.role === 'teacher') {
      setTeachers(teachers.map(t => t.id === currentUser.id ? { ...t, avatar, name } : t));
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentUser.role === 'admin') {
    return (
      <AdminDashboard
        user={currentUser}
        classes={classes}
        teachers={teachers}
        students={students}
        grades={grades}
        schedules={schedules}
        homework={homework}
        onLogout={handleLogout}
        onAddClass={addClass}
        onAddTeacher={addTeacher}
        onUpdateTeacher={updateTeacher}
        onDeleteTeacher={deleteTeacher}
        onAddStudent={addStudent}
        onUpdateStudent={updateStudent}
        onDeleteStudent={deleteStudent}
        onAddSchedule={addSchedule}
        onAddHomework={addHomework}
        onUpdateProfile={updateUserProfile}
      />
    );
  }

  if (currentUser.role === 'teacher') {
    const teacher = teachers.find(t => t.id === currentUser.id);
    const teacherClasses = classes.filter(c => teacher?.classIds.includes(c.id));
    const teacherStudents = students.filter(s => teacher?.classIds.includes(s.classId));

    return (
      <TeacherDashboard
        user={currentUser}
        teacher={teacher}
        classes={teacherClasses}
        students={teacherStudents}
        grades={grades}
        schedules={schedules}
        homework={homework}
        onLogout={handleLogout}
        onAddGrade={addGrade}
        onAddSchedule={addSchedule}
        onAddHomework={addHomework}
        onUpdateProfile={updateUserProfile}
      />
    );
  }

  return (
    <StudentDashboard
      user={currentUser}
      grades={grades}
      schedules={schedules}
      homework={homework}
      students={students}
      onLogout={handleLogout}
      onUpdateProfile={updateUserProfile}
    />
  );
};

export default Index;
