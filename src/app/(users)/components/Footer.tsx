import { GraduationCap, Download, Facebook, Twitter, Instagram, Youtube, Mail, Phone,} from "lucide-react"
import Link from "next/link"

const Footer = () => {

  return (
    <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">Studytainment</span>
              </div>
              <p className="text-gray-400">
                Transforming education through innovative learning experiences for students of all ages.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-6 w-6 text-gray-400 hover:text-blue-400 cursor-pointer" />
                <Twitter className="h-6 w-6 text-gray-400 hover:text-blue-400 cursor-pointer" />
                <Instagram className="h-6 w-6 text-gray-400 hover:text-pink-400 cursor-pointer" />
                <Youtube className="h-6 w-6 text-gray-400 hover:text-red-400 cursor-pointer" />
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Our Programs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@studytainment.com
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +91 98765 43210
                </li>
                <li>Mumbai | Delhi | Bangalore</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Download App</h4>
              <div className="space-y-3">
                <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-3 cursor-pointer hover:bg-gray-700">
                  <Download className="h-6 w-6" />
                  <div>
                    <div className="text-xs text-gray-400">Download on</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-3 cursor-pointer hover:bg-gray-700">
                  <Download className="h-6 w-6" />
                  <div>
                    <div className="text-xs text-gray-400">Download on</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 Studytainment. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white">
                Terms & Conditions
              </Link>
              <Link href="#" className="hover:text-white">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  export default Footer;