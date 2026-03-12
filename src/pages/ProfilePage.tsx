import { useState } from 'react';
import { 
  User, Mail, Phone, Calendar, CreditCard, 
  Bell, Moon, Globe, ChevronRight, Edit2, Camera,
  Shield, LogOut, LockIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/hooks/useAppContext';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUserPreferences } = useAppContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Войдите в аккаунт</h1>
          <Button onClick={() => navigate('/login')} className="btn-coral">
            Войти
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // In a real app, this would update the user profile
    setIsEditing(false);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !user.preferences.darkMode;
    updateUserPreferences({ darkMode: newDarkMode });
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const toggleNotifications = () => {
    updateUserPreferences({ notifications: !user.preferences.notifications });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              {/* Profile Header */}
              <div className="p-6 text-center border-b border-gray-100 dark:border-gray-700">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-coral text-white text-2xl">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-coral rounded-full flex items-center justify-center text-white hover:bg-coral-dark transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <p className="text-gray-400 text-xs mt-1">
                  На Travelo с {user.createdAt.toLocaleDateString('ru-RU')}
                </p>
              </div>

              {/* Navigation */}
              <nav className="p-4">
                <button 
                  onClick={() => navigate('/bookings')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <Calendar className="w-5 h-5 text-coral" />
                  <span>Мои бронирования</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </button>
                <button 
                  onClick={() => navigate('/favorites')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <User className="w-5 h-5 text-coral" />
                  <span>Избранное</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </button>
                <button 
                  onClick={() => navigate('/chat')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <User className="w-5 h-5 text-coral" />
                  <span>AI Помощник</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </button>
                <Separator className="my-2" />
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Выйти</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <TabsList className="w-full justify-start rounded-t-xl border-b border-gray-100 dark:border-gray-700 p-0">
                <TabsTrigger value="profile" className="rounded-none px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-coral">Профиль</TabsTrigger>
                <TabsTrigger value="preferences" className="rounded-none px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-coral">Настройки</TabsTrigger>
                <TabsTrigger value="security" className="rounded-none px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-coral">Безопасность</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Личная информация</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  >
                    {isEditing ? 'Сохранить' : (
                      <>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Редактировать
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">Имя</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="lastName">Фамилия</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                <h3 className="text-lg font-semibold mb-4">Интересы</h3>
                <div className="flex flex-wrap gap-2">
                  {['Пляжный отдых', 'Горнолыжный спорт', 'Экскурсии', 'Шопинг', 'Гастрономия', 'Активный отдых'].map((interest) => (
                    <span
                      key={interest}
                      className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors ${
                        user.preferences.interests.includes(interest.toLowerCase())
                          ? 'bg-coral text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="p-6">
                <h3 className="text-lg font-semibold mb-6">Настройки приложения</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Bell className="w-5 h-5 text-coral" />
                      </div>
                      <div>
                        <p className="font-medium">Уведомления</p>
                        <p className="text-sm text-gray-500">Получать push-уведомления</p>
                      </div>
                    </div>
                    <Switch
                      checked={user.preferences.notifications}
                      onCheckedChange={toggleNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Moon className="w-5 h-5 text-coral" />
                      </div>
                      <div>
                        <p className="font-medium">Темная тема</p>
                        <p className="text-sm text-gray-500">Использовать темную тему</p>
                      </div>
                    </div>
                    <Switch
                      checked={user.preferences.darkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-coral" />
                      </div>
                      <div>
                        <p className="font-medium">Язык</p>
                        <p className="text-sm text-gray-500">Русский</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Изменить</Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-coral" />
                      </div>
                      <div>
                        <p className="font-medium">Валюта</p>
                        <p className="text-sm text-gray-500">Российский рубль (₽)</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Изменить</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="p-6">
                <h3 className="text-lg font-semibold mb-6">Безопасность</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">Двухфакторная аутентификация</p>
                          <p className="text-sm text-gray-500">Дополнительная защита аккаунта</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Включить</Button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <LockIcon className="w-5 h-5 text-coral" />
                        <div>
                          <p className="font-medium">Изменить пароль</p>
                          <p className="text-sm text-gray-500">Последнее изменение: 3 месяца назад</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Изменить</Button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-coral" />
                        <div>
                          <p className="font-medium">Способы оплаты</p>
                          <p className="text-sm text-gray-500">2 привязанные карты</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Управлять</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
