import { reviews } from '@/data/mockData';
import { Star, ThumbsUp, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function ReviewsSection() {
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([]);

  const markHelpful = (reviewId: string) => {
    if (!helpfulReviews.includes(reviewId)) {
      setHelpfulReviews([...helpfulReviews, reviewId]);
    }
  };

  const getItemTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      hotel: 'Отель',
      flight: 'Авиаперелет',
      train: 'Ж/Д поездка',
      vehicle: 'Аренда авто',
    };
    return labels[type] || type;
  };

  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Отзывы <span className="text-gradient">путешественников</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Узнайте, что говорят наши клиенты о своих путешествиях с Travelo
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-coral/30 mb-4" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {getItemTypeLabel(review.itemType)}
                </span>
              </div>

              {/* Review Content */}
              <h4 className="font-bold text-lg mb-2">{review.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
                {review.comment}
              </p>

              {/* User Info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.userAvatar} />
                    <AvatarFallback className="bg-coral text-white text-sm">
                      {review.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{review.userName}</p>
                    <p className="text-xs text-gray-500">
                      {format(review.date, 'd MMMM yyyy', { locale: ru })}
                    </p>
                  </div>
                </div>

                {/* Helpful Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markHelpful(review.id)}
                  className={`text-xs ${
                    helpfulReviews.includes(review.id)
                      ? 'text-coral'
                      : 'text-gray-500'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {review.helpful + (helpfulReviews.includes(review.id) ? 1 : 0)}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '50K+', label: 'Довольных клиентов' },
            { value: '4.8', label: 'Средний рейтинг' },
            { value: '25K+', label: 'Отзывов' },
            { value: '98%', label: 'Рекомендуют' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gradient mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
