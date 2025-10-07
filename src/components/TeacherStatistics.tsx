import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

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

type Class = {
  id: string;
  name: string;
  teacherId: string;
};

type TeacherStatisticsProps = {
  students: Student[];
  grades: Grade[];
  classes: Class[];
};

const TeacherStatistics = ({ students, grades, classes }: TeacherStatisticsProps) => {
  const getStudentAverage = (studentId: string) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;
    return studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length;
  };

  const getClassAverage = (classId: string) => {
    const classStudents = students.filter(s => s.classId === classId);
    if (classStudents.length === 0) return 0;
    const averages = classStudents.map(s => getStudentAverage(s.id)).filter(avg => avg > 0);
    if (averages.length === 0) return 0;
    return averages.reduce((sum, avg) => sum + avg, 0) / averages.length;
  };

  const topStudents = students
    .map(student => ({
      ...student,
      average: getStudentAverage(student.id)
    }))
    .filter(s => s.average > 0)
    .sort((a, b) => b.average - a.average)
    .slice(0, 5);

  const subjectStats = grades.reduce((acc, grade) => {
    if (!acc[grade.subject]) {
      acc[grade.subject] = {
        total: 0,
        count: 0,
        grades: { 5: 0, 4: 0, 3: 0, 2: 0 }
      };
    }
    acc[grade.subject].total += grade.grade;
    acc[grade.subject].count += 1;
    acc[grade.subject].grades[grade.grade as keyof typeof acc[string]['grades']] += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number; grades: { 5: number; 4: number; 3: number; 2: number } }>);

  const subjectAverages = Object.entries(subjectStats)
    .map(([subject, stats]) => ({
      subject,
      average: (stats.total / stats.count).toFixed(2),
      count: stats.count,
      grades: stats.grades
    }))
    .sort((a, b) => parseFloat(b.average) - parseFloat(a.average));

  const totalAverage = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2)
    : '0.00';

  const gradeDistribution = grades.reduce(
    (acc, grade) => {
      acc[grade.grade] += 1;
      return acc;
    },
    { 5: 0, 4: 0, 3: 0, 2: 0 } as Record<number, number>
  );

  const getGradePercentage = (grade: number) => {
    if (grades.length === 0) return 0;
    return ((gradeDistribution[grade] / grades.length) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="TrendingUp" size={20} />
              Общий средний балл
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{totalAverage}</div>
            <p className="text-blue-100 text-sm mt-1">По всем предметам</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="Award" size={20} />
              Пятёрки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{gradeDistribution[5]}</div>
            <p className="text-green-100 text-sm mt-1">{getGradePercentage(5)}% от всех оценок</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="AlertCircle" size={20} />
              Тройки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{gradeDistribution[3]}</div>
            <p className="text-orange-100 text-sm mt-1">{getGradePercentage(3)}% от всех оценок</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="XCircle" size={20} />
              Двойки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{gradeDistribution[2]}</div>
            <p className="text-red-100 text-sm mt-1">{getGradePercentage(2)}% от всех оценок</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Топ учеников</CardTitle>
            <CardDescription>Лучшие показатели успеваемости</CardDescription>
          </CardHeader>
          <CardContent>
            {topStudents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Статистика появится после выставления оценок
              </p>
            ) : (
              <div className="space-y-3">
                {topStudents.map((student, index) => {
                  const studentClass = classes.find(c => c.id === student.classId);
                  return (
                    <div
                      key={student.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="text-3xl">{student.avatar || '👨‍🎓'}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {studentClass?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {student.average.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">средний балл</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Средний балл по классам</CardTitle>
            <CardDescription>Успеваемость каждого класса</CardDescription>
          </CardHeader>
          <CardContent>
            {classes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Создайте классы для просмотра статистики
              </p>
            ) : (
              <div className="space-y-4">
                {classes
                  .map(cls => ({
                    ...cls,
                    average: getClassAverage(cls.id)
                  }))
                  .filter(c => c.average > 0)
                  .sort((a, b) => b.average - a.average)
                  .map(cls => (
                    <div
                      key={cls.id}
                      className="p-4 border border-gray-200 rounded-lg bg-white"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-lg">Класс {cls.name}</h4>
                        <span className="text-2xl font-bold text-primary">
                          {cls.average.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${(cls.average / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                {classes.every(c => getClassAverage(c.id) === 0) && (
                  <p className="text-center text-muted-foreground py-4">
                    Статистика появится после выставления оценок
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Статистика по предметам</CardTitle>
          <CardDescription>Средний балл и распределение оценок</CardDescription>
        </CardHeader>
        <CardContent>
          {subjectAverages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Выставите оценки для просмотра статистики
            </p>
          ) : (
            <div className="space-y-6">
              {subjectAverages.map(item => (
                <div key={item.subject} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg">{item.subject}</h4>
                      <p className="text-sm text-muted-foreground">Оценок: {item.count}</p>
                    </div>
                    <div className="text-3xl font-bold text-primary">{item.average}</div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="text-2xl font-bold text-green-600">{item.grades[5]}</div>
                      <div className="text-xs text-green-600 mt-1">Пятёрки</div>
                      <div className="text-xs text-muted-foreground">
                        {item.count > 0 ? ((item.grades[5] / item.count) * 100).toFixed(0) : 0}%
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">{item.grades[4]}</div>
                      <div className="text-xs text-blue-600 mt-1">Четвёрки</div>
                      <div className="text-xs text-muted-foreground">
                        {item.count > 0 ? ((item.grades[4] / item.count) * 100).toFixed(0) : 0}%
                      </div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg border-2 border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">{item.grades[3]}</div>
                      <div className="text-xs text-orange-600 mt-1">Тройки</div>
                      <div className="text-xs text-muted-foreground">
                        {item.count > 0 ? ((item.grades[3] / item.count) * 100).toFixed(0) : 0}%
                      </div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg border-2 border-red-200">
                      <div className="text-2xl font-bold text-red-600">{item.grades[2]}</div>
                      <div className="text-xs text-red-600 mt-1">Двойки</div>
                      <div className="text-xs text-muted-foreground">
                        {item.count > 0 ? ((item.grades[2] / item.count) * 100).toFixed(0) : 0}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-green-500 via-blue-500 to-orange-500 h-4 rounded-full transition-all"
                      style={{ width: `${(parseFloat(item.average) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherStatistics;
