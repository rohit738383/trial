"use client";

import { useState, useEffect } from "react";
import * as z from "zod";
import { seminarSchema } from "@/schemas/seminarSchema";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  IndianRupee,
  CheckCircle,
  Sparkles,
  Trophy,
  GraduationCap,
  Target,
  Award,
  Rocket,
  Heart,
  Video,
  Headphones,
  Coffee,
  Gift,
  BookOpen,
  Timer,
  Loader2,
  Minus,
  Plus,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import { openRazorpayCheckout } from "@/lib/razorpay_modal";
import { useAuthStore } from "@/stores/useAuthStore";


type Seminar = z.infer<typeof seminarSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};


function SeminarCard({
  seminar,
  index,
  onBookingClick,
}: {
  seminar: Seminar;
  index: number;
  onBookingClick: (seminar: Seminar) => void;
}) {
  const isOngoing = seminar.status === "ONGOING";
  const isUpcoming = seminar.status === "UPCOMING";
  const isCompleted = seminar.status === "COMPLETED";
  // const user = useAuthStore((state) => state.user);


  const getStatusConfig = () => {
    if (isOngoing) {
      return {
        badge: {
          text: "Ongoing",
          color: "bg-gradient-to-r from-emerald-500 to-teal-500",
          icon: BookOpen,
        },
        button: {
          text: "Book Seat",
          color:
            "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
        },
        cardStyle:
          "bg-gradient-to-br from-white to-emerald-50 border-2 border-emerald-200",
        textColor: "text-gray-800",
        descColor: "text-gray-600",
      };
    }
    if (isUpcoming) {
      return {
        badge: {
          text: "Upcoming",
          color: "bg-gradient-to-r from-blue-500 to-indigo-500",
          icon: Timer,
        },
        button: null,
        cardStyle:
          "bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200",
        textColor: "text-gray-800",
        descColor: "text-gray-600",
      };
    }
    return {
      badge: {
        text: "Completed",
        color: "bg-gradient-to-r from-gray-500 to-gray-600",
        icon: CheckCircle,
      },
      button: null,
      cardStyle:
        "bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 opacity-90",
      textColor: "text-gray-700",
      descColor: "text-gray-500",
    };
  };

  const config = getStatusConfig();
  const IconComponent = config.badge.icon;

  const formatDate = (date: string | Date) => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover={!isCompleted ? "hover" : {}}
      custom={index}
      className="h-full"
    >
      <Card
        className={`h-full overflow-hidden relative group shadow-lg ${config.cardStyle}`}
      >
        {/* Completed Banner */}
        {isCompleted && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-center py-2 z-20">
            <span className="text-sm font-semibold flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              COMPLETED
            </span>
          </div>
        )}

        <div
          className={`absolute top-4 right-4 z-10 ${
            isCompleted ? "top-16" : ""
          }`}
        >
          <Badge
            className={`${config.badge.color} text-white shadow-md border-0 px-3 py-1 text-sm font-semibold`}
          >
            <IconComponent className="w-4 h-4 mr-2" />
            {config.badge.text}
          </Badge>
        </div>

        <CardHeader
          className={`relative z-10 ${
            isCompleted ? "pt-20" : "pt-16"
          } pb-4 px-6`}
        >
          <CardTitle
            className={`text-xl font-bold mb-3 leading-tight ${config.textColor} transition-all duration-300`}
          >
            {seminar.title}
          </CardTitle>
          <CardDescription
            className={`text-sm leading-relaxed ${config.descColor}`}
          >
            {seminar.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10 px-6 pb-6">
          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-gray-200">
              <div className="p-2 rounded-full bg-blue-100">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Date</p>
                <p className="text-sm font-semibold text-gray-800">
                  {formatDate(seminar.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-gray-200">
              <div className="p-2 rounded-full bg-green-100">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Time</p>
                <p className="text-sm font-semibold text-gray-800">
                  {seminar.time}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-gray-200">
            <div className="p-2 rounded-full bg-purple-100">
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Location</p>
              <p className="text-sm font-semibold text-gray-800">
                {seminar.location}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex w-[90px] items-center space-x-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className=" rounded-full bg-yellow-100">
                <IndianRupee className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Price</p>
                <p className="text-sm font-bold text-yellow-700">
                ₹{seminar.price}
                </p>
              </div>
            </div>
            <div className="flex w-[90px] items-center space-x-2 p-3 rounded-lg bg-indigo-50 border border-indigo-200">
              <div className="p-2 rounded-full bg-indigo-100">
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Seats</p>
                <p className="text-sm font-semibold text-gray-800">
                  {seminar.capacity}
                </p>
              </div>
            </div>
            <div className="flex w-[105px] items-center space-x-2 p-3 rounded-lg bg-rose-50 border border-rose-200">
              <div className="p-2 rounded-full bg-rose-100">
                <Clock className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Duration</p>
                <p className="text-sm font-semibold text-gray-800">
                  {seminar.duration}m
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {config.button && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-2"
            >
              <Button
                onClick={() => onBookingClick(seminar)}
                className={`w-full ${config.button.color} text-white shadow-md border-0 font-semibold py-3 text-base rounded-lg`}
              >
                <Target className="w-5 h-5 mr-2" />
                {config.button.text}
              </Button>
            </motion.div>
          )}

          {/* Status Messages */}
          {isUpcoming && (
            <div className="text-center py-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 flex items-center justify-center font-medium">
                <Gift className="w-4 h-4 mr-2" />
                Registration opens soon
              </p>
            </div>
          )}

          {isCompleted && (
            <div className="text-center py-3 bg-gray-100 rounded-lg border border-gray-300">
              <p className="text-sm text-gray-600 flex items-center justify-center font-medium">
                <Trophy className="w-4 h-4 mr-2" />
                Session completed successfully
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Loading Component
function LoadingCard() {
  return (
    <Card className="h-full overflow-hidden relative shadow-lg bg-white border-2 border-gray-200">
      <CardHeader className="pt-16 pb-4 px-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SeminarPage() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [quantity, setQuantity] = useState(1);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        setLoading(true);

        const res = await axios.get("/api/seminars");

        // Normalize data structure
        const rawSeminars = Array.isArray(res.data)
          ? res.data
          : res.data?.seminars ?? res.data?.data ?? [];

        // ✅ Zod validation
        const parsedSeminars = seminarSchema.array().parse(rawSeminars);

        setSeminars(parsedSeminars);
      } catch (err: unknown) {
        console.error("Error fetching seminars:", err);
      
        toast.error("Failed to load seminars");
      } finally {
        setLoading(false);
      }
    };

    fetchSeminars();
  }, []);

  const handleBooking = (seminar: Seminar) => {
    if (!user) {
      toast.error("Please login to book a seminar");
      console.log("user", user);
      return;
    }

    if (user.role === "ADMIN") {
  
      return;
    }

    setSelectedSeminar(seminar);
    setQuantity(1);
    setBookingModal(true);
  };

  const ongoingSeminars = seminars.filter((s) => s.status === "ONGOING");
  const upcomingSeminars = seminars.filter((s) => s.status === "UPCOMING");
  const completedSeminars = seminars.filter((s) => s.status === "COMPLETED");

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      if (!user) {
        toast.error("Please login to book a seminar");
        return;
      }

      const response = await axios.post("/api/booking", {
        seminarId: selectedSeminar?.id,
        quantity: quantity,
      });
      const data = await response.data;
      if (data.success) {
        await openRazorpayCheckout({
          bookingId: data.bookingId,
          orderId: data.orderId,
          amount: data.amount,
          user: {
            name: user.fullName,
            email: user.email,
            phone: user.phoneNumber,
          },
        });
      } else {
        alert(data.error);
      }
    } catch (error: unknown) {
      console.error("Booking error:", error);
      let errorMsg = "Failed to book seminar";
      if (axios.isAxiosError && axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (typeof error === "string") {
        errorMsg = error;
      } else if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
      ) {
        errorMsg = (error as { message: string }).message;
      }
      toast.error(errorMsg);
    }
  };

  const totalPrice = selectedSeminar ? selectedSeminar.price * quantity : 0;

  // Debug logging
  console.log("Current state:", {
    loading,
    totalSeminars: seminars.length,
    ongoing: ongoingSeminars.length,
    upcoming: upcomingSeminars.length,
    completed: completedSeminars.length,
    activeTab,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative overflow-hidden py-16 sm:py-24"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Hero Icons */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <GraduationCap className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-600" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 text-blue-500" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Rocket className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500" />
              </motion.div>
            </div>

            <motion.h1
              className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              Professional Seminars
            </motion.h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed font-medium px-4">
              Enhance your skills with expert-led training sessions
            </p>

            {/* Feature Icons */}
            <div className="flex justify-center items-center gap-4 sm:gap-8 mb-8">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Video className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  Live Sessions
                </span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="p-3 bg-blue-100 rounded-full">
                  <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  Expert Support
                </span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="p-3 bg-purple-100 rounded-full">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  Certificates
                </span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="p-3 bg-orange-100 rounded-full">
                  <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  Networking
                </span>
              </motion.div>
            </div>

            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="inline-block"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16 relative z-10 overflow-x-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TabsList className="grid w-full max-w-xs sm:max-w-2xl mx-auto grid-cols-3 mb-8 sm:mb-16 h-12 sm:h-14 bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl border border-gray-200">
              <TabsTrigger
                value="ongoing"
                className="text-xs sm:text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-xl transition-all duration-300 text-gray-600 px-2 sm:px-4"
              >
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Ongoing</span>
                <span className="sm:hidden">Live</span>
                <span className="ml-1">({ongoingSeminars.length})</span>
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="text-xs sm:text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-xl transition-all duration-300 text-gray-600 px-2 sm:px-4"
              >
                <Timer className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Upcoming</span>
                <span className="sm:hidden">Soon</span>
                <span className="ml-1">({upcomingSeminars.length})</span>
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="text-xs sm:text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-gray-600 data-[state=active]:text-white rounded-xl transition-all duration-300 text-gray-600 px-2 sm:px-4"
              >
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Completed</span>
                <span className="sm:hidden">Done</span>
                <span className="ml-1">({completedSeminars.length})</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-8">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-4" />
                <p className="text-gray-600">Loading seminars...</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {[1, 2, 3].map((i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            </div>
          )}

          {/* Content Tabs */}
          {!loading && (
            <>
              <TabsContent value="ongoing" className="mt-0">
                <motion.div
                  key="ongoing"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                  >
                    📚 Available for Booking
                  </motion.h2>

                  {ongoingSeminars.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No Ongoing Seminars
                      </h3>
                      <p className="text-gray-500">
                        Check back later for new seminars!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
                      {ongoingSeminars.map((seminar, index) => (
                        <SeminarCard
                          key={seminar.id}
                          seminar={seminar}
                          index={index}
                          onBookingClick={handleBooking}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="upcoming" className="mt-0">
                <motion.div
                  key="upcoming"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                  >
                    ⏰ Coming Soon
                  </motion.h2>

                  {upcomingSeminars.length === 0 ? (
                    <div className="text-center py-12">
                      <Timer className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No Upcoming Seminars
                      </h3>
                      <p className="text-gray-500">
                        New seminars will be announced soon!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
                      {upcomingSeminars.map((seminar, index) => (
                        <SeminarCard
                          key={seminar.id}
                          seminar={seminar}
                          index={index}
                          onBookingClick={handleBooking}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                <motion.div
                  key="completed"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent"
                  >
                    ✅ Completed Sessions
                  </motion.h2>

                  {completedSeminars.length === 0 ? (
                    <div className="text-center py-12">
                      <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No Completed Seminars
                      </h3>
                      <p className="text-gray-500">
                        Completed seminars will appear here!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
                      {completedSeminars.map((seminar, index) => (
                        <SeminarCard
                          key={seminar.id}
                          seminar={seminar}
                          index={index}
                          onBookingClick={handleBooking}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            </>
          )}
        </Tabs>

        <Dialog open={bookingModal} onOpenChange={setBookingModal}>
          <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
                <Target className="w-6 h-6 mr-2 text-blue-600" />
                Book Your Seat
              </DialogTitle>
              <DialogDescription className="text-gray-600" />
              {selectedSeminar && (
                <div className="mt-4 p-4 bg-white/70 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {selectedSeminar.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(selectedSeminar.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedSeminar.time}
                    </div>
                  </div>
                </div>
              )}
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Quantity Selector */}
              <div className="space-y-3">
                <Label
                  htmlFor="quantity"
                  className="text-base font-semibold text-gray-700"
                >
                  Number of Seats
                </Label>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-full border-2 border-blue-200 hover:bg-blue-50"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center space-x-3">
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          Number.parseInt(e.target.value) || 1
                        )
                      }
                      min="1"
                      max="10"
                      className="w-20 text-center text-lg font-bold border-2 border-blue-200 focus:border-blue-400"
                    />
                    <span className="text-gray-600 font-medium">
                      {quantity === 1 ? "seat" : "seats"}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                    className="h-10 w-10 rounded-full border-2 border-blue-200 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Maximum 10 seats per booking
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-yellow-200">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Price per seat:</span>
                    <span className="font-semibold">
                    ₹{selectedSeminar?.price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Quantity:</span>
                    <span className="font-semibold">×{quantity}</span>
                  </div>
                  <div className="border-t border-yellow-300 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">
                        Total Amount:
                      </span>
                      <span className="text-2xl font-bold text-yellow-600">
                      ₹{totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setBookingModal(false)}
                className="flex-1 border-2 border-gray-300 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleConfirmBooking}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}





