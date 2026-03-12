import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Star, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/hooks/useAppContext';
import type { BookingType, Hotel, Flight, Train, Vehicle } from '@/types';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites } = useAppContext();

  const getTypeLabel = (type: BookingType) => {
    const labels: Record<string, string> = {
      hotel: 'Отель',
      flight: 'Авиабилет',
      train: 'Ж/Д билет',
      vehicle: 'Аренда авто',
    };
    return labels[type] || type;
  };

  const getItemName = (item: Hotel | Flight | Train | Vehicle): string => {
    if ('name' in item) return item.name;
    if ('airline' in item) return `${item.airline} ${item.flightNumber}`;
    if ('trainNumber' in item) return `Поезд ${item.trainNumber}`;
    if ('brand' in item) return `${item.brand} ${item.model}`;
    return 'Элемент';
  };

  const getItemImage = (item: Hotel | Flight | Train | Vehicle): string => {
    if ('images' in item && item.images.length > 0) {
      return item.images[0];
    }
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop';
  };

  const getPrice = (item: Hotel | Flight | Train | Vehicle): number => {
    if ('pricePerNight' in item) return item.pricePerNight;
    if ('price' in item) return item.price;
    if ('pricePerDay' in item) return item.pricePerDay;
    return 0;
  };

  const getLocation = (item: Hotel | Flight | Train | Vehicle): string => {
    if ('location' in item) {
      return item.location.city;
    }
    if ('departure' in item) {
      return `${item.departure.city} → ${item.arrival.city}`;
    }
    if ('pickupLocation' in item) {
      return item.pickupLocation.city;
    }
    return '';
  };

  const getRating = (item: Hotel | Flight | Train | Vehicle): number => {
    if ('rating' in item) return item.rating || 0;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Избранное</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {favorites.length} {getItemsText(favorites.length)} в избранном
            </p>
          </div>
          <Button onClick={() => navigate('/search/hotel')} className="btn-coral">
            Добавить еще
          </Button>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getItemImage(favorite.item)}
                    alt={getItemName(favorite.item)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Type Badge */}
                  <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
                    {getTypeLabel(favorite.itemType)}
                  </Badge>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromFavorites(favorite.itemId)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Price */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/80 text-xs">
                          {'pricePerNight' in favorite.item ? 'за ночь' : 
                           'pricePerDay' in favorite.item ? 'в сутки' : 'цена'}
                        </p>
                        <p className="text-white text-xl font-bold">
                          {getPrice(favorite.item).toLocaleString()} ₽
                        </p>
                      </div>
                      {getRating(favorite.item) > 0 && (
                        <Badge className="bg-green-500 text-white">
                          <Star className="w-3 h-3 mr-1 fill-white" />
                          {getRating(favorite.item)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">
                    {getItemName(favorite.item)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1 mb-4">
                    <MapPin className="w-4 h-4" />
                    {getLocation(favorite.item)}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        navigate(`/${favorite.itemType}/${favorite.itemId}`);
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Подробнее
                    </Button>
                    <Button 
                      className="flex-1 btn-coral"
                      onClick={() => {
                        navigate(`/${favorite.itemType}/${favorite.itemId}`);
                      }}
                    >
                      Забронировать
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Избранное пусто</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Добавляйте понравившиеся отели, билеты и варианты аренды в избранное, чтобы не потерять их
            </p>
            <Button onClick={() => navigate('/search/hotel')} className="btn-coral">
              Начать поиск
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function getItemsText(count: number): string {
  if (count === 1) return 'элемент';
  if (count >= 2 && count <= 4) return 'элемента';
  return 'элементов';
}
