import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type User = {
  id: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
  name: string;
  avatar?: string;
};

type ProfileSettingsProps = {
  user: User;
  onUpdateProfile: (avatar: string, name: string) => void;
};

const avatarOptions = [
  '👨‍🏫', '👩‍🏫', '🧑‍🏫',
  '👨‍🎓', '👩‍🎓', '🧑‍🎓',
  '👨', '👩', '🧑',
  '😊', '😄', '🤓', '😎',
  '🎒', '📚', '📖', '✏️'
];

const ProfileSettings = ({ user, onUpdateProfile }: ProfileSettingsProps) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || '👨‍🏫');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(avatar, name);
    toast.success('Профиль успешно обновлен');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки профиля</CardTitle>
        <CardDescription>Персонализируйте ваш профиль</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg">
            <div className="text-8xl">{avatar}</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {user.role === 'teacher' ? 'Учитель' : 'Ученик'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileName">Имя</Label>
            <Input
              id="profileName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите ваше имя"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Выберите аватар</Label>
            <div className="grid grid-cols-8 gap-3">
              {avatarOptions.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`text-4xl w-16 h-16 rounded-lg border-2 transition-all hover:scale-110 ${
                    avatar === av
                      ? 'border-primary bg-primary/10 scale-110 shadow-lg'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить изменения
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Icon name="Info" size={16} />
            Учетные данные
          </h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Логин:</span>{' '}
              <span className="font-mono font-semibold">{user.email}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Пароль:</span>{' '}
              <span className="font-mono">••••••••</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
