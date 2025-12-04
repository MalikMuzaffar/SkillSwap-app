import { Link } from "react-router-dom";
import { Facebook, Instagram, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-gray-300 pt-10 pb-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-3xl sm:text-2xl font-bold font-serif text-indigo-500 mb-3">
            Skill<span className="text-white">Swap</span>
          </h2>
          <p className="text-base sm:text-sm text-gray-400">
            A skill exchange platform where talent meets opportunity. Empower your growth with community learning.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl sm:text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-base sm:text-sm">
            <li><Link to="/" className="hover:text-indigo-400">Home</Link></li>
            <li><Link to="/explore" className="hover:text-indigo-400">Explore</Link></li>
            <li><Link to="/dashboard" className="hover:text-indigo-400">Dashboard</Link></li>
            <li><Link to="/chat" className="hover:text-indigo-400">Messages</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-xl sm:text-lg font-semibold text-white mb-3">Resources</h3>
          <ul className="space-y-2 text-base sm:text-sm">
            <li><Link to="/feedback" className="hover:text-indigo-400">Feedback</Link></li>
            <li><Link to="/notifications" className="hover:text-indigo-400">Notifications</Link></li>
            <li><Link to="/developer" className="hover:text-indigo-400">Developer</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-indigo-400">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h3 className="text-xl sm:text-lg font-semibold text-white mb-3">Connect with Us</h3>
          <div className="flex space-x-6 md:space-x-4 mb-4">
            <a href="https://www.facebook.com/usman.ali.797869" className="hover:text-indigo-400"><Facebook size={22} /></a>
            <a href="https://github.com/Usmanali3323" className="hover:text-indigo-400"><Github size={22} /></a>
            <a href="https://www.instagram.com/usman106525/" className="hover:text-indigo-400"><Instagram size={22} /></a>
            <a href="https://www.linkedin.com/in/usman-ali-8aa5a223b/" className="hover:text-indigo-400"><Linkedin size={22} /></a>
          </div>
          <p className="text-base sm:text-sm text-gray-400">support@skillswap.io</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm sm:text-xs text-gray-500">
        &copy; {new Date().getFullYear()} SkillSwap. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
