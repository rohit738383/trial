import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const blogPosts = [
  {
    id: 1,
    title: "The Future of Sustainable Living",
    excerpt:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    image: "/placeholder.svg?height=300&width=400",
    date: "June 28, 2024",
    slug: "future-sustainable-living",
  },
  {
    id: 2,
    title: "Earth Day Celebrations Around the World",
    excerpt:
      "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "/placeholder.svg?height=300&width=400",
    date: "June 25, 2024",
    slug: "earth-day-celebrations",
  },
  {
    id: 3,
    title: "Green Technology Innovations",
    excerpt:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting.",
    image: "/placeholder.svg?height=300&width=400",
    date: "June 22, 2024",
    slug: "green-technology-innovations",
  },
]

const recentPosts = [
  {
    id: 4,
    title: "Climate Change Solutions",
    image: "/placeholder.svg?height=80&width=80",
    date: "June 20, 2024",
    slug: "climate-change-solutions",
  },
  {
    id: 5,
    title: "Renewable Energy Trends",
    image: "/placeholder.svg?height=80&width=80",
    date: "June 18, 2024",
    slug: "renewable-energy-trends",
  },
  {
    id: 6,
    title: "Eco-Friendly Lifestyle Tips",
    image: "/placeholder.svg?height=80&width=80",
    date: "June 15, 2024",
    slug: "eco-friendly-lifestyle-tips",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">OUR BLOGS</h1>
          <div className="text-lg">
            <span className="opacity-80">HOME</span>
            <span className="mx-2">/</span>
            <span>OUR BLOGS</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blog Posts */}
          <div className="lg:col-span-2 space-y-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden shadow-lg">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-full">
                      <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                    </div>
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">{post.title}</h2>
                        <p className="text-gray-600 text-sm mb-2">{post.date}</p>
                        <p className="text-gray-700 leading-relaxed mb-4 line-clamp-4">{post.excerpt}</p>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button className="bg-green-600 hover:bg-green-700 text-white">Read More</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar - Recent Posts */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-green-500">RECENT POST</h3>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm leading-tight mb-1">{post.title}</h4>
                          <p className="text-xs text-gray-500">{post.date}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
