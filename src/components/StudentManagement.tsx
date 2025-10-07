import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

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

type StudentManagementProps = {
  students: Student[];
  classes: Class[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
};

const avatarOptions = ['👨‍🎓', '👩‍🎓', '🧑‍🎓', '👦', '👧', '🧒', '😊', '🤓', '🎒', '📚'];

const StudentManagement = ({ students, classes, onAddStudent }: StudentManagementProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classId, setClassId] = useState('');
  const [avatar, setAvatar] = useState(avatarOptions[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && password.trim() && classId) {
      onAddStudent({ name, email, password, classId, avatar });
      setName('');
      setEmail('');
      setPassword('');
      setClassId('');
      setAvatar(avatarOptions[0]);
      toast.success('Ученик успешно добавлен');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Добавить ученика</CardTitle>
          <CardDescription>Создайте профиль для нового ученика</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="studentName">Имя ученика</Label>
                <Input
                  id="studentName"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentClass">Класс</Label>
                <Select value={classId} onValueChange={setClassId} required>
                  <SelectTrigger id="studentClass">
                    <SelectValue placeholder="Выберите класс" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentEmail">Email / Логин</Label>
                <Input
                  id="studentEmail"
                  type="text"
                  placeholder="ivanov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentPassword">Пароль</Label>
                <Input
                  id="studentPassword"
                  type="text"
                  placeholder="password123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Аватар</Label>
              <div className="flex gap-2 flex-wrap">
                {avatarOptions.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`text-3xl w-14 h-14 rounded-lg border-2 transition-all ${
                      avatar === av
                        ? 'border-primary bg-primary/10 scale-110'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={classes.length === 0}>
              <Icon name="UserPlus" size={16} className="mr-2" />
              Добавить ученика
            </Button>
            {classes.length === 0 && (
              <p className="text-sm text-destructive text-center">
                Сначала создайте хотя бы один класс
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список учеников</CardTitle>
          <CardDescription>Всего учеников: {students.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Ученики пока не добавлены
            </p>
          ) : (
            <div className="space-y-3">
              {students.map((student) => {
                const studentClass = classes.find(c => c.id === student.classId);
                return (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{student.avatar || '👨‍🎓'}</div>
                      <div>
                        <h4 className="font-semibold text-lg">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {studentClass?.name} • {student.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Логин для входа:</p>
                      <p className="font-mono font-semibold">{student.email}</p>
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

export default StudentManagement;
