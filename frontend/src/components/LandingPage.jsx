import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Moon, School, Sun, GraduationCap, Star, Users, BookOpen } from 'lucide-react';
import Navbar from './Navbar.jsx';

function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Major",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400",
      quote: "Campus360 transformed my college experience. The connections I've made and opportunities I've discovered are invaluable.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Business Administration",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400",
      quote: "As a freshman, this platform helped me navigate campus life seamlessly. It's an essential tool for every student.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Psychology Student",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400",
      quote: "The community here is incredible. I've found study groups, mentors, and lifelong friends through Campus360.",
      rating: 5
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Navbar */}
      {/* <nav className="fixed w-full px-6 py-4 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <School className="h-8 w-8" />
            <span className="font-bold text-xl">Campus360</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/elections" className="hover:text-indigo-600">Elections</Link>
            <Link to="/facilities" className="hover:text-indigo-600">Facilities</Link>
            <Link to="/complaints" className="hover:text-indigo-600">Complaints</Link>
            <Link to="/budget" className="hover:text-indigo-600">Budget</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link 
              to="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </nav> */}

      {/* <Navbar /> */}

      {/* Main Content Container with top padding for navbar */}
      <div className="pt-4">
        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50 mix-blend-multiply" />
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80"
              alt="College campus life"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Graduation Caps Container */}
          <div className="absolute w-full h-full overflow-hidden">
            <div className="animate-float-slow absolute top-1/4 left-1/4">
              <GraduationCap className="w-12 h-12 opacity-50 text-white" />
            </div>
            <div className="animate-float-medium absolute top-1/3 right-1/3">
              <GraduationCap className="w-16 h-16 opacity-30 text-white" />
            </div>
            <div className="animate-float-fast absolute bottom-1/4 right-1/4">
              <GraduationCap className="w-10 h-10 opacity-40 text-white" />
            </div>
            <div className="animate-float-diagonal absolute top-1/6 left-1/3">
              <GraduationCap className="w-14 h-14 opacity-40 text-white" />
            </div>
            <div className="animate-float-circular absolute top-2/5 right-1/5">
              <GraduationCap className="w-12 h-12 opacity-35 text-white" />
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="max-w-3xl backdrop-blur-sm bg-white/10 p-8 rounded-2xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
                Your Campus,<br />Your Journey
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white">
                Explore, Connect, and Elevate Your College Experience Like Never Before
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleNavigateToLogin}
                  className="px-8 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Join the Community
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Why Choose Campus360?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transform hover:scale-105 transition-all duration-300`}>
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Connect with Peers</h3>
                <p className="opacity-80">Build meaningful connections with fellow students who share your interests and goals.</p>
              </div>
              <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transform hover:scale-105 transition-all duration-300`}>
                <BookOpen className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Academic Resources</h3>
                <p className="opacity-80">Access a vast library of study materials, guides, and academic support.</p>
              </div>
              <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transform hover:scale-105 transition-all duration-300`}>
                <Star className="w-12 h-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Campus Events</h3>
                <p className="opacity-80">Stay updated with the latest events, clubs, and activities happening on campus.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className={`py-20 px-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">What Students Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg transform hover:scale-105 transition-all duration-300`}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm opacity-80">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="italic opacity-90">{testimonial.quote}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Campus Section */}
        <section className="relative">
          <div className="relative h-[600px] rounded-t-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
            <img
              src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=2000"
              alt="College campus"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-4xl px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Welcome to the Future of Campus Networking
                </h2>
                <p className="text-xl text-white opacity-90">
                  Join thousands of students who are already transforming their college experience with Campus360.
                </p>
                <button 
                  onClick={handleNavigateToLogin}
                  className="mt-8 px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LandingPage;