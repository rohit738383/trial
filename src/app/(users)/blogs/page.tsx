import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"

// Blog interface for type safety
interface Blog {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  slug: string;
  createdAt: string;
  updatedAt?: string;
}

// Server Component: fetch blogs from API
async function getBlogs() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL }/api/blogs`)
  if (res.status != 200) return []
  return res.data
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export default async function BlogPage() {
  const blogs = await getBlogs()

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
            {Array.isArray(blogs) && blogs.length > 0 ? blogs.map((post: Blog) => (
              <Card key={post.id} className="overflow-hidden shadow-lg">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-full">
                      <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                    </div>
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">{post.title}</h2>
                        <p className="text-gray-600 text-sm mb-2">{formatDate(post.createdAt)}</p>
                        <p className="text-gray-700 leading-relaxed mb-4 line-clamp-4">{post.content.slice(0, 180)}...</p>
                      </div>
                      <Link href={`/blogs/${post.slug}`}>
                        <Button className="bg-green-600 hover:bg-green-700 text-white">Read More</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center text-gray-500">No blogs found.</div>
            )}
          </div>

          {/* Sidebar - Recent Posts */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-green-500">RECENT POST</h3>
                <div className="space-y-4">
                  {Array.isArray(blogs) && blogs.slice(0, 3).map((post: Blog) => (
                    <Link key={post.id} href={`/blogs/${post.slug}`}>
                      <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={post.imageUrl || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm leading-tight mb-1">{post.title}</h4>
                          <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
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

