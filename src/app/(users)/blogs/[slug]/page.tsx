import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, User } from "lucide-react"

// This would typically come from a database or CMS
const blogPosts = {
  "future-sustainable-living": {
    id: 1,
    title: "The Future of Sustainable Living",
    content: `
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
      
      <p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      
      <h3>Why Sustainable Living Matters</h3>
      <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.</p>
      
      <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
      
      <h3>Getting Started</h3>
      <p>If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.</p>
    `,
    image: "/placeholder.svg?height=400&width=800",
    date: "June 28, 2024",
    author: "John Doe",
  },
  "earth-day-celebrations": {
    id: 2,
    title: "Earth Day Celebrations Around the World",
    content: `
      <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
      
      <h3>Global Celebrations</h3>
      <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form.</p>
      
      <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.</p>
    `,
    image: "/placeholder.svg?height=400&width=800",
    date: "June 25, 2024",
    author: "Jane Smith",
  },
  "green-technology-innovations": {
    id: 3,
    title: "Green Technology Innovations",
    content: `
      <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
      
      <p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
      
      <h3>Latest Innovations</h3>
      <p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</p>
      
      <p>Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
    `,
    image: "/placeholder.svg?height=400&width=800",
    date: "June 22, 2024",
    author: "Mike Johnson",
  },
}

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

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="text-lg">
            <Link href="/" className="opacity-80 hover:opacity-100">
              HOME
            </Link>
            <span className="mx-2">/</span>
            <span>BLOG POST</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blog Post Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <div className="relative h-64 md:h-96">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                  </div>

                  <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  <div className="mt-8 pt-6 border-t">
                    <Link href="/">
                      <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Recent Posts */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-green-500">RECENT POST</h3>
                <div className="space-y-4">
                  {recentPosts.map((recentPost) => (
                    <Link key={recentPost.id} href={`/blog/${recentPost.slug}`}>
                      <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={recentPost.image || "/placeholder.svg"}
                            alt={recentPost.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm leading-tight mb-1">{recentPost.title}</h4>
                          <p className="text-xs text-gray-500">{recentPost.date}</p>
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
