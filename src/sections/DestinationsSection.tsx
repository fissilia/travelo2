import { useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { destinations } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

export function DestinationsSection() {
  const navigate = useNavigate();

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Популярные <span className="text-gradient">направления</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl">
              Исследуйте лучшие города России и мира. Откройте для себя новые места и незабываемые впечатления
            </p>
          </div>
          <button 
            onClick={() => navigate('/search/hotel')}
            className="flex items-center gap-2 text-coral-dark font-medium hover:gap-3 transition-all"
          >
            Смотреть все
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              onClick={() => navigate(`/search/hotel?destination=${encodeURIComponent(destination.city)}`)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer card-hover ${
                index === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${index === 0 ? 'h-80 lg:h-full' : 'h-64'}`}>
                <img
                  src={destination.image}
                  alt={destination.city}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-coral" />
                      <span className="text-white/80 text-sm">{destination.country}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {destination.city}
                    </h3>
                    <p className={`text-white/70 text-sm mb-3 ${index === 0 ? 'line-clamp-2' : 'line-clamp-1'}`}>
                      {destination.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {destination.rating}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                        {destination.properties} отелей
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs">от</p>
                    <p className="text-white font-bold text-lg">
                      {destination.averagePrice.toLocaleString()} ₽
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {destination.tags.slice(0, index === 0 ? 3 : 2).map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 rounded-md bg-coral/80 text-white text-xs"
                    >
                      {getTagLabel(tag)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getTagLabel(tag: string): string {
  const labels: Record<string, string> = {
    beach: 'Пляж',
    culture: 'Культура',
    luxury: 'Люкс',
    budget: 'Бюджет',
    family: 'Семейный',
    romance: 'Романтика',
    adventure: 'Приключения',
    nature: 'Природа',
    mountains: 'Горы',
    nightlife: 'Ночная жизнь',
    architecture: 'Архитектура',
    history: 'История',
    lake: 'Озеро',
  };
  return labels[tag] || tag;
}
