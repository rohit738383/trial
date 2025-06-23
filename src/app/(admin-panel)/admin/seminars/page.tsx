"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { ExportDropdown } from "@/app/(admin-panel)/components/export-dropdown";
import { ExportService } from "@/lib/export-utils";
import axiosInstance from "@/lib/axiosInstance";
import { seminarSchema } from "@/schemas/seminarSchema";
import * as z from "zod";
import { Seminar } from "@prisma/client";
import type { AxiosError } from "axios";

type SeminarFormData = z.infer<typeof seminarSchema> ;

const defaultFormData: SeminarFormData = {
  title: "",
  description: "",
  date: "",
  time: "",
  duration: 60,
  location: "",
  price: 0,
  capacity: 10,
  status: "UPCOMING",
};

export default function SeminarsPage() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [formData, setFormData] = useState<SeminarFormData>(defaultFormData);
  const [editingSeminar, setEditingSeminar] = useState<({ id: string } & SeminarFormData) | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch seminars
  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        const res = await axiosInstance.get("/api/seminars");
        const seminarList = Array.isArray(res.data) ? res.data : [];

        console.log("Fetched seminars:", seminarList);
        setSeminars(seminarList);
      } catch {
        toast.error("Failed to load seminars");
      }
    };
    fetchSeminars();
  }, []);

  const filteredSeminars = seminars.filter((seminar) =>
    (seminar.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (seminar.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parse = seminarSchema.safeParse(formData);

    console.log("parse", parse);
    if (!parse.success) {
      toast.error("Validation failed", {
        description: parse.error.issues.map((i) => i.message).join(", "),
      });
      return;
    }

    const payload = {
      ...formData,
      date: new Date(formData.date),
      price: formData.price,
    };
    console.log("payload", payload);

    try {
      if (editingSeminar) {
        const res = await axiosInstance.put(`/api/seminars/${editingSeminar.id}`, payload);
        setSeminars(
          seminars.map((s) => (s.id === editingSeminar.id ? res.data : s))
        );
        toast.success("Seminar updated");
        setEditingSeminar(null);
      } else {
        const res = await axiosInstance.post("/api/seminars", payload);
        setSeminars([...seminars, res.data]);
        toast.success("Seminar created");
      }
      setFormData(defaultFormData);
      setIsAddDialogOpen(false);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ errors?: string }>;
      toast.error("Request failed", {
        description: axiosError.response?.data?.errors || "Unknown error",
      });
    }
  };

  const handleEdit = (seminar: { id: string } & SeminarFormData) => {
    setEditingSeminar(seminar);
    setFormData({
      title: seminar.title,
      description: seminar.description,
      date: new Date(seminar.date).toISOString().split("T")[0],
      time: seminar.time,
      duration: seminar.duration,
      location: seminar.location,
      price: seminar.price,
      capacity: seminar.capacity,
      status: seminar.status,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/seminars/${id}`);
      setSeminars(seminars.filter((s) => s.id !== id));
      toast.success("Seminar deleted");
    } catch {
      toast.error("Failed to delete seminar");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Seminars Management</h1>
          <p className="text-muted-foreground">
            Manage your seminars and track enrollments
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Seminars
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seminars.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search seminars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
        </div>
        <ExportDropdown
          onExport={(format) =>
            ExportService.exportSeminarsData(filteredSeminars, format)
          }
          label="Export Seminars"
        />
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Seminar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Seminar</DialogTitle>
              <DialogDescription>
                Create a new seminar with all the necessary details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    style={{maxWidth: "465px"}}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      placeholder="e.g., 10:00 AM"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: Number(e.target.value) })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          capacity: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          status: value as "UPCOMING" | "COMPLETED" | "ONGOING",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPCOMING">Upcoming</SelectItem>
                        <SelectItem value="ONGOING">Ongoing</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Seminar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Seminars Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Seminars</CardTitle>
          <CardDescription>Manage and track all your seminars</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSeminars.map((seminar) => (
                <TableRow key={seminar.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{seminar.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {seminar.description.substring(0, 50)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{seminar.location}</TableCell>
                  <TableCell>
                    <div>
                      <div>{new Date(seminar.date).toDateString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {seminar.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {Math.floor(seminar.duration / 60)}h {seminar.duration % 60}
                    m
                  </TableCell>
                  <TableCell>₹{Number(seminar.price).toFixed(2)}</TableCell>
                  <TableCell>{seminar.capacity}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        seminar.status === "UPCOMING"
                          ? "default"
                          : seminar.status === "ONGOING"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {seminar.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit({
                              id: seminar.id,
                              title: seminar.title,
                              description: seminar.description,
                              date: typeof seminar.date === 'string' ? seminar.date : new Date(seminar.date).toISOString().split('T')[0],
                              time: seminar.time,
                              duration: seminar.duration,
                              location: seminar.location,
                              price: typeof seminar.price === 'number' ? seminar.price : Number(seminar.price),
                              capacity: seminar.capacity,
                              status: seminar.status as "UPCOMING" | "COMPLETED" | "ONGOING",
                            })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Seminar</DialogTitle>
                            <DialogDescription>
                              Update the seminar details.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                  id="edit-title"
                                  value={formData.title}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      title: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">
                                  Description
                                </Label>
                                <Textarea
                                  id="edit-description"
                                  value={formData.description}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      description: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-location">
                                    Location
                                  </Label>
                                  <Input
                                    id="edit-location"
                                    value={formData.location}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        location: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-date">Date</Label>
                                  <Input
                                    id="edit-date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        date: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-time">Time</Label>
                                  <Input
                                    id="edit-time"
                                    value={formData.time}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        time: e.target.value,
                                      })
                                    }
                                    placeholder="e.g., 10:00 AM"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-duration">
                                    Duration (minutes)
                                  </Label>
                                  <Input
                                    id="edit-duration"
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        duration: Number(e.target.value),
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-price">Price (₹)</Label>
                                  <Input
                                    id="edit-price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) =>
                                      setFormData({ ...formData, price: Number(e.target.value) })
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-capacity">
                                    Capacity
                                  </Label>
                                  <Input
                                    id="edit-capacity"
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        capacity: Number(e.target.value),
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-status">Status</Label>
                                  <Select
                                    value={formData.status}
                                    onValueChange={(
                                      value:
                                        | "UPCOMING"
                                        | "COMPLETED"
                                        | "ONGOING"
                                    ) =>
                                      setFormData({
                                        ...formData,
                                        status: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="UPCOMING">
                                        Upcoming
                                      </SelectItem>
                                      <SelectItem value="ONGOING">
                                        Ongoing
                                      </SelectItem>
                                      <SelectItem value="COMPLETED">
                                        Completed
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Update Seminar</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(seminar.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
