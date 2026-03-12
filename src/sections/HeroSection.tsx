import { SearchBar } from '@/components/SearchBar';
import { Sparkles, Shield, Clock, Headphones } from 'lucide-react';

const features = [
  { icon: Shield, text: 'Безопасная оплата' },
  { icon: Clock, text: 'Мгновенное подтверждение' },
  { icon: Sparkles, text: 'Лучшие цены' },
  { icon: Headphones, text: 'Поддержка 24/7' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=1080&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full section-padding">
        <div className="container-custom">
          {/* Hero Text */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Откройте мир с{' '}
              <span className="text-gradient">Travelo</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Бронируйте отели, авиабилеты, ж/д билеты и аренду транспорта по лучшим ценам
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Features */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-white/90"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <feature.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
