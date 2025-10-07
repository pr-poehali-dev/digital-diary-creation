import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

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

type GradeManagementProps = {
  students: Student[];
  grades: Grade[];
  teacherSubjects?: string[];
  onAddGrade: (grade: Omit<Grade, 'id' | 'teacherId'>) => void;
};

const subjects = [
  'Математика',
  'Русский язык',
  'Литература',
  'Английский язык',
  'История',
  'Обществознание',
  'География',
  'Биология',
  'Физика',
  'Химия',
  'Информатика',
  'Физкультура'
];

const GradeManagement = ({ students, grades, teacherSubjects, onAddGrade }: GradeManagementProps) => {
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [gradeValue, setGradeValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const grade = parseInt(gradeValue);
    if (studentId && subject && grade >= 2 && grade <= 5) {
      onAddGrade({
        studentId,
        subject,
        grade,
        date: new Date().toISOString()
      });
      setStudentId('');
      setSubject('');
      setGradeValue('');
      toast.success('Оценка успешно выставлена');
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade === 5) return 'text-green-600 bg-green-50 border-green-200';
    if (grade === 4) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade === 3) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Выставить оценку</CardTitle>
          <CardDescription>Добавьте оценку ученику по предмету</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="gradeStudent">Ученик</Label>
                <Select value={studentId} onValueChange={setStudentId} required>
                  <SelectTrigger id="gradeStudent">
                    <SelectValue placeholder="Выберите ученика" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.avatar} {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gradeSubject">Предмет</Label>
                <Select value={subject} onValueChange={setSubject} required>
                  <SelectTrigger id="gradeSubject">
                    <SelectValue placeholder="Выберите предмет" />
                  </SelectTrigger>
                  <SelectContent>
                    {(teacherSubjects && teacherSubjects.length > 0 ? teacherSubjects : subjects).map((subj) => (
                      <SelectItem key={subj} value={subj}>
                        {subj}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gradeValue">Оценка</Label>
                <Input
                  id="gradeValue"
                  type="number"
                  min="2"
                  max="5"
                  placeholder="5"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={students.length === 0 || (teacherSubjects && teacherSubjects.length === 0)}>
              <Icon name="Award" size={16} className="mr-2" />
              Выставить оценку
            </Button>
            {students.length === 0 && (
              <p className="text-sm text-destructive text-center">
                Нет учеников в ваших классах
              </p>
            )}
            {teacherSubjects && teacherSubjects.length === 0 && (
              <p className="text-sm text-destructive text-center">
                У вас нет назначенных предметов. Обратитесь к администратору.
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Журнал оценок</CardTitle>
          <CardDescription>Всего оценок: {grades.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {grades.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Оценки пока не выставлены
            </p>
          ) : (
            <div className="space-y-3">
              {grades
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((grade) => {
                  const student = students.find(s => s.id === grade.studentId);
                  return (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-3xl">{student?.avatar || '👨‍🎓'}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{student?.name || 'Неизвестный ученик'}</h4>
                          <p className="text-sm text-muted-foreground">{grade.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">
                            {new Date(grade.date).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <div
                          className={`text-3xl font-bold px-6 py-2 rounded-lg border-2 ${getGradeColor(
                            grade.grade
                          )}`}
                        >
                          {grade.grade}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeManagement;