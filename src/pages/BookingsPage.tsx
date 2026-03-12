import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle,
  Download, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/hooks/useAppContext';
import type { Booking, BookingStatus } from '@/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function BookingsPage() {
  const navigate = useNavigate();
  const { bookings, cancelBooking } = useAppContext();
  const [activeTab, setActiveTab] = useState('all');

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Ожидает оплаты
          </Badge>
        );
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Оплачено
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Отменено
          </Badge>
        );
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      hotel: 'Отель',
      flight: 'Авиабилет',
      train: 'Ж/Д билет',
      vehicle: 'Аренда авто',
    };
    return labels[type] || type;
  };

  const getItemName = (booking: Booking): string => {
    if ('name' in booking.item) return booking.item.name;
    if ('airline' in booking.item) return `${booking.item.airline} ${booking.item.flightNumber}`;
    if ('trainNumber' in booking.item) return `Поезд ${booking.item.trainNumber}`;
    if ('brand' in booking.item) return `${booking.item.brand} ${booking.item.model}`;
    return 'Бронирование';
  };

  const getItemImage = (booking: Booking): string => {
    if ('images' in booking.item && booking.item.images.length > 0) {
      return booking.item.images[0];
    }
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop';
  };

  const getLocation = (booking: Booking): string => {
    if ('location' in booking.item) {
      return booking.item.location.city;
    }
    if ('departure' in booking.item) {
      return `${booking.item.departure.city} → ${booking.item.arrival.city}`;
    }
    if ('pickupLocation' in booking.item) {
      return booking.item.pickupLocation.city;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Мои бронирования</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Управляйте своими поездками и бронированиями
            </p>
          </div>
          <Button onClick={() => navigate('/search/hotel')} className="btn-coral">
            Новое бронирование
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              Все ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="paid">
              Активные ({bookings.filter(b => b.status === 'paid').length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Ожидают ({bookings.filter(b => b.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Отмененные ({bookings.filter(b => b.status === 'cancelled').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Image */}
                      <div className="lg:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={getItemImage(booking)}
                          alt={getItemName(booking)}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{getTypeLabel(booking.type)}</Badge>
                              {getStatusBadge(booking.status)}
                            </div>
                            <h3 className="text-lg font-bold mb-1">{getItemName(booking)}</h3>
                            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {getLocation(booking)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold text-coral-dark">
                              {booking.totalPrice.toLocaleString()} ₽
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {booking.id.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                          {'checkIn' in booking.dates && booking.dates.checkIn && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-coral" />
                              <span>
                                {format(booking.dates.checkIn, 'd MMM', { locale: ru })} - {' '}
                                {'checkOut' in booking.dates && booking.dates.checkOut && 
                                  format(booking.dates.checkOut, 'd MMM yyyy', { locale: ru })}
                              </span>
                            </div>
                          )}
                          {'departure' in booking.dates && booking.dates.departure && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-coral" />
                              <span>
                                {format(booking.dates.departure, 'd MMM yyyy', { locale: ru })}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-coral" />
                            <span>
                              Забронировано {format(booking.createdAt, 'd MMM yyyy', { locale: ru })}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 mt-4">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Скачать voucher
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Связаться
                          </Button>
                          {booking.status === 'paid' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => cancelBooking(booking.id)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Отменить
                            </Button>
                          )}
                          {booking.status === 'pending' && (
                            <Button size="sm" className="btn-coral">
                              Оплатить
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Нет бронирований</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {activeTab === 'all'
                    ? 'У вас пока нет бронирований. Начните планировать свою поездку!'
                    : 'Нет бронирований в этой категории'}
                </p>
                <Button onClick={() => navigate('/search/hotel')} className="btn-coral">
                  Найти отель
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
