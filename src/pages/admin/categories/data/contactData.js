import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ArrowRight,
  Compass,
} from "lucide-react";
import { FaFacebook,FaInstagram,FaTwitter } from "react-icons/fa";



export const infoCards = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["Siem Reap, Cambodia"],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+855 12 345 678", "Monday – Sunday", "8:00 AM – 8:00 PM"],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["info@travelagency.com", "Reply within 24 hours"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Monday – Sunday", "8:00 AM – 8:00 PM"],
  },
];
 
export const socialLinks = [
  { icon: FaFacebook, label: "Facebook", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaTwitter, label: "X (Twitter)", href: "#" },
];