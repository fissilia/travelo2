import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Calendar, Users, Plane, Hotel, Train, Car, 
  Search, Minus, Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAppContext } from '@/hooks/useAppContext';
import type { BookingType } from '@/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const bookingTypes = [
  { id: 'hotel' as BookingType, label: 'Отели', icon: Hotel },
  { id: 'flight' as BookingType, label: 'Авиа', icon: Plane },
  { id: 'train' as BookingType, label: 'Ж/Д', icon: Train },
  { id: 'vehicle' as BookingType, label: 'Аренда', icon: Car },
];

export function SearchBar() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useAppContext();
  
  const [activeType, setActiveType] = useState<BookingType>(searchQuery.type);
  const [destination, setDestination] = useState(searchQuery.destination);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: searchQuery.dates.from,
    to: searchQuery.dates.to,
  });
  const [guests, setGuests] = useState(searchQuery.guests);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const handleSearch = () => {
    setSearchQuery({
      type: activeType,
      destination,
      dates: dateRange,
      guests,
    });
    navigate(`/search/${activeType}?destination=${encodeURIComponent(destination)}`);
  };

  const updateGuests = (type: 'adults' | 'children', delta: number) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : 0, prev[type] + delta),
    }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Booking Type Tabs */}
      <div className="flex justify-center gap-2 mb-6">
        {bookingTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeType === type.id
                ? 'bg-white text-coral-dark shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <type.icon className="w-4 h-4" />
            {type.label}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-2">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Destination */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={
                  activeType === 'hotel' ? 'Куда хотите поехать?' :
                  activeType === 'flight' ? 'Откуда - Куда?' :
                  activeType === 'train' ? 'Станция отправления' :
                  'Город получения авто'
                }
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-coral/30"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="flex-1 min-w-0 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Даты</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {dateRange.from ? (
                        dateRange.to ? (
                          `${format(dateRange.from, 'd MMM', { locale: ru })} - ${format(dateRange.to, 'd MMM', { locale: ru })}`
                        ) : (
                          format(dateRange.from, 'd MMM', { locale: ru })
                        )
                      ) : (
                        'Выберите даты'
                      )}
                    </p>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => {
                    setDateRange({
                      from: range?.from,
                      to: range?.to,
                    });
                  }}
                  numberOfMonths={2}
                  locale={ru}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div className="flex-1 min-w-0 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Гости</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {guests.adults + guests.children} {getGuestText(guests.adults + guests.children)}
                    </p>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Взрослые</p>
                      <p className="text-sm text-gray-500">Старше 12 лет</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateGuests('adults', -1)}
                        disabled={guests.adults <= 1}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-medium">{guests.adults}</span>
                      <button
                        onClick={() => updateGuests('adults', 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Дети</p>
                      <p className="text-sm text-gray-500">До 12 лет</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateGuests('children', -1)}
                        disabled={guests.children <= 0}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-medium">{guests.children}</span>
                      <button
                        onClick={() => updateGuests('children', 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <Button 
                    className="w-full btn-coral" 
                    onClick={() => setIsGuestsOpen(false)}
                  >
                    Готово
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <div className="lg:w-auto">
            <Button 
              onClick={handleSearch}
              className="w-full lg:w-auto h-full px-8 btn-coral rounded-xl"
            >
              <Search className="w-5 h-5 mr-2" />
              Найти
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGuestText(count: number): string {
  if (count === 1) return 'гость';
  if (count >= 2 && count <= 4) return 'гостя';
  return 'гостей';
}
