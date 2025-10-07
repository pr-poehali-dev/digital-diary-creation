import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Class = {
  id: string;
  name: string;
  teacherId: string;
};

type ClassManagementProps = {
  classes: Class[];
  onAddClass: (name: string) => void;
};

const ClassManagement = ({ classes, onAddClass }: ClassManagementProps) => {
  const [className, setClassName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (className.trim()) {
      onAddClass(className);
      setClassName('');
      toast.success('Класс успешно создан');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Создать новый класс</CardTitle>
          <CardDescription>Добавьте новый класс в систему</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="className" className="sr-only">
                Название класса
              </Label>
              <Input
                id="className"
                placeholder="Например: 9А, 10Б, 11В"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
              />
            </div>
            <Button type="submit">
              <Icon name="Plus" size={16} className="mr-2" />
              Создать класс
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список классов</CardTitle>
          <CardDescription>Всего классов: {classes.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {classes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Классы пока не созданы
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Users" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{cls.name}</h3>
                      <p className="text-sm text-muted-foreground">Класс</p>
                    </div>
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

export default ClassManagement;
