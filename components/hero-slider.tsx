"use client"

import { useState, useEffect } from "react"

const slides = [
  {
    video: "/video2.mp4",
    title: "Transacciones seguras y rápidas",
    subtitle: "Tu dinero en buenas manos",
  },
  {
    video: "/video3.mp4",
    title: "Servicio 24/7 para ti",
    subtitle: "Siempre disponibles cuando nos necesites",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden">
      {/* Background without overlay */}



      {/* Slider Videos */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <video
              src={slide.video}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Title */}
          <div className="relative">
            <h1 className="font-heading font-extrabold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-tight text-balance">
              <span className="inline-block animate-fade-in-up text-white drop-shadow-2xl">
                {slides[currentSlide].title.split(' ').slice(0, -3).join(' ')}
              </span>
              <br />
              <span 
                className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                {slides[currentSlide].title.split(' ').slice(-3).join(' ')}
              </span>
            </h1>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 border-2 border-primary/30 rounded-full animate-pulse"></div>
            <div 
              className="absolute -bottom-4 -right-4 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-float"
              style={{ animationDelay: "1s" }}
            ></div>
            
            {/* Animated underline */}
            <div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            ></div>
          </div>

          {/* Subtitle */}
          <div className="relative">
            <p
              className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-medium animate-fade-in-up text-balance drop-shadow-lg"
              style={{ animationDelay: "0.5s" }}
            >
              {slides[currentSlide].subtitle}
            </p>
            
            {/* Subtitle accent */}
            <div 
              className="absolute -top-1 -left-2 w-2 h-8 bg-gradient-to-b from-primary to-accent animate-slide-in-right"
              style={{ animationDelay: "0.7s" }}
            ></div>
          </div>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="#tasas"
              className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white text-primary rounded-full font-heading font-bold text-sm sm:text-base lg:text-lg hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center"
            >
              Ver Tasas de Cambio
            </a>
            <a
              href="#contacto"
              className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 glass text-white rounded-full font-heading font-semibold text-sm sm:text-base lg:text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 text-center"
            >
              Contáctanos
            </a>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
