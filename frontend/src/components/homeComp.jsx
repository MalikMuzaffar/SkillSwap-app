import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import homeImage from "../assest/home.jpg";

// -------------------- Static Features --------------------
const features = [
  {
    title: "Add Your Skill",
    desc: "Have a talent or knowledge in something? Upload your skill and inspire others. Everyone has something to teach.",
    icon: (
      <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    title: "Discover Opportunities",
    desc: "Browse a growing collection of skills and connect with real mentors. Whether upskilling or learning something new—explore freely.",
    icon: (
      <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx={11} cy={11} r={8} />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    title: "Connect with Learners",
    desc: "Meet passionate learners and mentors. Share your journey and grow through meaningful exchanges.",
    icon: (
      <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-6a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 10-8 0 4 4 0 008 0z" />
      </svg>
    ),
  },
];

const HomeComp = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // -------------------- Fetch Reviews --------------------
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get("/review/all-review/application");
        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map(item => ({
            name: item?.senderId?.fullName || "Anonymous",
            role: item?.senderId?.designation || "User",
            image: item?.senderId?.profileImage || "https://via.placeholder.com/150",
            quote: item?.comment || "No comment provided.",
            rating: item?.rating || 0,
          }));
          setTestimonials(formatted);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  // -------------------- Navigation Buttons --------------------
  const handleFeatureClick = (title) => {
    const routes = {
      "Add Your Skill": "/add-skill",
      "Discover Opportunities": "/explore",
      "Connect with Learners": "/chat",
    };
    navigate(routes[title]);
  };

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const renderStars = (count) => (
    [...Array(5)].map((_, i) => (
      <span key={i} className={i < count ? "text-yellow-400" : "text-gray-300"}>★</span>
    ))
  );

  return (
    <main className="min-h-screen bg-white font-sans">
      
      {/* -------------------- Hero Section -------------------- */}
      <section className="relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">
          
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight animate-fadeInUp">
              Empower Your Future<br /> by Sharing What You Know
            </h1>
            <p className="text-lg text-indigo-100 max-w-md animate-fadeInUp">
              SkillSwap is more than a platform—it's a movement to share, grow, and learn together.
            </p>
            <div className="flex gap-4 animate-fadeInUp">
              <Link to="/signup" className="bg-white text-indigo-700 px-6 py-3 rounded-full font-semibold hover:bg-indigo-100 shadow-md transition-all">
                Get Started
              </Link>
              <Link to="/explore" className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-700 transition-all">
                Explore Skills
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl animate-slideInRight">
            <img src={homeImage} alt="Skill Sharing" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-indigo-600 opacity-40 mix-blend-multiply" />
          </div>
        </div>
      </section>

      {/* -------------------- Features Section -------------------- */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-10">Why Choose SkillSwap?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {features.map(({ title, desc, icon }) => (
              <div key={title} onClick={() => handleFeatureClick(title)} className="cursor-pointer bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-transform">
                <div className="mb-4 flex justify-center">{icon}</div>
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- Testimonials Section -------------------- */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-12">What Our Members Say</h2>
          
          {/* Testimonial Navigation */}
          <div className="flex justify-center gap-4 mb-8">
            <button onClick={prev} className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-xl font-bold">&larr;</button>
            <button onClick={next} className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-xl font-bold">&rarr;</button>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[0, 1].map((offset) => {
              const index = (activeIndex + offset) % testimonials.length;
              const testimonial = testimonials[index];
              if (!testimonial) return null;

              return (
                <div
                  key={index}
                  onClick={() => navigate("/add-skill")}
                  className="bg-gray-50 border border-indigo-100 p-8 rounded-xl shadow-lg text-center transition hover:shadow-xl"
                >
                  <img src={testimonial.image} alt={testimonial.name} className="w-20 h-20 mx-auto rounded-full border-4 border-indigo-500 mb-4 shadow" />
                  <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">{testimonial.role}</p>
                  <p className="text-gray-700 italic text-base leading-relaxed mb-2">“{testimonial.quote}”</p>
                  <div className="text-sm">{renderStars(testimonial.rating)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------- Call to Action -------------------- */}
      <section className="bg-indigo-700 py-16 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Your Next Big Opportunity Starts Here</h3>
        <p className="text-indigo-100 mb-6 text-lg max-w-xl mx-auto">
          Whether you're sharing your wisdom or learning a new skill—SkillSwap is your community.
        </p>
        <Link to="/explore" className="bg-white text-indigo-700 px-10 py-3 text-lg rounded-full font-semibold hover:bg-indigo-100 transition">
          Join the Community
        </Link>
      </section>
    </main>
  );
};

export default HomeComp;
