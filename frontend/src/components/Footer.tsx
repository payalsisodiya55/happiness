import React from 'react';
import { Button } from './ui/button';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: About Us */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">About Us</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Happiness Car Rental Service (travel Vertical) is the division of Happiness Car Rental Services Private Limited, And H.S. ENTERPRISES an Indian Company.
            </p>
            
            {/* Google Play Button */}
            <div className="pt-4">
              <img 
                src="https://happinesscarrental.com/img/playstorepng.png" 
                alt="Get it on Google Play" 
                className="h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.chalo.sawari', '_blank')}
              />
            </div>
          </div>

          {/* Column 2: Quick Links 1 */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/bookings" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span className="text-xs">›</span> Booking
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span className="text-xs">›</span> About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span className="text-xs">›</span> Blog/B2B Partner
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span className="text-xs">›</span> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/career" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span className="text-xs">›</span> Career
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links 2 */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/refund-policy" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span className="text-xs">›</span> Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span className="text-xs">›</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/sla-agreement" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span className="text-xs">›</span> SLA Agreement for Vendor / Driver
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span className="text-xs">›</span> Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/archives" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  <span className="text-xs">›</span> Archives Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 text-gray-400">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-gray-500" />
                <span className="text-sm leading-relaxed">
                  Near Rajratna Hotel, TATA Company, Pune Nashik Highway, Chakan, Pune, Maharashtra 410501
                </span>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <Mail className="w-5 h-5 flex-shrink-0 text-gray-500" />
                <a href="mailto:info@happinesscarrental.com" className="text-sm hover:text-white transition-colors">
                  info@happinesscarrental.com
                </a>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <Phone className="w-5 h-5 flex-shrink-0 text-gray-500" />
                <div className="flex flex-col text-sm">
                  <a href="tel:+917058928801" className="hover:text-white transition-colors">+91 7058928801</a>
                  <a href="tel:+918178710350" className="hover:text-white transition-colors">+91 8178710350</a>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              <Button size="icon" className="bg-[#1e293b] hover:bg-[#334155] rounded-full w-10 h-10 transition-colors border-none">
                <Facebook className="w-5 h-5 text-white" />
              </Button>
              <Button size="icon" className="bg-[#1e293b] hover:bg-[#334155] rounded-full w-10 h-10 transition-colors border-none">
                <Twitter className="w-5 h-5 text-white" />
              </Button>
              <Button size="icon" className="bg-[#1e293b] hover:bg-[#334155] rounded-full w-10 h-10 transition-colors border-none">
                <Instagram className="w-5 h-5 text-white" />
              </Button>
              <Button size="icon" className="bg-[#1e293b] hover:bg-[#334155] rounded-full w-10 h-10 transition-colors border-none">
                <Linkedin className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-[#020617]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <span>&copy; HCR, All right reserved.</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span>Designed By</span>
              <span className="font-semibold text-white">HCR</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;