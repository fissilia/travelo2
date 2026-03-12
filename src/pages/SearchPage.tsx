import { useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { 
  MapPin, Star, Filter, SlidersHorizontal, X, 
  Check, ChevronDown, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { hotels, flights, trains, vehicles, amenitiesList } from '@/data/mockData';
import { useAppContext } from '@/hooks/useAppContext';
import type { BookingType, Hotel, Flight, Train, Vehicle } from '@/types';
import { Link } from 'react-router-dom';

const starOptions = [5, 4, 3, 2, 1];
const ratingOptions = [
  { value: 4.5, label: 'Отлично: 4.5+' },
  { value: 4.0, label: 'Очень хорошо: 4.0+' },
  { value: 3.5, label: 'Хорошо: 3.5+' },
];

export function SearchPage() {
  const { type } = useParams<{ type: BookingType }>();
  const [searchParams] = useSearchParams();
  const destination = searchParams.get('destination') || '';
  const { isFavorite, addToFavorites, removeFromFavorites } = useAppContext();

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [instantBooking, setInstantBooking] = useState(false);
  const [freeCancellation, setFreeCancellation] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get items based on type
  const getItems = () => {
    switch (type) {
      case 'hotel':
        return hotels;
      case 'flight':
        return flights;
      case 'train':
        return trains;
      case 'vehicle':
        return vehicles;
      default:
        return hotels;
    }
  };

  const items = getItems();

  // Filter items
  const filteredItems = items.filter((item) => {
    // Price filter
    let itemPrice = 0;
    if (type === 'hotel') itemPrice = (item as Hotel).pricePerNight;
    else if (type === 'flight') itemPrice = (item as Flight).price;
    else if (type === 'train') itemPrice = (item as Train).price;
    else if (type === 'vehicle') itemPrice = (item as Vehicle).pricePerDay;

    if (itemPrice < priceRange[0] || itemPrice > priceRange[1]) return false;

    // Hotel specific filters
    if (type === 'hotel') {
      const hotel = item as Hotel;
      
      if (selectedStars.length > 0 && !selectedStars.includes(hotel.stars)) return false;
      if (selectedRating && hotel.rating < selectedRating) return false;
      if (selectedAmenities.length > 0 && !selectedAmenities.every(a => hotel.amenities.includes(a))) return false;
      if (instantBooking && !hotel.instantBooking) return false;
      if (freeCancellation && !hotel.freeCancellation) return false;
      
      if (destination && !hotel.location.city.toLowerCase().includes(destination.toLowerCase())) return false;
    }

    return true;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return getPrice(a) - getPrice(b);
      case 'price_high':
        return getPrice(b) - getPrice(a);
      case 'rating':
        return getRating(b) - getRating(a);
      default:
        return 0;
    }
  });

  function getPrice(item: Hotel | Flight | Train | Vehicle): number {
    if ('pricePerNight' in item) return item.pricePerNight;
    if ('price' in item) return item.price;
    if ('pricePerDay' in item) return item.pricePerDay;
    return 0;
  }

  function getRating(item: Hotel | Flight | Train | Vehicle): number {
    if ('rating' in item) return item.rating || 0;
    return 0;
  }

  const toggleStar = (star: number) => {
    setSelectedStars(prev =>
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId) ? prev.filter(a => a !== amenityId) : [...prev, amenityId]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 50000]);
    setSelectedStars([]);
    setSelectedRating(null);
    setSelectedAmenities([]);
    setInstantBooking(false);
    setFreeCancellation(false);
  };

  const activeFiltersCount = selectedStars.length + (selectedRating ? 1 : 0) + 
    selectedAmenities.length + (instantBooking ? 1 : 0) + (freeCancellation ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <Accordion type="single" collapsible defaultValue="price">
        <AccordionItem value="price">
          <AccordionTrigger>Ценовой диапазон</AccordionTrigger>
          <AccordionContent>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={50000}
                step={500}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{priceRange[0].toLocaleString()} ₽</span>
                <span>{priceRange[1].toLocaleString()} ₽</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Stars (Hotels only) */}
      {type === 'hotel' && (
        <Accordion type="single" collapsible defaultValue="stars">
          <AccordionItem value="stars">
            <AccordionTrigger>Звездность</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {starOptions.map((star) => (
                  <label
                    key={star}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                  >
                    <Checkbox
                      checked={selectedStars.includes(star)}
                      onCheckedChange={() => toggleStar(star)}
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(star)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{star} звезд</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Rating */}
      <Accordion type="single" collapsible defaultValue="rating">
        <AccordionItem value="rating">
          <AccordionTrigger>Рейтинг</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {ratingOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                >
                  <Checkbox
                    checked={selectedRating === option.value}
                    onCheckedChange={() => setSelectedRating(
                      selectedRating === option.value ? null : option.value
                    )}
                  />
                  <span className="text-sm text-gray-600">{option.label}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Amenities (Hotels only) */}
      {type === 'hotel' && (
        <Accordion type="single" collapsible defaultValue="amenities">
          <AccordionItem value="amenities">
            <AccordionTrigger>Удобства</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {amenitiesList.map((amenity) => (
                  <label
                    key={amenity.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                  >
                    <Checkbox
                      checked={selectedAmenities.includes(amenity.id)}
                      onCheckedChange={() => toggleAmenity(amenity.id)}
                    />
                    <span className="text-sm text-gray-600">{amenity.name}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Additional Options */}
      {type === 'hotel' && (
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
            <Checkbox
              checked={instantBooking}
              onCheckedChange={(checked) => setInstantBooking(checked as boolean)}
            />
            <span className="text-sm text-gray-600">Мгновенное бронирование</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
            <Checkbox
              checked={freeCancellation}
              onCheckedChange={(checked) => setFreeCancellation(checked as boolean)}
            />
            <span className="text-sm text-gray-600">Бесплатная отмена</span>
          </label>
        </div>
      )}

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
        >
          <X className="w-4 h-4 mr-2" />
          Сбросить фильтры ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {type === 'hotel' && 'Отели'}
                {type === 'flight' && 'Авиабилеты'}
                {type === 'train' && 'Ж/Д билеты'}
                {type === 'vehicle' && 'Аренда транспорта'}
              </h1>
              {destination && (
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {destination}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-coral/50"
                >
                  <option value="recommended">Рекомендуемые</option>
                  <option value="price_low">Цена: по возрастанию</option>
                  <option value="price_high">Цена: по убыванию</option>
                  <option value="rating">Рейтинг</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="w-4 h-4 mr-2" />
                    Фильтры
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-coral text-white">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Фильтры</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-coral" />
                <h3 className="font-semibold">Фильтры</h3>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-coral text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Найдено: {sortedItems.length} {getResultsText(sortedItems.length, type)}
            </p>

            <div className="space-y-4">
              {sortedItems.map((item) => (
                <SearchResultCard
                  key={item.id}
                  item={item}
                  type={type || 'hotel'}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() =>
                    isFavorite(item.id)
                      ? removeFromFavorites(item.id)
                      : addToFavorites(item, type || 'hotel')
                  }
                />
              ))}
            </div>

            {sortedItems.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ничего не найдено</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Попробуйте изменить параметры фильтров
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchResultCard({ 
  item, 
  type, 
  isFavorite, 
  onToggleFavorite 
}: { 
  item: Hotel | Flight | Train | Vehicle; 
  type: BookingType; 
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  if (type === 'hotel') {
    const hotel = item as Hotel;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-64 h-48 md:h-auto relative">
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onToggleFavorite}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-coral text-coral' : 'text-gray-400'}`} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(hotel.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    {hotel.location.distanceFromCenter} км до центра
                  </Badge>
                </div>

                <h3 className="text-lg font-bold mb-1 hover:text-coral-dark transition-colors">
                  <Link to={`/hotel/${hotel.id}`}>{hotel.name}</Link>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {hotel.location.city}, {hotel.location.address}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {hotel.rating}
                  </Badge>
                  <span className="text-sm text-gray-500">{hotel.reviewsCount} отзывов</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.slice(0, 4).map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400"
                    >
                      {getAmenityLabel(amenity)}
                    </span>
                  ))}
                  {hotel.amenities.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                      +{hotel.amenities.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">за ночь</p>
                <p className="text-2xl font-bold text-coral-dark">
                  {hotel.pricePerNight.toLocaleString()} ₽
                </p>
                <p className="text-xs text-gray-500 mb-3">включая налоги</p>
                <div className="space-y-2">
                  {hotel.freeCancellation && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Check className="w-3 h-3 mr-1" />
                      Бесплатная отмена
                    </Badge>
                  )}
                  {hotel.instantBooking && (
                    <Badge variant="outline" className="text-coral border-coral">
                      <Check className="w-3 h-3 mr-1" />
                      Мгновенное бронирование
                    </Badge>
                  )}
                </div>
                <Link to={`/hotel/${hotel.id}`}>
                  <Button className="w-full mt-4 btn-coral">
                    Смотреть
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Flight card
  if (type === 'flight') {
    const flight = item as Flight;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="font-bold text-sm">{flight.airline.slice(0, 2)}</span>
              </div>
              <div>
                <p className="font-medium">{flight.airline}</p>
                <p className="text-sm text-gray-500">{flight.flightNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xl font-bold">{flight.departure.time.getHours()}:{String(flight.departure.time.getMinutes()).padStart(2, '0')}</p>
                <p className="text-sm text-gray-500">{flight.departure.code}</p>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <p className="text-xs text-gray-500">{Math.floor(flight.duration / 60)}ч {flight.duration % 60}м</p>
                <div className="w-full h-px bg-gray-300 relative my-2">
                  <div className="absolute right-0 -top-1 w-2 h-2 bg-gray-300 rounded-full" />
                </div>
                <p className="text-xs text-coral">{flight.stops === 0 ? 'Прямой' : `${flight.stops} пересадка`}</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{flight.arrival.time.getHours()}:{String(flight.arrival.time.getMinutes()).padStart(2, '0')}</p>
                <p className="text-sm text-gray-500">{flight.arrival.code}</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-coral-dark">{flight.price.toLocaleString()} ₽</p>
            <p className="text-sm text-gray-500 mb-3">{getClassLabel(flight.class)}</p>
            <Link to={`/flight/${flight.id}`}>
              <Button className="btn-coral">Выбрать</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Train card
  if (type === 'train') {
    const train = item as Train;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="font-bold text-sm">РЖД</span>
              </div>
              <div>
                <p className="font-medium">{train.trainType}</p>
                <p className="text-sm text-gray-500">{train.trainNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-xl font-bold">{train.departure.time.getHours()}:{String(train.departure.time.getMinutes()).padStart(2, '0')}</p>
                <p className="text-sm text-gray-500">{train.departure.city}</p>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <p className="text-xs text-gray-500">{Math.floor(train.duration / 60)}ч {train.duration % 60}м</p>
                <div className="w-full h-px bg-gray-300 relative my-2" />
                <p className="text-xs text-coral">{train.stops} остановок</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{train.arrival.time.getHours()}:{String(train.arrival.time.getMinutes()).padStart(2, '0')}</p>
                <p className="text-sm text-gray-500">{train.arrival.city}</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-coral-dark">{train.price.toLocaleString()} ₽</p>
            <p className="text-sm text-gray-500 mb-3">{getClassLabel(train.class)}</p>
            <Link to={`/train/${train.id}`}>
              <Button className="btn-coral">Выбрать</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vehicle card
  const vehicle = item as Vehicle;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 h-48 md:h-auto relative">
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">{vehicle.provider}</p>
              <h3 className="text-lg font-bold mb-2">{vehicle.brand} {vehicle.model}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{vehicle.year} год</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{getTransmissionLabel(vehicle.transmission)}</Badge>
                <Badge variant="secondary">{getFuelLabel(vehicle.fuel)}</Badge>
                <Badge variant="secondary">{vehicle.seats} мест</Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {vehicle.features.slice(0, 3).map((feature) => (
                  <span key={feature} className="text-xs text-gray-500">
                    {getFeatureLabel(feature)}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">в сутки</p>
              <p className="text-2xl font-bold text-coral-dark">{vehicle.pricePerDay.toLocaleString()} ₽</p>
              <p className="text-xs text-gray-500 mb-3">залог {vehicle.deposit.toLocaleString()} ₽</p>
              {vehicle.insurance && (
                <Badge variant="outline" className="text-green-600 border-green-600 mb-3">
                  <Check className="w-3 h-3 mr-1" />
                  Страховка включена
                </Badge>
              )}
              <Link to={`/vehicle/${vehicle.id}`}>
                <Button className="w-full btn-coral">Арендовать</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getResultsText(count: number, type?: string): string {
  if (type === 'hotel') {
    if (count === 1) return 'отель';
    if (count >= 2 && count <= 4) return 'отеля';
    return 'отелей';
  }
  if (type === 'flight') {
    if (count === 1) return 'рейс';
    if (count >= 2 && count <= 4) return 'рейса';
    return 'рейсов';
  }
  if (type === 'train') {
    if (count === 1) return 'поезд';
    if (count >= 2 && count <= 4) return 'поезда';
    return 'поездов';
  }
  if (type === 'vehicle') {
    if (count === 1) return 'транспорт';
    if (count >= 2 && count <= 4) return 'транспорта';
    return 'транспортов';
  }
  return 'вариантов';
}

function getAmenityLabel(amenity: string): string {
  const labels: Record<string, string> = {
    wifi: 'Wi-Fi',
    pool: 'Бассейн',
    spa: 'Спа',
    gym: 'Тренажерный зал',
    restaurant: 'Ресторан',
    bar: 'Бар',
    parking: 'Парковка',
    beach: 'Пляж',
    ac: 'Кондиционер',
    breakfast: 'Завтрак',
    concierge: 'Консьерж',
    'room-service': 'Обслуживание в номере',
    'kids-club': 'Детский клуб',
    'water-sports': 'Водные виды спорта',
  };
  return labels[amenity] || amenity;
}

function getClassLabel(className: string): string {
  const labels: Record<string, string> = {
    economy: 'Эконом',
    business: 'Бизнес',
    first: 'Первый класс',
  };
  return labels[className] || className;
}

function getTransmissionLabel(transmission: string): string {
  const labels: Record<string, string> = {
    automatic: 'Автомат',
    manual: 'Механика',
  };
  return labels[transmission] || transmission;
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
    gps: 'GPS',
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
