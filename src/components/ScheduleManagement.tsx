import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Class = {
  id: string;
  name: string;
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

type ScheduleManagementProps = {
  classes: Class[];
  schedules: Schedule[];
  homework: Homework[];
  onAddSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  onAddHomework: (homework: Omit<Homework, 'id'>) => void;
};

const weekDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

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

const ScheduleManagement = ({
  classes,
  schedules,
  homework,
  onAddSchedule,
  onAddHomework
}: ScheduleManagementProps) => {
  const [scheduleClassId, setScheduleClassId] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [subject, setSubject] = useState('');

  const [hwClassId, setHwClassId] = useState('');
  const [hwSubject, setHwSubject] = useState('');
  const [hwDescription, setHwDescription] = useState('');
  const [hwDueDate, setHwDueDate] = useState('');

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scheduleClassId && day && time && subject) {
      onAddSchedule({ classId: scheduleClassId, day, time, subject });
      setScheduleClassId('');
      setDay('');
      setTime('');
      setSubject('');
      toast.success('Урок добавлен в расписание');
    }
  };

  const handleHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hwClassId && hwSubject && hwDescription && hwDueDate) {
      onAddHomework({
        classId: hwClassId,
        subject: hwSubject,
        description: hwDescription,
        dueDate: hwDueDate
      });
      setHwClassId('');
      setHwSubject('');
      setHwDescription('');
      setHwDueDate('');
      toast.success('Домашнее задание добавлено');
    }
  };

  return (
    <Tabs defaultValue="schedule" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="schedule">Расписание</TabsTrigger>
        <TabsTrigger value="homework">Домашние задания</TabsTrigger>
      </TabsList>

      <TabsContent value="schedule" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Добавить урок</CardTitle>
            <CardDescription>Создайте расписание для класса</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scheduleClass">Класс</Label>
                  <Select value={scheduleClassId} onValueChange={setScheduleClassId} required>
                    <SelectTrigger id="scheduleClass">
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
                  <Label htmlFor="scheduleDay">День недели</Label>
                  <Select value={day} onValueChange={setDay} required>
                    <SelectTrigger id="scheduleDay">
                      <SelectValue placeholder="Выберите день" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDays.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduleTime">Время</Label>
                  <Input
                    id="scheduleTime"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduleSubject">Предмет</Label>
                  <Select value={subject} onValueChange={setSubject} required>
                    <SelectTrigger id="scheduleSubject">
                      <SelectValue placeholder="Выберите предмет" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subj) => (
                        <SelectItem key={subj} value={subj}>
                          {subj}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={classes.length === 0}>
                <Icon name="Calendar" size={16} className="mr-2" />
                Добавить урок
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Расписание уроков</CardTitle>
            <CardDescription>Всего уроков: {schedules.length}</CardDescription>
          </CardHeader>
          <CardContent>
            {schedules.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Расписание пока не добавлено
              </p>
            ) : (
              <div className="space-y-6">
                {classes.map((cls) => {
                  const classSchedules = schedules.filter(s => s.classId === cls.id);
                  if (classSchedules.length === 0) return null;

                  return (
                    <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-bold text-xl mb-4">Класс {cls.name}</h3>
                      <div className="space-y-4">
                        {weekDays.map(d => {
                          const daySchedules = classSchedules.filter(s => s.day === d);
                          if (daySchedules.length === 0) return null;

                          return (
                            <div key={d} className="border-l-4 border-primary pl-4">
                              <h4 className="font-semibold mb-2">{d}</h4>
                              <div className="space-y-2">
                                {daySchedules
                                  .sort((a, b) => a.time.localeCompare(b.time))
                                  .map(schedule => (
                                    <div
                                      key={schedule.id}
                                      className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                                    >
                                      <span className="text-sm font-semibold text-primary min-w-[60px]">
                                        {schedule.time}
                                      </span>
                                      <span className="font-medium">{schedule.subject}</span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="homework" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Добавить домашнее задание</CardTitle>
            <CardDescription>Назначьте задание классу</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleHomeworkSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hwClass">Класс</Label>
                  <Select value={hwClassId} onValueChange={setHwClassId} required>
                    <SelectTrigger id="hwClass">
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
                  <Label htmlFor="hwSubject">Предмет</Label>
                  <Select value={hwSubject} onValueChange={setHwSubject} required>
                    <SelectTrigger id="hwSubject">
                      <SelectValue placeholder="Выберите предмет" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subj) => (
                        <SelectItem key={subj} value={subj}>
                          {subj}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hwDescription">Описание задания</Label>
                <Textarea
                  id="hwDescription"
                  placeholder="Учебник стр. 45-50, упражнения 1-5"
                  value={hwDescription}
                  onChange={(e) => setHwDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hwDueDate">Срок сдачи</Label>
                <Input
                  id="hwDueDate"
                  type="date"
                  value={hwDueDate}
                  onChange={(e) => setHwDueDate(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={classes.length === 0}>
                <Icon name="BookOpen" size={16} className="mr-2" />
                Добавить задание
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Список заданий</CardTitle>
            <CardDescription>Всего заданий: {homework.length}</CardDescription>
          </CardHeader>
          <CardContent>
            {homework.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Домашние задания пока не добавлены
              </p>
            ) : (
              <div className="space-y-3">
                {homework.map((hw) => {
                  const cls = classes.find(c => c.id === hw.classId);
                  return (
                    <div
                      key={hw.id}
                      className="p-4 border border-gray-200 rounded-lg bg-white"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-lg">{hw.subject}</h4>
                          <p className="text-sm text-muted-foreground">Класс: {cls?.name}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">Срок:</p>
                          <p className="font-semibold">
                            {new Date(hw.dueDate).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm mt-2 p-3 bg-gray-50 rounded">{hw.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ScheduleManagement;
