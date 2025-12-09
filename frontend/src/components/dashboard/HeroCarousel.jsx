import React, { useState, useEffect } from 'react';
import '../../styles/dashboard/HeroCarousel.css';

// Import images using relative path from components/dashboard to src/assets
import slide1Img from '../../assets/slide1.png';
import slide2Img from '../../assets/slide2.png';
import slide3Img from '../../assets/slide3.png';

console.log('Image imports:', { slide1Img, slide2Img, slide3Img });

const slides = [
  {
    id: 1,
    title: "Stay Organized, Stay Ahead",
    subtitle: "Track your study sessions, manage notes, and achieve your academic goals effortlessly.",
    image: slide1Img,
    alt: "Organization illustration",
    tags: ["📚 Organized", "🎯 Focused", "✅ Productive"]
  },
  {
    id: 2,
    title: "Collaborate & Grow Together",
    subtitle: "Connect with peers, share knowledge, and build your academic network.",
    image: slide2Img,
    alt: "Collaboration illustration",
    tags: ["🤝 Teamwork", "💬 Social", "🌐 Connected"]
  },
  {
    id: 3,
    title: "Master Your Schedule",
    subtitle: "Never miss a deadline with smart reminders and calendar integration.",
    image: slide3Img,
    alt: "Time management illustration",
    tags: ["⏰ Timely", "📅 Planned", "🔔 Reminded"]
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sweepActive, setSweepActive] = useState(false);

  // Auto-transition logic (5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Sweep effect every 3 seconds
  useEffect(() => {
    const sweepTimer = setInterval(() => {
      setSweepActive(true);
      setTimeout(() => setSweepActive(false), 1500);
    }, 3000);

    return () => clearInterval(sweepTimer);
  }, []);

  return (
    <div className="hero-carousel-content">
      {/* Sweep Effect Overlay */}
      {sweepActive && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <div className="hero-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>
      )}
      
      {/* Animated Background Elements */}
      <div className="hero-bg-effects">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="grid-overlay"></div>
      </div>

      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
        >
          <div className="hero-slide-wrapper">
            {/* Left Side: Enhanced Text Content */}
            <div className="hero-text-section">
              <div className="slide-number">
                <span className="number-text">0{slide.id}</span>
                <div className="number-line"></div>
              </div>
              
              <div className="hero-text-content">
                <h1 className="hero-title">
                  {slide.title}
                  <div className="title-underline"></div>
                </h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                
                {/* Feature Tags */}
                <div className="feature-tags">
                  {slide.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Enhanced Image with Effects */}
            <div className="hero-image-section">
              <div className="image-container">
                {/* Decorative Elements */}
                <div className="image-glow"></div>
                <div className="image-ring ring-1"></div>
                <div className="image-ring ring-2"></div>
                <div className="corner-accent top-left"></div>
                <div className="corner-accent bottom-right"></div>
                
                <img 
                  src={slide.image} 
                  alt={slide.alt}
                  className="hero-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    console.log('Image failed to load:', slide.image);
                  }}
                />
                
                {/* Image Badge */}
                <div className="image-badge">
                  <span className="badge-icon">⚡</span>
                  <span className="badge-text">Featured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Navigation System */}
      <div className="hero-navigation">
        {/* Navigation Dots */}
        <div className="hero-dots">
          {slides.map((_, index) => (
            <button
              key={index} 
              className={`dot ${index === currentSlide ? 'active-dot' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className="dot-inner"></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
