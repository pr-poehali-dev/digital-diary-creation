import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type LoginPageProps = {
  onLogin: (email: string, password: string) => boolean;
};

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(email, password);
    if (success) {
      toast.success('Вход выполнен успешно');
    } else {
      toast.error('Неверный логин или пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-2">
            <Icon name="BookOpen" size={40} className="text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">Электронный Журнал Веб</CardTitle>
          <CardDescription className="text-base">
            Введите свои учетные данные для входа
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Логин / Email
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="RomanYarg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold mt-6">
              Войти в систему
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Тестовый доступ:</p>
            <p className="font-mono mt-1">RomanYarg / 1qaz2wsx</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
