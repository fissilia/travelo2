import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Booking, Favorite, ChatMessage, User, BookingType, Hotel, Flight, Train, Vehicle } from '@/types';
import { currentUser, chatHistory as initialChat } from '@/data/mockData';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  bookings: Booking[];
  favorites: Favorite[];
  chatMessages: ChatMessage[];
  searchQuery: {
    type: BookingType;
    destination: string;
    dates: {
      from?: Date;
      to?: Date;
    };
    guests: {
      adults: number;
      children: number;
    };
  };
  cart: {
    item: Hotel | Flight | Train | Vehicle | null;
    type: BookingType | null;
    dates: any;
    guests?: any;
    totalPrice: number;
  } | null;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  addToFavorites: (item: Hotel | Flight | Train | Vehicle, type: BookingType) => void;
  removeFromFavorites: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  sendChatMessage: (content: string) => void;
  setSearchQuery: (query: Partial<AppState['searchQuery']>) => void;
  addToCart: (item: Hotel | Flight | Train | Vehicle, type: BookingType, dates: any, guests?: any) => void;
  clearCart: () => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  user: currentUser,
  isAuthenticated: true,
  bookings: [],
  favorites: [],
  chatMessages: initialChat,
  searchQuery: {
    type: 'hotel',
    destination: '',
    dates: {},
    guests: { adults: 2, children: 0 },
  },
  cart: null,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email && password) {
      setState(prev => ({
        ...prev,
        user: currentUser,
        isAuthenticated: true,
      }));
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email && password && firstName && lastName) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        firstName,
        lastName,
        preferences: {
          currency: 'RUB',
          language: 'ru',
          notifications: true,
          darkMode: false,
          interests: [],
        },
        createdAt: new Date(),
      };
      setState(prev => ({
        ...prev,
        user: newUser,
        isAuthenticated: true,
      }));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false,
    }));
  }, []);

  const addToFavorites = useCallback((item: Hotel | Flight | Train | Vehicle, type: BookingType) => {
    const newFavorite: Favorite = {
      id: Math.random().toString(36).substr(2, 9),
      userId: state.user?.id || '',
      itemId: item.id,
      itemType: type,
      item,
      addedAt: new Date(),
    };
    setState(prev => ({
      ...prev,
      favorites: [...prev.favorites, newFavorite],
    }));
  }, [state.user]);

  const removeFromFavorites = useCallback((itemId: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.filter(f => f.itemId !== itemId),
    }));
  }, []);

  const isFavorite = useCallback((itemId: string) => {
    return state.favorites.some(f => f.itemId === itemId);
  }, [state.favorites]);

  const addBooking = useCallback((booking: Booking) => {
    setState(prev => ({
      ...prev,
      bookings: [...prev.bookings, booking],
    }));
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setState(prev => ({
      ...prev,
      bookings: prev.bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      ),
    }));
  }, []);

  const sendChatMessage = useCallback((content: string) => {
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: state.user?.id || '',
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Simulate AI response
    const aiResponse: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'ai',
      role: 'assistant',
      content: generateAIResponse(content),
      timestamp: new Date(),
      suggestions: getSuggestions(content),
    };

    setState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, userMessage, aiResponse],
    }));
  }, [state.user]);

  const setSearchQuery = useCallback((query: Partial<AppState['searchQuery']>) => {
    setState(prev => ({
      ...prev,
      searchQuery: { ...prev.searchQuery, ...query },
    }));
  }, []);

  const addToCart = useCallback((item: Hotel | Flight | Train | Vehicle, type: BookingType, dates: any, guests?: any) => {
    let totalPrice = 0;
    
    if (type === 'hotel') {
      const hotel = item as Hotel;
      const nights = Math.ceil((dates.checkOut.getTime() - dates.checkIn.getTime()) / (1000 * 60 * 60 * 24));
      totalPrice = hotel.pricePerNight * nights;
    } else if (type === 'flight') {
      const flight = item as Flight;
      totalPrice = flight.price;
    } else if (type === 'train') {
      const train = item as Train;
      totalPrice = train.price;
    } else if (type === 'vehicle') {
      const vehicle = item as Vehicle;
      const days = Math.ceil((dates.dropoff.getTime() - dates.pickup.getTime()) / (1000 * 60 * 60 * 24));
      totalPrice = vehicle.pricePerDay * days;
    }

    const fees = Math.round(totalPrice * 0.05);
    const taxes = Math.round(totalPrice * 0.1);

    setState(prev => ({
      ...prev,
      cart: {
        item,
        type,
        dates,
        guests,
        totalPrice: totalPrice + fees + taxes,
      },
    }));
  }, []);

  const clearCart = useCallback(() => {
    setState(prev => ({
      ...prev,
      cart: null,
    }));
  }, []);

  const updateUserPreferences = useCallback((preferences: Partial<User['preferences']>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? {
        ...prev.user,
        preferences: { ...prev.user.preferences, ...preferences },
      } : null,
    }));
  }, []);

  const value: AppContextType = {
    ...state,
    login,
    register,
    logout,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addBooking,
    cancelBooking,
    sendChatMessage,
    setSearchQuery,
    addToCart,
    clearCart,
    updateUserPreferences,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function generateAIResponse(content: string): string {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('отел') || lowerContent.includes('гостиниц')) {
    return 'Я могу помочь найти идеальный отель! Расскажите, пожалуйста:\n• В каком городе планируете остановиться?\n• Какие даты поездки?\n• Сколько гостей?\n• Есть ли предпочтения по бюджету или звездности?';
  }
  
  if (lowerContent.includes('авиа') || lowerContent.includes('билет') || lowerContent.includes('самолет')) {
    return 'Помогу найти лучшие авиабилеты! Уточните:\n• Откуда и куда летите?\n• Даты вылета и возвращения?\n• Класс обслуживания?\n• Количество пассажиров?';
  }
  
  if (lowerContent.includes('машин') || lowerContent.includes('авто') || lowerContent.includes('аренд')) {
    return 'Подберу отличный автомобиль в аренду! Скажите:\n• Город получения автомобиля?\n• Даты аренды?\n• Тип транспорта (легковая, внедорожник, минивэн)?\n• Нужен ли автомат?';
  }
  
  if (lowerContent.includes('куда') || lowerContent.includes('направлени') || lowerContent.includes('поехать')) {
    return 'Вот популярные направления:\n\n🏖️ Для пляжного отдыха: Сочи, Крым\n🏛️ Для культурного отдыха: Москва, Санкт-Петербург, Казань\n🏔️ Для активного отдыха: Байкал, Кавказ\n\nКакой тип отдыха вам ближе?';
  }
  
  if (lowerContent.includes('москв')) {
    return 'Отличный выбор! В Москве множество вариантов размещения:\n\n🏨 Роскошные: Grand Hotel Moscow (от 8500₽/ночь)\n🏨 Бюджетные: Отели в центре от 3500₽/ночь\n\nРекомендую районы: Тверская, Арбат, Кремль. Хотите посмотреть варианты?';
  }
  
  if (lowerContent.includes('сочи')) {
    return 'Сочи - прекрасный выбор! 🌊\n\nУ нас есть отели:\n• Sochi Beach Resort 5★ - от 12000₽/ночь\n• Множество вариантов у моря\n\nТакже можно арендовать машину или скутер для поездок. Интересует что-то конкретное?';
  }
  
  return 'Спасибо за сообщение! Я здесь, чтобы помочь с:\n\n🏨 Бронированием отелей\n✈️ Поиском авиабилетов\n🚂 Ж/д билетами\n🚗 Арендой транспорта\n\nЧем могу быть полезен?';
}

function getSuggestions(content: string): string[] {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('отел')) {
    return ['Отели в Москве', 'Отели у моря', 'Бюджетные варианты'];
  }
  if (lowerContent.includes('авиа') || lowerContent.includes('билет')) {
    return ['Москва - Сочи', 'Дешевые билеты', 'Бизнес-класс'];
  }
  if (lowerContent.includes('машин') || lowerContent.includes('аренд')) {
    return ['Эконом-класс', 'Внедорожники', 'Минивэны'];
  }
  
  return ['Найти отель', 'Авиабилеты', 'Аренда авто'];
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
