import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Gauge, Fuel, Users, Briefcase, Shield, 
  ChevronLeft, Check, Info, Wind, Bluetooth, MapPin,
  Camera, Sun, Flame, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { vehicles } from '@/data/mockData';
import { useAppContext } from '@/hooks/useAppContext';
import { addDays, differenceInDays } from 'date-fns';

const insuranceOptions = [
  { id: 'basic', name: 'Базовая', price: 0, description: 'Стандартная страховка включена' },
  { id: 'full', name: 'Полная', price: 1500, description: 'Полное покрытие без франшизы' },
  { id: 'super', name: 'Супер', price: 3000, description: 'Полное покрытие + помощь на дороге 24/7' },
];

const extras = [
  { id: 'gps', name: 'GPS-навигатор', price: 300, icon: MapPin },
  { id: 'child_seat', name: 'Детское кресло', price: 400, icon: Users },
  { id: 'additional_driver', name: 'Дополнительный водитель', price: 500, icon: Users },
];

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useAppContext();
  
  const vehicle = vehicles.find(v => v.id === id);
  const [pickupDate, setPickupDate] = useState<Date>(new Date());
  const [dropoffDate, setDropoffDate] = useState<Date>(addDays(new Date(), 3));
  const [selectedInsurance, setSelectedInsurance] = useState('basic');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Транспорт не найден</h1>
          <Button onClick={() => navigate('/search/vehicle')}>Вернуться к поиску</Button>
        </div>
      </div>
    );
  }

  const rentalDays = Math.max(1, differenceInDays(dropoffDate, pickupDate));
  const basePrice = vehicle.pricePerDay * rentalDays;
  const insuranceData = insuranceOptions.find(i => i.id === selectedInsurance);
  const insurancePrice = (insuranceData?.price || 0) * rentalDays;
  const extrasPrice = selectedExtras.reduce((sum, extraId) => {
    const extra = extras.find(e => e.id === extraId);
    return sum + (extra?.price || 0) * rentalDays;
  }, 0);
  const totalPrice = basePrice + insurancePrice + extrasPrice;

  const handleBook = () => {
    addToCart(vehicle, 'vehicle', { 
      pickup: pickupDate,
      dropoff: dropoffDate
    });
    navigate('/checkout');
  };

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraId) 
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  const getFeatureIcon = (feature: string) => {
    const icons: Record<string, React.ElementType> = {
      ac: Wind,
      bluetooth: Bluetooth,
      gps: MapPin,
      'cruise-control': Gauge,
      'backup-camera': Camera,
      leather: Briefcase,
      sunroof: Sun,
      'heated-seats': Flame,
    };
    return icons[feature] || Check;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
            Назад к результатам
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Image & Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
              <div className="h-64 md:h-80 relative">
                <img
                  src={vehicle.images[0]}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white/80 text-sm">{vehicle.provider}</p>
                      <h1 className="text-2xl md:text-3xl font-bold text-white">
                        {vehicle.brand} {vehicle.model}
                      </h1>
                      <p className="text-white/80">{vehicle.year} год</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-white">{vehicle.pricePerDay.toLocaleString()} ₽</p>
                      <p className="text-white/80 text-sm">в сутки</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Gauge className="w-5 h-5 text-coral" />
                    <div>
                      <p className="text-xs text-gray-500">КПП</p>
                      <p className="font-medium">{vehicle.transmission === 'automatic' ? 'Автомат' : 'Механика'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Fuel className="w-5 h-5 text-coral" />
                    <div>
                      <p className="text-xs text-gray-500">Топливо</p>
                      <p className="font-medium">{getFuelLabel(vehicle.fuel)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Users className="w-5 h-5 text-coral" />
                    <div>
                      <p className="text-xs text-gray-500">Мест</p>
                      <p className="font-medium">{vehicle.seats}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Briefcase className="w-5 h-5 text-coral" />
                    <div>
                      <p className="text-xs text-gray-500">Багаж</p>
                      <p className="font-medium">{vehicle.luggage} чемодана</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Даты аренды</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block">Получение</Label>
                  <CalendarComponent
                    mode="single"
                    selected={pickupDate}
                    onSelect={(date) => date && setPickupDate(date)}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Возврат</Label>
                  <CalendarComponent
                    mode="single"
                    selected={dropoffDate}
                    onSelect={(date) => date && setDropoffDate(date)}
                    disabled={(date) => date <= pickupDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-coral/5 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Срок аренды:</span>
                  <span className="font-semibold">{rentalDays} {getDaysText(rentalDays)}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Особенности</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {vehicle.features.map((feature) => {
                  const Icon = getFeatureIcon(feature);
                  return (
                    <div key={feature} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Icon className="w-5 h-5 text-coral" />
                      <span className="text-sm">{getFeatureLabel(feature)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Insurance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-coral" />
                <h3 className="text-lg font-semibold">Страхование</h3>
              </div>
              <div className="space-y-3">
                {insuranceOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedInsurance === option.id
                        ? 'border-coral bg-coral/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-coral/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="insurance"
                        value={option.id}
                        checked={selectedInsurance === option.id}
                        onChange={() => setSelectedInsurance(option.id)}
                        className="w-4 h-4 text-coral"
                      />
                      <div>
                        <p className="font-semibold">{option.name}</p>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-coral-dark">
                        {option.price > 0 ? `+${option.price.toLocaleString()} ₽/сутки` : 'Включено'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Дополнительно</h3>
              <div className="space-y-3">
                {extras.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-coral/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedExtras.includes(extra.id)}
                        onCheckedChange={() => toggleExtra(extra.id)}
                      />
                      <div className="flex items-center gap-2">
                        <extra.icon className="w-5 h-5 text-coral" />
                        <span className="font-medium">{extra.name}</span>
                      </div>
                    </div>
                    <span className="font-bold text-coral-dark">+{extra.price.toLocaleString()} ₽/сутки</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pickup Location */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Место получения</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-coral mt-0.5" />
                  <div>
                    <p className="font-medium">{vehicle.pickupLocation.address}</p>
                    <p className="text-sm text-gray-500">{vehicle.pickupLocation.city}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <p className="text-sm text-yellow-700">
                    Минимальный возраст водителя: {vehicle.minAge} лет
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  <p className="text-sm text-blue-700">
                    Залог: {vehicle.deposit.toLocaleString()} ₽ (блокируется на карте, возвращается после сдачи авто)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold mb-4">Итого к оплате</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Аренда ({rentalDays} {getDaysText(rentalDays)})</span>
                  <span>{basePrice.toLocaleString()} ₽</span>
                </div>
                {insurancePrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Страхование ({insuranceData?.name})</span>
                    <span>{insurancePrice.toLocaleString()} ₽</span>
                  </div>
                )}
                {extrasPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Дополнительно</span>
                    <span>{extrasPrice.toLocaleString()} ₽</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Залог (возвращается)</span>
                  <span>{vehicle.deposit.toLocaleString()} ₽</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-xl font-bold mb-2">
                <span>Итого</span>
                <span className="text-coral-dark">{totalPrice.toLocaleString()} ₽</span>
              </div>
              <p className="text-xs text-gray-500 mb-6">+ залог {vehicle.deposit.toLocaleString()} ₽</p>

              <Button onClick={handleBook} className="w-full btn-coral">
                Забронировать
              </Button>

              <div className="flex items-center gap-2 mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Check className="w-5 h-5 text-green-500" />
                <p className="text-xs text-green-600">
                  Бесплатная отмена за 24 часа до получения
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getFuelLabel(fuel: string): string {
  const labels: Record<string, string> = {
    petrol: 'Бензин',
    diesel: 'Дизель',
    electric: 'Электро',
    hybrid: 'Гибрид',
  };
  return labels[fuel] || fuel;
}

function getFeatureLabel(feature: string): string {
  const labels: Record<string, string> = {
    ac: 'Кондиционер',
    bluetooth: 'Bluetooth',
    gps: 'GPS-навигатор',
    'cruise-control': 'Круиз-контроль',
    'backup-camera': 'Камера заднего вида',
    leather: 'Кожаный салон',
    sunroof: 'Люк',
    'heated-seats': 'Подогрев сидений',
    helmet: 'Шлем',
    'top-case': 'Кофр',
    'phone-mount': 'Держатель для телефона',
    'app-control': 'Управление через приложение',
    tv: 'ТВ',
    fridge: 'Холодильник',
  };
  return labels[feature] || feature;
}

function getDaysText(days: number): string {
  if (days === 1) return 'день';
  if (days >= 2 && days <= 4) return 'дня';
  return 'дней';
}
