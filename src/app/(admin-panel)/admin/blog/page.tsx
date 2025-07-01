"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, BookOpen, Eye, Edit, Trash2, Plus, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import axiosInstance from "@/lib/axiosInstance"
import Image from "next/image"

interface BlogInterface {
  id: string
  title: string
  content: string
  imageUrl: string
  slug: string
  createdAt: string
  updatedAt: string
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogInterface[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogInterface | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const itemsPerPage = 5

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null as File | null,
  })

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await axiosInstance.get("/api/blogs")
      const data = await response.data
      setBlogs(data)
    } catch (error) {
      console.error("Error fetching blogs:", error)
      toast.error("Failed to fetch blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content || !formData.image) {
      toast.error("Please fill all fields and select an image")
      return
    }

    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("content", formData.content)
      formDataToSend.append("image", formData.image)

      const response = await axiosInstance.post("/api/blogs", formDataToSend)

      if (response.status === 200) {
        toast.success("Blog created successfully")
        setIsCreateModalOpen(false)
        setFormData({ title: "", content: "", image: null })
        fetchBlogs()
      } else {
        throw new Error("Failed to create blog")
      }
    } catch (error) {
      console.error("Error creating blog:", error)
      toast.error("Failed to create blog")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBlog || !formData.title || !formData.content) {
      toast.error("Please fill all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      let imageUrl = editingBlog.imageUrl // Keep existing image by default

      // If a new image is selected, upload it first using the new endpoint
      if (formData.image) {
        const formDataToSend = new FormData()
        formDataToSend.append("image", formData.image)

        const uploadResponse = await fetch("/api/upload-image", {
          method: "POST",
          body: formDataToSend,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.imageUrl
        } else {
          throw new Error("Image upload failed")
        }
      }

      const updateData = {
        title: formData.title,
        content: formData.content,
        imageUrl: imageUrl,
      }

      const response = await fetch(`/api/blogs/${editingBlog.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        toast.success("Blog updated successfully")
        setIsEditModalOpen(false)
        setEditingBlog(null)
        setFormData({ title: "", content: "", image: null })
        fetchBlogs()
      } else {
        throw new Error("Failed to update blog")
      }
    } catch (error) {
      console.error("Error updating blog:", error)
      toast.error("Failed to update blog")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteBlog = async (blogSlug: string) => {
    try {
      const response = await axiosInstance.delete(`/api/blogs/${blogSlug}`)

      if (response.status === 200) {
        toast.success("Blog deleted successfully")
        fetchBlogs()
      } else {
        throw new Error("Failed to delete blog")
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast.error("Failed to delete blog")
    }
  }

  const openEditModal = (blog: BlogInterface) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      content: blog.content,
      image: null,
    })
    setIsEditModalOpen(true)
  }

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Blog Management</h1>
            <p className="text-muted-foreground">Loading blogs...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground">Manage and track all blog posts</p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 max-w-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogs.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px]"
            />
          </div>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Blog</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateBlog} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter blog title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter blog content"
                  rows={6}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">Featured Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Blog"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Blogs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Blogs</CardTitle>
          <CardDescription>Complete list of blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blog</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBlogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={blog.imageUrl || "/placeholder.svg"}
                          alt={blog.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{truncateText(blog.title, 40)}</div>
                        <div className="text-sm text-muted-foreground">Slug: {blog.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(blog.createdAt)}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm text-muted-foreground break-words">{truncateText(blog.content, 100)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <BookOpen className="h-5 w-5" />
                              {blog.title}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="w-full h-64 rounded-lg overflow-hidden">
                              <Image
                                src={blog.imageUrl || "/placeholder.svg"}
                                alt={blog.title}
                                width={800}
                                height={256}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Created: {formatDate(blog.createdAt)}
                              </div>
                              <Badge variant="secondary">{blog.slug}</Badge>
                            </div>
                            <div className="prose max-w-none">
                              <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
                                {blog.content}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm" onClick={() => openEditModal(blog)}>
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {"This action cannot be undone. This will permanently delete the blog post '{blog.title}'."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBlog(blog.slug)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditBlog} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter blog title"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter blog content"
                rows={6}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-image">Update Image (optional)</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
              />
            </div>
            {editingBlog && (
              <div>
                <Label>Current Image</Label>
                <div className="w-32 h-32 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={editingBlog.imageUrl || "/placeholder.svg"}
                    alt={editingBlog.title}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingBlog(null)
                  setFormData({ title: "", content: "", image: null })
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Blog"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredBlogs.length)} of {filteredBlogs.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
