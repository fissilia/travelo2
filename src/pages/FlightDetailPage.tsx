import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plane, Clock, Luggage, Utensils, Wifi, Monitor, 
  ChevronLeft, Check, Info, Armchair
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { flights } from '@/data/mockData';
import { useAppContext } from '@/hooks/useAppContext';

const classOptions = [
  { id: 'economy', name: 'Эконом', multiplier: 1 },
  { id: 'business', name: 'Бизнес', multiplier: 2.5 },
  { id: 'first', name: 'Первый класс', multiplier: 4 },
];

export function FlightDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useAppContext();
  
  const flight = flights.find(f => f.id === id);
  const [selectedClass, setSelectedClass] = useState(flight?.class || 'economy');
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Рейс не найден</h1>
          <Button onClick={() => navigate('/search/flight')}>Вернуться к поиску</Button>
        </div>
      </div>
    );
  }

  const selectedClassData = classOptions.find(c => c.id === selectedClass);
  const basePrice = flight.price;
  const classMultiplier = selectedClassData?.multiplier || 1;
  const pricePerPerson = Math.round(basePrice * classMultiplier);
  const totalPrice = pricePerPerson * (passengers.adults + passengers.children * 0.5);

  const handleBook = () => {
    const flightWithClass = { ...flight, class: selectedClass as 'economy' | 'business' | 'first' };
    addToCart(flightWithClass, 'flight', { 
      departure: flight.departure.time,
      arrival: flight.arrival.time 
    }, passengers);
    navigate('/checkout');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
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
            {/* Flight Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <Plane className="w-8 h-8 text-coral" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">{flight.airline}</h1>
                    <p className="text-gray-500">{flight.flightNumber}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {flight.refundable ? 'Возвратный' : 'Невозвратный'}
                </Badge>
              </div>

              {/* Route */}
              <div className="flex items-center justify-between py-6 border-y border-gray-100 dark:border-gray-700">
                <div className="text-center">
                  <p className="text-3xl font-bold">{formatTime(flight.departure.time)}</p>
                  <p className="text-gray-500">{flight.departure.code}</p>
                  <p className="text-sm text-gray-400">{flight.departure.city}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(flight.departure.time)}</p>
                </div>

                <div className="flex-1 px-8">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <Clock className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                      <p className="text-sm text-gray-500">{formatDuration(flight.duration)}</p>
                    </div>
                  </div>
                  <div className="relative mt-2">
                    <div className="h-px bg-gray-300 w-full" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-coral rounded-full" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-coral rounded-full" />
                    <Plane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-coral" />
                  </div>
                  <p className="text-center text-sm text-coral mt-2">
                    {flight.stops === 0 ? 'Прямой рейс' : `${flight.stops} пересадка`}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold">{formatTime(flight.arrival.time)}</p>
                  <p className="text-gray-500">{flight.arrival.code}</p>
                  <p className="text-sm text-gray-400">{flight.arrival.city}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(flight.arrival.time)}</p>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">На борту</h3>
                <div className="flex flex-wrap gap-3">
                  {flight.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="px-3 py-1">
                      {amenity === 'meal' && <Utensils className="w-4 h-4 mr-1" />}
                      {amenity === 'wifi' && <Wifi className="w-4 h-4 mr-1" />}
                      {amenity === 'entertainment' && <Monitor className="w-4 h-4 mr-1" />}
                      {amenity === 'lounge' && <Armchair className="w-4 h-4 mr-1" />}
                      {getAmenityLabel(amenity)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Baggage */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Luggage className="w-5 h-5 text-coral" />
                  <h3 className="font-semibold">Багаж</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Ручная кладь: {flight.baggage.carryOn ? 'включена' : 'не включена'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Багаж: {flight.baggage.checked} кг</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Class Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Выберите класс обслуживания</h3>
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
                          {option.id === 'economy' && 'Стандартный комфорт'}
                          {option.id === 'business' && 'Повышенный комфорт, питание, бизнес-зал'}
                          {option.id === 'first' && 'Максимальный комфорт, VIP-зал'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-coral-dark">
                        {Math.round(basePrice * option.multiplier).toLocaleString()} ₽
                      </p>
                      <p className="text-sm text-gray-500">за человека</p>
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
                  <Label>Дети (2-11)</Label>
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
                  <span className="text-gray-600">Тариф ({selectedClassData?.name})</span>
                  <span>{pricePerPerson.toLocaleString()} ₽ × {passengers.adults}</span>
                </div>
                {passengers.children > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Дети (50%)</span>
                    <span>{Math.round(pricePerPerson * 0.5).toLocaleString()} ₽ × {passengers.children}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Сборы</span>
                  <span>{Math.round(totalPrice * 0.05).toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Налоги</span>
                  <span>{Math.round(totalPrice * 0.1).toLocaleString()} ₽</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Итого</span>
                <span className="text-coral-dark">{Math.round(totalPrice * 1.15).toLocaleString()} ₽</span>
              </div>

              <Button onClick={handleBook} className="w-full btn-coral">
                Забронировать
              </Button>

              <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Info className="w-5 h-5 text-blue-500" />
                <p className="text-xs text-blue-600">
                  Бронирование без комиссии. Отмена возможна за 24 часа до вылета.
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
    entertainment: 'Развлечения',
    lounge: 'Бизнес-зал',
  };
  return labels[amenity] || amenity;
}
