import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

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

type AdminTeacherManagementProps = {
  teachers: Teacher[];
  classes: Class[];
  onAddTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  onUpdateTeacher: (teacherId: string, updates: Partial<Teacher>) => void;
  onDeleteTeacher: (teacherId: string) => void;
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

const avatarOptions = ['👨‍🏫', '👩‍🏫', '🧑‍🏫', '👨', '👩', '🧑', '😊', '🤓', '📚'];

const AdminTeacherManagement = ({
  teachers,
  classes,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher
}: AdminTeacherManagementProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [avatar, setAvatar] = useState(avatarOptions[0]);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && password.trim() && selectedSubjects.length > 0) {
      onAddTeacher({
        name,
        email,
        password,
        subjects: selectedSubjects,
        classIds: selectedClasses,
        avatar
      });
      setName('');
      setEmail('');
      setPassword('');
      setSelectedSubjects([]);
      setSelectedClasses([]);
      setAvatar(avatarOptions[0]);
      toast.success('Учитель успешно добавлен');
    } else {
      toast.error('Заполните все поля и выберите хотя бы один предмет');
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (editingTeacher) {
      onUpdateTeacher(editingTeacher.id, {
        name: editingTeacher.name,
        subjects: editingTeacher.subjects,
        classIds: editingTeacher.classIds,
        avatar: editingTeacher.avatar
      });
      setIsEditDialogOpen(false);
      setEditingTeacher(null);
      toast.success('Данные учителя обновлены');
    }
  };

  const handleDelete = (teacherId: string, teacherName: string) => {
    if (confirm(`Вы уверены, что хотите удалить учителя ${teacherName}?`)) {
      onDeleteTeacher(teacherId);
      toast.success('Учитель удалён');
    }
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const toggleClass = (classId: string) => {
    setSelectedClasses(prev =>
      prev.includes(classId) ? prev.filter(id => id !== classId) : [...prev, classId]
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Добавить учителя</CardTitle>
          <CardDescription>Создайте профиль для нового учителя</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="teacherName">Имя учителя</Label>
                <Input
                  id="teacherName"
                  placeholder="Иван Иванович"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherEmail">Логин</Label>
                <Input
                  id="teacherEmail"
                  type="text"
                  placeholder="ivanov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherPassword">Пароль</Label>
                <Input
                  id="teacherPassword"
                  type="text"
                  placeholder="password123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Предметы учителя (выберите хотя бы один)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg">
                {subjects.map(subject => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${subject}`}
                      checked={selectedSubjects.includes(subject)}
                      onCheckedChange={() => toggleSubject(subject)}
                    />
                    <label
                      htmlFor={`subject-${subject}`}
                      className="text-sm cursor-pointer"
                    >
                      {subject}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {classes.length > 0 && (
              <div className="space-y-2">
                <Label>Классы учителя (необязательно)</Label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 p-4 border rounded-lg">
                  {classes.map(cls => (
                    <div key={cls.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`class-${cls.id}`}
                        checked={selectedClasses.includes(cls.id)}
                        onCheckedChange={() => toggleClass(cls.id)}
                      />
                      <label
                        htmlFor={`class-${cls.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {cls.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            <Button type="submit" className="w-full">
              <Icon name="UserPlus" size={16} className="mr-2" />
              Добавить учителя
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список учителей</CardTitle>
          <CardDescription>Всего учителей: {teachers.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Учителя пока не добавлены
            </p>
          ) : (
            <div className="space-y-3">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-4xl">{teacher.avatar || '👨‍🏫'}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{teacher.name}</h4>
                      <p className="text-sm text-muted-foreground">Логин: {teacher.email}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {teacher.subjects.map(subject => (
                          <span
                            key={subject}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                      {teacher.classIds.length > 0 && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          Классы: {teacher.classIds.map(id => classes.find(c => c.id === id)?.name).filter(Boolean).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={isEditDialogOpen && editingTeacher?.id === teacher.id} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(teacher)}
                        >
                          <Icon name="Edit" size={16} className="mr-2" />
                          Изменить
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Редактировать учителя</DialogTitle>
                          <DialogDescription>
                            Измените данные учителя {teacher.name}
                          </DialogDescription>
                        </DialogHeader>
                        {editingTeacher && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Имя</Label>
                              <Input
                                value={editingTeacher.name}
                                onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Предметы</Label>
                              <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg">
                                {subjects.map(subject => (
                                  <div key={subject} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`edit-subject-${subject}`}
                                      checked={editingTeacher.subjects.includes(subject)}
                                      onCheckedChange={() => {
                                        const newSubjects = editingTeacher.subjects.includes(subject)
                                          ? editingTeacher.subjects.filter(s => s !== subject)
                                          : [...editingTeacher.subjects, subject];
                                        setEditingTeacher({ ...editingTeacher, subjects: newSubjects });
                                      }}
                                    />
                                    <label htmlFor={`edit-subject-${subject}`} className="text-sm cursor-pointer">
                                      {subject}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {classes.length > 0 && (
                              <div className="space-y-2">
                                <Label>Классы</Label>
                                <div className="grid grid-cols-3 gap-2 p-3 border rounded-lg">
                                  {classes.map(cls => (
                                    <div key={cls.id} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`edit-class-${cls.id}`}
                                        checked={editingTeacher.classIds.includes(cls.id)}
                                        onCheckedChange={() => {
                                          const newClasses = editingTeacher.classIds.includes(cls.id)
                                            ? editingTeacher.classIds.filter(id => id !== cls.id)
                                            : [...editingTeacher.classIds, cls.id];
                                          setEditingTeacher({ ...editingTeacher, classIds: newClasses });
                                        }}
                                      />
                                      <label htmlFor={`edit-class-${cls.id}`} className="text-sm cursor-pointer">
                                        {cls.name}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <Button onClick={handleUpdate} className="w-full">
                              Сохранить изменения
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(teacher.id, teacher.name)}
                    >
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Удалить
                    </Button>
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

export default AdminTeacherManagement;
