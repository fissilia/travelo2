import { useNavigate } from 'react-router-dom';
import { Heart, Users, Wallet, Crown, ArrowRight } from 'lucide-react';

const collections = [
  {
    id: 'couples',
    title: 'Для пар',
    description: 'Романтические отели и направления для незабываемых моментов вдвоем',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=400&fit=crop',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    filter: { type: 'hotel', tags: ['romance', 'luxury'] },
  },
  {
    id: 'family',
    title: 'Для семьи',
    description: 'Семейные отели с детскими клубами, развлечениями и удобствами для детей',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1542037104857-4bb4b9fe2433?w=600&h=400&fit=crop',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    filter: { type: 'hotel', tags: ['family'] },
  },
  {
    id: 'budget',
    title: 'Бюджетно',
    description: 'Отличные варианты размещения по доступным ценам без потери качества',
    icon: Wallet,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    filter: { type: 'hotel', priceRange: [0, 5000] },
  },
  {
    id: 'luxury',
    title: 'Люкс',
    description: 'Премиальные отели мирового класса для самых взыскательных гостей',
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    filter: { type: 'hotel', stars: [5] },
  },
];

export function CollectionsSection() {
  const navigate = useNavigate();

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Подборки для <span className="text-gradient">вас</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Мы собрали лучшие варианты для разных типов путешествий. Выберите то, что подходит именно вам
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              onClick={() => navigate('/search/hotel')}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
            >
              {/* Background */}
              <div className={`absolute inset-0 ${collection.bgColor}`} />
              
              {/* Content */}
              <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${collection.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <collection.icon className="w-8 h-8 text-white" />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-coral-dark transition-colors">
                    {collection.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {collection.description}
                  </p>
                  <div className="flex items-center gap-2 text-coral-dark font-medium text-sm">
                    <span>Смотреть варианты</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Image */}
                <div className="hidden lg:block w-32 h-24 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Hover Effect */}
              <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${collection.color} w-0 group-hover:w-full transition-all duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
