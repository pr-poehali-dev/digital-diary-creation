import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import AdminClassManagement from '@/components/AdminClassManagement';
import AdminTeacherManagement from '@/components/AdminTeacherManagement';
import AdminStudentManagement from '@/components/AdminStudentManagement';
import ScheduleManagement from '@/components/ScheduleManagement';
import ProfileSettings from '@/components/ProfileSettings';
import TeacherStatistics from '@/components/TeacherStatistics';

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

type AdminDashboardProps = {
  user: User;
  classes: Class[];
  teachers: Teacher[];
  students: Student[];
  grades: Grade[];
  schedules: Schedule[];
  homework: Homework[];
  onLogout: () => void;
  onAddClass: (name: string) => void;
  onAddTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  onUpdateTeacher: (teacherId: string, updates: Partial<Teacher>) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (studentId: string, updates: Partial<Student>) => void;
  onDeleteStudent: (studentId: string) => void;
  onAddSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  onAddHomework: (homework: Omit<Homework, 'id'>) => void;
  onUpdateProfile: (avatar: string, name: string) => void;
};

const AdminDashboard = ({
  user,
  classes,
  teachers,
  students,
  grades,
  schedules,
  homework,
  onLogout,
  onAddClass,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onAddSchedule,
  onAddHomework,
  onUpdateProfile
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Icon name="BookOpen" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Электронный Журнал Веб</h1>
              <p className="text-sm text-muted-foreground">Панель администратора</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="text-4xl">{user.avatar || '👑'}</div>
            <Button onClick={onLogout} variant="outline" size="sm">
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 h-auto p-1 bg-white shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
              <Icon name="Home" size={16} />
              <span className="hidden sm:inline">Обзор</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2 py-3">
              <Icon name="BarChart" size={16} />
              <span className="hidden sm:inline">Статистика</span>
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2 py-3">
              <Icon name="Users" size={16} />
              <span className="hidden sm:inline">Классы</span>
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2 py-3">
              <Icon name="GraduationCap" size={16} />
              <span className="hidden sm:inline">Учителя</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2 py-3">
              <Icon name="UserPlus" size={16} />
              <span className="hidden sm:inline">Ученики</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2 py-3">
              <Icon name="Calendar" size={16} />
              <span className="hidden sm:inline">Расписание</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 py-3">
              <Icon name="Settings" size={16} />
              <span className="hidden sm:inline">Профиль</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Users" size={20} />
                    Классы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{classes.length}</div>
                  <p className="text-purple-100 text-sm mt-1">Всего классов</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="GraduationCap" size={20} />
                    Учителя
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{teachers.length}</div>
                  <p className="text-blue-100 text-sm mt-1">Всего учителей</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Users" size={20} />
                    Ученики
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{students.length}</div>
                  <p className="text-green-100 text-sm mt-1">Всего учеников</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Award" size={20} />
                    Оценки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{grades.length}</div>
                  <p className="text-orange-100 text-sm mt-1">Выставлено оценок</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Добро пожаловать, {user.name}!</CardTitle>
                <CardDescription>
                  Используйте вкладки выше для управления системой
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="statistics">
            <TeacherStatistics students={students} grades={grades} classes={classes} />
          </TabsContent>

          <TabsContent value="classes">
            <AdminClassManagement classes={classes} onAddClass={onAddClass} />
          </TabsContent>

          <TabsContent value="teachers">
            <AdminTeacherManagement
              teachers={teachers}
              classes={classes}
              onAddTeacher={onAddTeacher}
              onUpdateTeacher={onUpdateTeacher}
              onDeleteTeacher={onDeleteTeacher}
            />
          </TabsContent>

          <TabsContent value="students">
            <AdminStudentManagement
              students={students}
              classes={classes}
              onAddStudent={onAddStudent}
              onUpdateStudent={onUpdateStudent}
              onDeleteStudent={onDeleteStudent}
            />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleManagement
              classes={classes}
              schedules={schedules}
              homework={homework}
              onAddSchedule={onAddSchedule}
              onAddHomework={onAddHomework}
            />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings user={user} onUpdateProfile={onUpdateProfile} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
