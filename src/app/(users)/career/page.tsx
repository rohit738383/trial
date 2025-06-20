"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, Heart, Users, Zap, TrendingUp, Coffee, Laptop} from "lucide-react"

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-sm font-medium px-4 py-2">
              <Rocket className="w-4 h-4 mr-2" />
              Join Our Team 🚀
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Work with
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Studytainment
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Join our team and help us create amazing learning experiences for students worldwide.
            </p>

            <Button
              size="lg"
              className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => document.getElementById("openings")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Zap className="w-5 h-5 mr-2" />
              View Opportunities
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16  bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Join Us?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Make Impact",
                description: "Help students learn and grow through innovative educational content.",
              },
              {
                icon: Users,
                title: "Great Team",
                description: "Work with passionate people who care about education and technology.",
              },
              {
                icon: TrendingUp,
                title: "Grow Together",
                description: "Learn new skills and advance your career.",
              },
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-6">
                    <item.icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Status */}
      <section id="openings" className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-orange-500 rounded-full">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Current Openings</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We're not hiring right now, but we're always interested in talented people. Feel free to reach out!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">What We Offer</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Coffee, title: "Flexible Work", description: "Work when you're most productive" },
              { icon: Laptop, title: "Good Equipment", description: "Latest tools and technology" },
              { icon: TrendingUp, title: "Growth Opportunities", description: "We offer real chances to take on new challenges and grow in your role." },
              { icon: Heart, title: "Good Culture", description: "Friendly and supportive team" },
            ].map((perk, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mb-4">
                    <perk.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{perk.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{perk.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
