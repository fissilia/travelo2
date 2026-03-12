import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Train, Clock, Utensils, Wifi, Power, Coffee, 
  ChevronLeft, Info, Armchair
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { trains } from '@/data/mockData';
import { useAppContext } from '@/hooks/useAppContext';

const classOptions = [
  { id: 'economy', name: 'Сидячий/Плацкарт', multiplier: 1 },
  { id: 'business', name: 'Купе', multiplier: 1.8 },
  { id: 'first', name: 'СВ/Люкс', multiplier: 3 },
];

const wagonTypes = [
  { id: 'sitting', name: 'Сидячий', price: 0 },
  { id: 'platzkart', name: 'Плацкарт', price: 500 },
  { id: 'kupe', name: 'Купе', price: 1500 },
  { id: 'sv', name: 'СВ', price: 3000 },
];

export function TrainDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useAppContext();
  
  const train = trains.find(t => t.id === id);
  const [selectedClass, setSelectedClass] = useState(train?.class || 'economy');
  const [selectedWagon, setSelectedWagon] = useState('platzkart');
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });

  if (!train) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Поезд не найден</h1>
          <Button onClick={() => navigate('/search/train')}>Вернуться к поиску</Button>
        </div>
      </div>
    );
  }

  const selectedClassData = classOptions.find(c => c.id === selectedClass);
  const selectedWagonData = wagonTypes.find(w => w.id === selectedWagon);
  const basePrice = train.price;
  const classMultiplier = selectedClassData?.multiplier || 1;
  const wagonPrice = selectedWagonData?.price || 0;
  const pricePerPerson = Math.round(basePrice * classMultiplier) + wagonPrice;
  const totalPrice = pricePerPerson * passengers.adults + (pricePerPerson * 0.3 * passengers.children);

  const handleBook = () => {
    const trainWithClass = { ...train, class: selectedClass as 'economy' | 'business' | 'first' };
    addToCart(trainWithClass, 'train', { 
      departure: train.departure.time,
      arrival: train.arrival.time 
    }, passengers);
    navigate('/checkout');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}д ${remainingHours}ч`;
    }
    return `${hours}ч ${mins}м`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' });
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
            {/* Train Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <Train className="w-8 h-8 text-coral" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">{train.trainType}</h1>
                    <p className="text-gray-500">Поезд {train.trainNumber}</p>
                    <p className="text-sm text-gray-400">{train.operator}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {train.refundable ? 'Возвратный' : 'Невозвратный'}
                </Badge>
              </div>

              {/* Route */}
              <div className="flex items-center justify-between py-6 border-y border-gray-100 dark:border-gray-700">
                <div className="text-center">
                  <p className="text-3xl font-bold">{formatTime(train.departure.time)}</p>
                  <p className="text-gray-500">{train.departure.code}</p>
                  <p className="text-sm text-gray-400">{train.departure.city}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(train.departure.time)}</p>
                  {train.departure.platform && (
                    <Badge variant="outline" className="mt-2">Платформа {train.departure.platform}</Badge>
                  )}
                </div>

                <div className="flex-1 px-8">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <Clock className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                      <p className="text-sm text-gray-500">{formatDuration(train.duration)}</p>
                    </div>
                  </div>
                  <div className="relative mt-2">
                    <div className="h-px bg-gray-300 w-full" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-coral rounded-full" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-coral rounded-full" />
                    <Train className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-coral" />
                  </div>
                  <p className="text-center text-sm text-coral mt-2">
                    {train.stops} остановок
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold">{formatTime(train.arrival.time)}</p>
                  <p className="text-gray-500">{train.arrival.code}</p>
                  <p className="text-sm text-gray-400">{train.arrival.city}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(train.arrival.time)}</p>
                  {train.arrival.platform && (
                    <Badge variant="outline" className="mt-2">Платформа {train.arrival.platform}</Badge>
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">В поезде</h3>
                <div className="flex flex-wrap gap-3">
                  {train.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="px-3 py-1">
                      {amenity === 'meal' && <Utensils className="w-4 h-4 mr-1" />}
                      {amenity === 'wifi' && <Wifi className="w-4 h-4 mr-1" />}
                      {amenity === 'bedding' && <Armchair className="w-4 h-4 mr-1" />}
                      {amenity === 'outlets' && <Power className="w-4 h-4 mr-1" />}
                      {amenity === 'dining-car' && <Coffee className="w-4 h-4 mr-1" />}
                      {getAmenityLabel(amenity)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Wagon Type Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Тип вагона</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {wagonTypes.map((wagon) => (
                  <button
                    key={wagon.id}
                    onClick={() => setSelectedWagon(wagon.id)}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      selectedWagon === wagon.id
                        ? 'border-coral bg-coral/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-coral/50'
                    }`}
                  >
                    <p className="font-medium">{wagon.name}</p>
                    <p className="text-sm text-coral-dark mt-1">
                      {wagon.price > 0 ? `+${wagon.price.toLocaleString()} ₽` : 'Базовый'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Class Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Класс обслуживания</h3>
              <RadioGroup value={selectedClass} onValueChange={(value) => setSelectedClass(value as 'economy' | 'business' | 'first')} className="space-y-3">
                {classOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedClass === option.id
                        ? 'border-coral bg-coral/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-coral/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <RadioGroupItem value={option.id} />
                      <div>
                        <p className="font-semibold">{option.name}</p>
                        <p className="text-sm text-gray-500">
                          {option.id === 'economy' && 'Базовый комфорт'}
                          {option.id === 'business' && 'Повышенный комфорт, постельное белье'}
                          {option.id === 'first' && 'Максимальный комфорт, отдельный душ'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-coral-dark">
                        ×{option.multiplier}
                      </p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Passengers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Пассажиры</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Взрослые (12+)</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold w-8 text-center">{passengers.adults}</span>
                    <button
                      onClick={() => setPassengers(p => ({ ...p, adults: p.adults + 1 }))}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <Label>Дети (5-11)</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold w-8 text-center">{passengers.children}</span>
                    <button
                      onClick={() => setPassengers(p => ({ ...p, children: p.children + 1 }))}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Скидка 70%</p>
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
                  <span className="text-gray-600">Базовый тариф</span>
                  <span>{basePrice.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Тип вагона ({selectedWagonData?.name})</span>
                  <span>+{wagonPrice.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Класс ({selectedClassData?.name})</span>
                  <span>×{selectedClassData?.multiplier}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Взрослые</span>
                  <span>{passengers.adults} × {pricePerPerson.toLocaleString()} ₽</span>
                </div>
                {passengers.children > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Дети (-70%)</span>
                    <span>{passengers.children} × {Math.round(pricePerPerson * 0.3).toLocaleString()} ₽</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Сервисный сбор</span>
                  <span>{Math.round(totalPrice * 0.03).toLocaleString()} ₽</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Итого</span>
                <span className="text-coral-dark">{Math.round(totalPrice * 1.03).toLocaleString()} ₽</span>
              </div>

              <Button onClick={handleBook} className="w-full btn-coral">
                Забронировать
              </Button>

              <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Info className="w-5 h-5 text-blue-500" />
                <p className="text-xs text-blue-600">
                  Билеты можно вернуть за 2 часа до отправления.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAmenityLabel(amenity: string): string {
  const labels: Record<string, string> = {
    meal: 'Питание',
    wifi: 'Wi-Fi',
    bedding: 'Постельное белье',
    outlets: 'Розетки',
    'dining-car': 'Вагон-ресторан',
    shower: 'Душ',
    entertainment: 'Развлечения',
  };
  return labels[amenity] || amenity;
}
