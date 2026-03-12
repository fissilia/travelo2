import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, CreditCard, Wallet, Building2, 
  Check, Shield, Lock, User, Mail, Phone 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/hooks/useAppContext';
import type { BookingStatus } from '@/types';

const paymentMethods = [
  { id: 'card', name: 'Банковская карта', icon: CreditCard },
  { id: 'sbp', name: 'СБП (Система быстрых платежей)', icon: Wallet },
  { id: 'bank', name: 'Банковский перевод', icon: Building2 },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, user, addBooking, clearCart } = useAppContext();
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  if (!cart || !cart.item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Корзина пуста</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Добавьте товары в корзину для оформления заказа
          </p>
          <Button onClick={() => navigate('/search/hotel')} className="btn-coral">
            Начать поиск
          </Button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!cart?.item) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create booking
    const booking = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || '',
      type: cart.type!,
      itemId: cart.item.id,
      item: cart.item,
      dates: cart.dates,
      guests: cart.guests,
      totalPrice: cart.totalPrice,
      fees: Math.round(cart.totalPrice * 0.05),
      taxes: Math.round(cart.totalPrice * 0.1),
      currency: 'RUB',
      status: 'paid' as BookingStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentMethod,
    };
    
    addBooking(booking);
    setIsProcessing(false);
    setIsComplete(true);
    
    // Clear cart after 3 seconds
    setTimeout(() => {
      clearCart();
    }, 3000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Бронирование подтверждено!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Спасибо за бронирование. Подтверждение отправлено на ваш email.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/bookings')} className="w-full btn-coral">
              Мои бронирования
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              На главную
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            Назад
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-coral' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-coral text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="hidden sm:inline font-medium">Данные</span>
            </div>
            <div className="w-12 h-px bg-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-coral' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-coral text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="hidden sm:inline font-medium">Оплата</span>
            </div>
            <div className="w-12 h-px bg-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-coral' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-coral text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="hidden sm:inline font-medium">Подтверждение</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Контактные данные</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="firstName">Имя</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10"
                        placeholder="Введите имя"
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
                        className="pl-10"
                        placeholder="Введите фамилию"
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
                        className="pl-10"
                        placeholder="email@example.com"
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
                        className="pl-10"
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <Checkbox
                    id="save"
                    checked={true}
                  />
                  <label htmlFor="save" className="text-sm text-gray-600">
                    Сохранить данные для будущих бронирований
                  </label>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!firstName || !lastName || !email}
                  className="w-full btn-coral"
                >
                  Продолжить
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Способ оплаты</h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4 mb-6">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-coral bg-coral/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-coral/50'
                      }`}
                    >
                      <RadioGroupItem value={method.id} />
                      <method.icon className="w-6 h-6 text-coral" />
                      <span className="font-medium">{method.name}</span>
                    </label>
                  ))}
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="cardNumber">Номер карты</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="cardNumber"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          className="pl-10"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Срок действия</Label>
                        <Input
                          id="expiry"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="cvc"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            className="pl-10"
                            placeholder="123"
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-6">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    Я согласен с <a href="#" className="text-coral hover:underline">условиями бронирования</a> и <a href="#" className="text-coral hover:underline">политикой отмены</a>
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    Назад
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={
                      (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvc)) ||
                      !agreeTerms ||
                      isProcessing
                    }
                    className="flex-1 btn-coral"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Обработка...
                      </span>
                    ) : (
                      `Оплатить ${cart.totalPrice.toLocaleString()} ₽`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold mb-4">Ваш заказ</h3>
              
              {/* Item Details */}
              <div className="flex gap-4 mb-4">
                {'images' in cart.item && (
                  <img
                    src={cart.item.images[0]}
                    alt={'name' in cart.item ? cart.item.name : ''}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h4 className="font-medium">{'name' in cart.item ? cart.item.name : ''}</h4>
                  <p className="text-sm text-gray-500">
                    {'location' in cart.item && cart.item.location.city}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Dates */}
              {cart.dates && (
                <div className="space-y-2 mb-4">
                  {'checkIn' in cart.dates && cart.dates.checkIn && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Заезд</span>
                      <span>{cart.dates.checkIn.toLocaleDateString('ru-RU')}</span>
                    </div>
                  )}
                  {'checkOut' in cart.dates && cart.dates.checkOut && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Выезд</span>
                      <span>{cart.dates.checkOut.toLocaleDateString('ru-RU')}</span>
                    </div>
                  )}
                </div>
              )}

              <Separator className="my-4" />

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Стоимость</span>
                  <span>{(cart.totalPrice * 0.85).toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Сборы</span>
                  <span>{(cart.totalPrice * 0.05).toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Налоги</span>
                  <span>{(cart.totalPrice * 0.1).toLocaleString()} ₽</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span>Итого</span>
                <span className="text-coral-dark">{cart.totalPrice.toLocaleString()} ₽</span>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 mt-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
                <div className="text-sm">
                  <p className="font-medium text-green-800 dark:text-green-400">Безопасная оплата</p>
                  <p className="text-green-600">SSL-шифрование</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
