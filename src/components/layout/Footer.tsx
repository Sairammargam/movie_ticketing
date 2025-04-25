import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Facebook, Twitter, Instagram, Youtube, CreditCard, MapPin, MailOpen, PhoneCall } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div>
            <Link to="/" className="flex items-center space-x-2 text-primary-500 mb-4">
              <Film size={24} />
              <span className="font-display font-bold text-xl">CineVerse</span>
            </Link>
            <p className="mb-4">Experience movies like never before with our state-of-the-art theaters and premium booking experience.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors" aria-label="Youtube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/movies" className="hover:text-primary-500 transition-colors">All Movies</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-primary-500 transition-colors">My Bookings</Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">Promotions</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">News & Events</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">Nearby Theaters</a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0 text-primary-500" />
                <span>1234 Cinema Avenue, Movie District, Hollywood, CA 90210</span>
              </li>
              <li className="flex items-center">
                <PhoneCall size={18} className="mr-2 flex-shrink-0 text-primary-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <MailOpen size={18} className="mr-2 flex-shrink-0 text-primary-500" />
                <span>support@cineverse.com</span>
              </li>
              <li className="flex items-center">
                <CreditCard size={18} className="mr-2 flex-shrink-0 text-primary-500" />
                <span>We accept all major credit cards</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>&copy; {year} CineVerse. All rights reserved.</p>
          <p className="mt-2 text-sm">Designed and developed with ❤️ for movie enthusiasts</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;