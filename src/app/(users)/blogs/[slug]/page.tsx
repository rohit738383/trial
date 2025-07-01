import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar } from "lucide-react"
import axios from "axios"

type Blog = {
  id: string;
  slug: string;
  title: string;
  imageUrl?: string;
  createdAt: string;
  content?: string;
};

async function getBlog(slug: string) {
  const res = await axios.get(`/api/blogs/${slug}`)
  if (res.status != 200) return null
  return res.data
}

async function getBlogs() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL }/api/blogs`)
  if (res.status != 200) return []
  return res.data
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlog(slug);
  const blogs = await getBlogs();

  if (!post || post.success === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/blogs">
            <Button>Back to Blogs</Button>
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
            <Link href="/blogs" className="opacity-80 hover:opacity-100">
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
                  <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>

                  <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  <div className="mt-8 pt-6 border-t">
                    <Link href="/blogs">
                      <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blogs
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-green-500">RECENT POST</h3>
                <div className="space-y-4">
                  {Array.isArray(blogs) && blogs.filter((b: Blog) => b.slug !== slug).slice(0, 3).map((post: Blog) => (
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
