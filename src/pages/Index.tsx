import { useState } from 'react';
import LoginPage from '@/components/LoginPage';
import TeacherDashboard from '@/components/TeacherDashboard';
import StudentDashboard from '@/components/StudentDashboard';

type User = {
  id: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
  name: string;
  avatar?: string;
};

type Class = {
  id: string;
  name: string;
  teacherId: string;
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
      id: '1',
      email: 'RomanYarg',
      password: '1qaz2wsx',
      role: 'teacher',
      name: 'Роман Ярославович',
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
    if (!currentUser || currentUser.role !== 'teacher') return;
    const newClass: Class = {
      id: Date.now().toString(),
      name,
      teacherId: currentUser.id
    };
    setClasses([...classes, newClass]);
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
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

  const addGrade = (grade: Omit<Grade, 'id'>) => {
    const newGrade: Grade = {
      ...grade,
      id: Date.now().toString()
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
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentUser.role === 'teacher') {
    return (
      <TeacherDashboard
        user={currentUser}
        classes={classes}
        students={students}
        grades={grades}
        schedules={schedules}
        homework={homework}
        onLogout={handleLogout}
        onAddClass={addClass}
        onAddStudent={addStudent}
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
