import ContactForm from "@/app/(users)/components/Contact-form"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions about our programs? Need help choosing the right course? We're here to help you on your
          educational journey.
        </p>
      </div>

      {/* Contact Form */}
      <ContactForm />
    </div>
  )
}
