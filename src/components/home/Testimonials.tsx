import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Movie Enthusiast',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    content: 'The booking experience was seamless! I love being able to see the actual theater layout and choose the perfect seats for my family.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Frequent Moviegoer',
    avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
    content: 'The mobile tickets feature is a game-changer. No more waiting in lines to pick up tickets!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Film Student',
    avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
    content: 'I appreciate the detailed movie descriptions and trailers. It helps me make informed decisions about what to watch.',
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
          What Our Customers Say
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Don't just take our word for it. Here's what movie lovers have to say about their experience with CineVerse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 relative"
          >
            <div className="absolute -top-3 -left-3 text-primary-500 transform rotate-180">
              <Quote size={40} opacity={0.2} />
            </div>
            
            <div className="flex items-center mb-4">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="w-12 h-12 rounded-full mr-4 border-2 border-primary-500"
              />
              <div>
                <h4 className="text-white font-medium">{testimonial.name}</h4>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
            
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < testimonial.rating ? "text-accent-500" : "text-gray-600"}
                  fill={i < testimonial.rating ? "currentColor" : "none"}
                />
              ))}
            </div>
            
            <p className="text-gray-300">{testimonial.content}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;