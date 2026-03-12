import { useNavigate } from 'react-router-dom';
import { promotions } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Copy, Check, Tag } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function PromotionsSection() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getTypeLabel = (types: string[]) => {
    const labels: Record<string, string> = {
      hotel: 'Отели',
      flight: 'Авиа',
      train: 'Ж/Д',
      vehicle: 'Аренда',
    };
    return types.map(t => labels[t] || t).join(', ');
  };

  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Горячие <span className="text-gradient">предложения</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Используйте промокоды и получайте скидки на бронирование отелей, авиабилетов и аренду транспорта
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Discount Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-coral text-white font-bold text-lg px-3 py-1">
                    -{promo.discount}%
                  </Badge>
                </div>

                {/* Type Badge */}
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    <Tag className="w-3 h-3 mr-1" />
                    {getTypeLabel(promo.applicableTypes)}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 group-hover:text-coral-dark transition-colors">
                  {promo.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {promo.description}
                </p>

                {/* Promo Code */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>до {format(promo.validUntil, 'd MMM', { locale: ru })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-center">
                    {promo.code}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyCode(promo.code)}
                    className="shrink-0"
                  >
                    {copiedCode === promo.code ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <Button 
                  className="w-full mt-4 btn-coral"
                  onClick={() => navigate(`/search/${promo.applicableTypes[0]}`)}
                >
                  Использовать
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
