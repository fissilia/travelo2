import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Heart, Share2, Check, X, 
  Phone, Mail, Globe, ChevronLeft, ChevronRight, BedDouble, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { hotels, reviews } from '@/data/mockData';
import { useAppContext } from '@/hooks/useAppContext';
import { format, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';

export function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites, addToCart } = useAppContext();
  
  const hotel = hotels.find(h => h.id === id);
  const hotelReviews = reviews.filter(r => r.itemId === id);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 2));
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [guests] = useState({ adults: 2, children: 0 });

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Отель не найден</h1>
          <Button onClick={() => navigate('/search/hotel')}>Вернуться к поиску</Button>
        </div>
      </div>
    );
  }

  const nights = checkIn && checkOut 
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const selectedRoomData = hotel.rooms.find(r => r.id === selectedRoom);
  const totalPrice = selectedRoomData ? selectedRoomData.pricePerNight * nights : 0;

  const handleBook = () => {
    if (selectedRoomData && checkIn && checkOut) {
      addToCart(hotel, 'hotel', { checkIn, checkOut }, guests);
      navigate('/checkout');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50">
      {/* Image Gallery */}
      <div className="relative h-96 lg:h-[500px]">
        <img
          src={hotel.images[currentImageIndex]}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Navigation */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {hotel.images.length}
        </div>

        {/* View All Photos */}
        <button
          onClick={() => setIsGalleryOpen(true)}
          className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors"
        >
          Смотреть все фото
        </button>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => isFavorite(hotel.id) ? removeFromFavorites(hotel.id) : addToFavorites(hotel, 'hotel')}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isFavorite(hotel.id) ? 'fill-coral text-coral' : 'text-white'}`} />
          </button>
          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(hotel.stars)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {hotel.rating} · {hotel.reviewsCount} отзывов
                    </Badge>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{hotel.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.location.address}, {hotel.location.city}</span>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Заезд: {hotel.checkInTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <X className="w-4 h-4 text-red-500" />
                  <span>Выезд: {hotel.checkOutTime}</span>
                </div>
                {hotel.freeCancellation && (
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Бесплатная отмена</span>
                  </div>
                )}
                {hotel.instantBooking && (
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Мгновенное бронирование</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <TabsList className="w-full justify-start rounded-t-xl border-b border-gray-100 dark:border-gray-700 p-0">
                <TabsTrigger value="about" className="rounded-none px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-coral">Об отеле</TabsTrigger>
                <TabsTrigger value="rooms" className="rounded-none px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-coral">Номера</TabsTrigger>
                <TabsTrigger value="amenities" className="rounded-none px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-coral">Удобства</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-coral">Отзывы</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="p-6">
                <h3 className="text-lg font-semibold mb-4">Описание</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {hotel.description}
                </p>

                <h3 className="text-lg font-semibold mt-8 mb-4">Расположение</h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Карта загружается...</p>
                    <p className="text-sm">{hotel.location.distanceFromCenter} км до центра</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mt-8 mb-4">Контакты</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-coral" />
                    <span>+7 (495) 123-45-67</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-coral" />
                    <span>info@{hotel.name.toLowerCase().replace(/\s+/g, '')}.ru</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-coral" />
                    <span>www.{hotel.name.toLowerCase().replace(/\s+/g, '')}.ru</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rooms" className="p-6">
                <div className="space-y-6">
                  {hotel.rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        selectedRoom === room.id
                          ? 'border-coral bg-coral/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-coral/50'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        <img
                          src={room.images[0]}
                          alt={room.name}
                          className="w-full md:w-48 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{room.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {room.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="secondary">
                              <BedDouble className="w-3 h-3 mr-1" />
                              {room.bedType}
                            </Badge>
                            <Badge variant="secondary">
                              <Users className="w-3 h-3 mr-1" />
                              до {room.maxGuests} гостей
                            </Badge>
                            {room.size && (
                              <Badge variant="secondary">{room.size} м²</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {room.amenities.slice(0, 4).map((amenity) => (
                              <span
                                key={amenity}
                                className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                              >
                                {getAmenityLabel(amenity)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-coral-dark">
                            {room.pricePerNight.toLocaleString()} ₽
                          </p>
                          <p className="text-sm text-gray-500">за ночь</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <Check className="w-5 h-5 text-green-500" />
                      <span>{getAmenityLabel(amenity)}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-6">
                {hotelReviews.length > 0 ? (
                  <div className="space-y-6">
                    {hotelReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-coral rounded-full flex items-center justify-center text-white font-medium">
                            {review.userName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{review.userName}</p>
                            <p className="text-sm text-gray-500">
                              {format(review.date, 'd MMMM yyyy', { locale: ru })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <h4 className="font-semibold mb-1">{review.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Пока нет отзывов</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Бронирование</h3>
              
              {/* Dates */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Заезд</label>
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Выезд</label>
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) => date <= (checkIn || new Date())}
                    className="rounded-md border"
                  />
                </div>
              </div>

              {/* Selected Room Summary */}
              {selectedRoomData && (
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
                  <h4 className="font-medium mb-2">Выбранный номер</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedRoomData.name}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">{nights} ночей</span>
                    <span className="font-semibold">{selectedRoomData.pricePerNight.toLocaleString()} ₽/ночь</span>
                  </div>
                </div>
              )}

              {/* Price Summary */}
              {selectedRoomData && (
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Проживание</span>
                      <span>{(selectedRoomData.pricePerNight * nights).toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Сборы</span>
                      <span>{Math.round(selectedRoomData.pricePerNight * nights * 0.05).toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Налоги</span>
                      <span>{Math.round(selectedRoomData.pricePerNight * nights * 0.1).toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Итого</span>
                      <span className="text-coral-dark">{totalPrice.toLocaleString()} ₽</span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleBook}
                disabled={!selectedRoom || !checkIn || !checkOut}
                className="w-full btn-coral"
              >
                Забронировать
              </Button>

              {!selectedRoom && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  Выберите номер для бронирования
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Галерея отеля</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {hotel.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${hotel.name} - ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
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
    tv: 'ТВ',
    minibar: 'Минибар',
    safe: 'Сейф',
    jacuzzi: 'Джакузи',
    balcony: 'Балкон',
    kitchenette: 'Мини-кухня',
    fireplace: 'Камин',
  };
  return labels[amenity] || amenity;
}
