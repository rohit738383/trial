"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Brain,
  Users,
  Smartphone,
  Video,
  GraduationCap,
  Star,
  Calendar,
  ArrowRight,
  Play,
  Target,
  Lightbulb,
  Heart,
  Award,
  Phone,
} from "lucide-react"
import Image from "next/image"

export default function StudytainmentHomepage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const services = [
    {
      title: "Studytainment Classroom",
      description: "Interactive learning environments that make education fun and engaging",
      icon: <Users className="h-8 w-8" />,
      color: "bg-blue-500",
    },
    {
      title: "Smart Study",
      description: "AI-powered personalized learning paths tailored to each student",
      icon: <Brain className="h-8 w-8" />,
      color: "bg-purple-500",
    },
    {
      title: "Online Classes",
      description: "Live interactive sessions with expert instructors from anywhere",
      icon: <Video className="h-8 w-8" />,
      color: "bg-green-500",
    },
    {
      title: "Activity Classes",
      description: "Hands-on learning through creative activities and projects",
      icon: <Play className="h-8 w-8" />,
      color: "bg-orange-500",
    },
    {
      title: "Android App",
      description: "Learn on-the-go with our comprehensive mobile learning platform",
      icon: <Smartphone className="h-8 w-8" />,
      color: "bg-red-500",
    },
  ]

  const whyChooseUs = [
    {
      problem: "Traditional learning is boring",
      solution: "We make education entertaining and engaging",
      icon: <Lightbulb className="h-6 w-6" />,
    },
    {
      problem: "One-size-fits-all approach",
      solution: "AI + Human mentorship for personalized learning",
      icon: <Target className="h-6 w-6" />,
    },
    {
      problem: "Limited age-appropriate content",
      solution: "Curated content for ages 3 to 30",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      problem: "Lack of practical skills",
      solution: "Focus on both academics and life skills",
      icon: <Award className="h-6 w-6" />,
    },
  ]


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }
  }

  // Mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart) {
      setTouchEnd(e.clientX)
    }
  }

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 sm:py-16 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-sm sm:text-base">
                  🎓 Transforming Education Since 2025
                </Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Where Education Becomes{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Entertainment
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Revolutionary learning experiences that engage, inspire, and empower students from age 3 to 30. Join
                  thousands who've transformed their educational journey with us.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
                >
                  Explore Programs
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-2 w-full sm:w-auto"
                >
                  Join a Seminar
                </Button>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <Image
                src="/home.webp?height=600&width=600"
                alt="Students learning with technology"
                width={600}
                height={600}
                className="rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg mx-auto"
              />
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white p-3 sm:p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold text-sm sm:text-base">4.9/5</span>
                  <span className="text-gray-600 text-xs sm:text-sm">from 10,000+ students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Strip */}
      <section className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Guiding Students from Age 3 to 30</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                <div className="bg-blue-600 p-3 sm:p-4 rounded-full">
                  <Play className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Activity</h3>
                <p className="text-gray-300 text-center text-sm sm:text-base leading-relaxed">
                  Hands-on learning through engaging activities and creative projects
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                <div className="bg-purple-600 p-3 sm:p-4 rounded-full">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Academics</h3>
                <p className="text-gray-300 text-center text-sm sm:text-base leading-relaxed">
                  Comprehensive curriculum covering all subjects with innovative methods
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                <div className="bg-green-600 p-3 sm:p-4 rounded-full">
                  <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Career</h3>
                <p className="text-gray-300 text-center text-sm sm:text-base leading-relaxed">
                  Professional guidance and skill development for future success
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services - New Slider Approach */}
      <section
        id="services"
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-purple-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16">
            <Badge className="bg-white/80 text-blue-800 hover:bg-white/90 text-sm sm:text-lg px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
              🚀 Our Premium Services
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
              Transform Your Learning
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
              Experience education like never before with our revolutionary learning solutions
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Main Slider Container */}
            <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/20">
              <div
                className="overflow-hidden rounded-xl sm:rounded-2xl cursor-grab active:cursor-grabbing select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div
                  className="flex transition-all duration-700 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {services.map((service, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-2 sm:px-4 lg:px-6">
                      <div className="text-center space-y-6 sm:space-y-8">
                        {/* Icon Section */}
                        <div className="relative">
                          <div
                            className={`${service.color} text-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl w-fit mx-auto shadow-2xl transform hover:scale-110 transition-all duration-300`}
                          >
                            <div className="text-3xl sm:text-4xl lg:text-6xl">{service.icon}</div>
                          </div>
                          {/* Floating Elements */}
                          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                          <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-bounce"></div>
                        </div>

                        {/* Content Section */}
                        <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
                          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight px-2">
                            {service.title}
                          </h3>
                          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed px-2 sm:px-4">
                            {service.description}
                          </p>

                          {/* Features List */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                            <div className="bg-white/80 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg border border-gray-100">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-current" />
                                <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                  Expert Instructors
                                </span>
                              </div>
                            </div>
                            <div className="bg-white/80 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg border border-gray-100">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                                <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                  Personalized Learning
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <div className=" pt-4 sm:pt-6">
                            <Button
                              size="lg"
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                            >
                              Explore {service.title}
                              <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Dots - Enhanced */}
              <div className="flex justify-center space-x-2 sm:space-x-3 mt-8 sm:mt-12">
                {services.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`relative transition-all duration-300 ${
                      index === currentSlide
                        ? "w-8 sm:w-12 h-3 sm:h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                        : "w-3 sm:w-4 h-3 sm:h-4 bg-gray-300 hover:bg-gray-400 rounded-full"
                    }`}
                  >
                    {index === currentSlide && (
                      <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Service Counter */}
              <div className="text-center mt-6 sm:mt-8">
                <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">👆 Swipe to explore more services</p>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl text-center border border-white/30">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">5+</div>
                <div className="text-gray-700 font-medium text-sm sm:text-base">Learning Methods</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl text-center border border-white/30">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">100%</div>
                <div className="text-gray-700 font-medium text-sm sm:text-base">Interactive</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl text-center border border-white/30">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-gray-700 font-medium text-sm sm:text-base">Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - New Approach */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 bg-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 sm:w-40 sm:h-40 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-green-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              Why Students Love Us
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We've revolutionized education by solving the biggest problems students face
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
                      {item.icon}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">0{index + 1}</div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-red-900/30 border border-red-500/30 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                      <h4 className="font-bold text-red-400 mb-2 text-sm sm:text-base">The Problem</h4>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{item.problem}</p>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 transform rotate-90" />
                    </div>

                    <div className="bg-green-900/30 border border-green-500/30 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                      <h4 className="font-bold text-green-400 mb-2 text-sm sm:text-base">Our Solution</h4>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{item.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Achievement Numbers */}
          <div className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">10K+</div>
              <div className="text-blue-100 text-xs sm:text-sm lg:text-base">Happy Students</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">500+</div>
              <div className="text-purple-100 text-xs sm:text-sm lg:text-base">Expert Teachers</div>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">95%</div>
              <div className="text-green-100 text-xs sm:text-sm lg:text-base">Success Rate</div>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">24/7</div>
              <div className="text-orange-100 text-xs sm:text-sm lg:text-base">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Become a Lifetime Member
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl opacity-90 leading-relaxed max-w-3xl mx-auto">
              Unlock unlimited access to all our programs, seminars, and exclusive content. Transform your learning
              journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
              >
                Schedule Call
                <Phone className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="lg"
                // variant="outline"
                className="bg-white border-2  text-blue-600 hover:bg-gray-100 hover:text-blue-600 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
              >
                Book Online
                <Calendar className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
