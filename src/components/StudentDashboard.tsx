import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import ProfileSettings from '@/components/ProfileSettings';

type User = {
  id: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
  name: string;
  avatar?: string;
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

type StudentDashboardProps = {
  user: User;
  grades: Grade[];
  schedules: Schedule[];
  homework: Homework[];
  students: Student[];
  onLogout: () => void;
  onUpdateProfile: (avatar: string, name: string) => void;
};

const StudentDashboard = ({
  user,
  grades,
  schedules,
  homework,
  students,
  onLogout,
  onUpdateProfile
}: StudentDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const student = students.find(s => s.id === user.id);
  const myGrades = grades.filter(g => g.studentId === user.id);
  const mySchedules = student ? schedules.filter(s => s.classId === student.classId) : [];
  const myHomework = student ? homework.filter(hw => hw.classId === student.classId) : [];

  const averageGrade = myGrades.length > 0
    ? (myGrades.reduce((sum, g) => sum + g.grade, 0) / myGrades.length).toFixed(2)
    : '0.00';

  const weekDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

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
              <p className="text-sm text-muted-foreground">Панель ученика</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="text-4xl">{user.avatar || '👨‍🎓'}</div>
            <Button onClick={onLogout} variant="outline" size="sm">
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-white shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
              <Icon name="Home" size={16} />
              <span className="hidden sm:inline">Обзор</span>
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
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Icon name="TrendingUp" size={24} />
                    Средний балл
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    По всем предметам
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-6xl font-bold">{averageGrade}</div>
                  <p className="text-blue-100 mt-2">Оценок: {myGrades.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Icon name="BookOpen" size={24} />
                    Домашние задания
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Активные задания
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-6xl font-bold">{myHomework.length}</div>
                  <p className="text-green-100 mt-2">Необходимо выполнить</p>
                </CardContent>
              </Card>
            </div>

            {myHomework.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Домашние задания</CardTitle>
                  <CardDescription>Ваши текущие задания</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myHomework.map(hw => (
                    <div
                      key={hw.id}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{hw.subject}</h4>
                          <p className="text-sm text-gray-600 mt-1">{hw.description}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">Срок сдачи:</p>
                          <p className="font-semibold">{new Date(hw.dueDate).toLocaleDateString('ru-RU')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Расписание на неделю</CardTitle>
                <CardDescription>Ваше расписание уроков</CardDescription>
              </CardHeader>
              <CardContent>
                {mySchedules.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Расписание пока не добавлено
                  </p>
                ) : (
                  <div className="space-y-6">
                    {weekDays.map(day => {
                      const daySchedules = mySchedules.filter(s => s.day === day);
                      if (daySchedules.length === 0) return null;

                      return (
                        <div key={day} className="border-l-4 border-primary pl-4">
                          <h3 className="font-bold text-lg mb-3">{day}</h3>
                          <div className="space-y-2">
                            {daySchedules
                              .sort((a, b) => a.time.localeCompare(b.time))
                              .map(schedule => (
                                <div
                                  key={schedule.id}
                                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="text-sm font-semibold text-primary min-w-[60px]">
                                    {schedule.time}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold">{schedule.subject}</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings user={user} onUpdateProfile={onUpdateProfile} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
