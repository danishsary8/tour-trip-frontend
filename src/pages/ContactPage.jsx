import React from 'react'
import { infoCards,socialLinks } from './admin/categories/data/contactData';
import TiktokIcon from './TiktokIcon';
import { Send,MapPin,Compass,ArrowRight } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="bg-[#F8FAFC] text-[#1F2937] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
 
      {/* Section 1 — Hero Banner */}
      <section className="relative px-4 pt-8 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[20px] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1566706546199-a93ba33ce9f7?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="h-[420px] w-full object-cover sm:h-[480px] md:h-[520px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
              Contact Us
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
              We're here to help you plan unforgettable journeys. Whether you
              have questions, need travel advice, or want assistance with
              bookings, our team is ready to help.
            </p>
          </div>
        </div>
      </section>
 
      {/* Section 2 — Contact Information + Contact Form */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left Column */}
          <div>
            <h2 className="font-serif text-3xl font-semibold text-[#1F2937] sm:text-4xl">
              Get In Touch
            </h2>
 
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {infoCards.map(({ icon: Icon, title, lines }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2F5BFF]/10">
                    <Icon className="h-5 w-5 text-[#2F5BFF]" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-[#1F2937]">
                    {title}
                  </h3>
                  <div className="mt-1 space-y-0.5">
                    {lines.map((line) => (
                      <p key={line} className="text-sm text-[#6B7280]">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
 
            <div className="mt-10">
              <h3 className="font-serif text-xl font-semibold text-[#1F2937]">
                Follow Us
              </h3>
              <div className="mt-4 flex items-center gap-4">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1F2937] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2F5BFF] hover:text-white hover:shadow-md"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                ))}
                <a
                  href="#"
                  aria-label="TikTok"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1F2937] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2F5BFF] hover:text-white hover:shadow-md"
                >
                  <TiktokIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
 
          {/* Right Column — Contact Form */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
            <h3 className="font-serif text-2xl font-semibold text-[#1F2937]">
              Send Us a Message
            </h3>
 
            <form className="mt-6 space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-1.5 block text-sm font-medium text-[#1F2937]"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-transparent bg-[#F3F4F6] px-4 py-3 text-sm text-[#1F2937] placeholder-[#9CA3AF] outline-none transition focus:border-[#2F5BFF] focus:ring-2 focus:ring-[#2F5BFF]/30"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-[#1F2937]"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-transparent bg-[#F3F4F6] px-4 py-3 text-sm text-[#1F2937] placeholder-[#9CA3AF] outline-none transition focus:border-[#2F5BFF] focus:ring-2 focus:ring-[#2F5BFF]/30"
                  />
                </div>
              </div>
 
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-sm font-medium text-[#1F2937]"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+855 12 345 678"
                    className="w-full rounded-xl border border-transparent bg-[#F3F4F6] px-4 py-3 text-sm text-[#1F2937] placeholder-[#9CA3AF] outline-none transition focus:border-[#2F5BFF] focus:ring-2 focus:ring-[#2F5BFF]/30"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block text-sm font-medium text-[#1F2937]"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="How can we help?"
                    className="w-full rounded-xl border border-transparent bg-[#F3F4F6] px-4 py-3 text-sm text-[#1F2937] placeholder-[#9CA3AF] outline-none transition focus:border-[#2F5BFF] focus:ring-2 focus:ring-[#2F5BFF]/30"
                  />
                </div>
              </div>
 
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-[#1F2937]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us about the trip you have in mind..."
                  className="w-full resize-none rounded-xl border border-transparent bg-[#F3F4F6] px-4 py-3 text-sm text-[#1F2937] placeholder-[#9CA3AF] outline-none transition focus:border-[#2F5BFF] focus:ring-2 focus:ring-[#2F5BFF]/30"
                />
              </div>
 
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2F5BFF] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#2447D1] hover:shadow-md"
              >
                Send Message
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
 
      {/* Section 3 — Location Map */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[20px] border border-[#E5E7EB] shadow-sm">
          <iframe
            title="Office location map"
            src="https://maps.google.com/maps?q=Siem%20Reap%2C%20Cambodia&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="h-[420px] w-full sm:h-[460px]"
            style={{ border: 0 }}
            loading="lazy"
          />
 
          <div className="absolute left-4 top-4 max-w-xs rounded-2xl border border-[#E5E7EB] bg-white/95 p-6 shadow-lg backdrop-blur sm:left-8 sm:top-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2F5BFF]/10">
              <MapPin className="h-5 w-5 text-[#2F5BFF]" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold text-[#1F2937]">
              Our Office
            </h3>
            <p className="mt-1 text-sm text-[#6B7280]">
              Wat Bo Road, Siem Reap, Cambodia
            </p>
            <a
              href="https://maps.google.com"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#2F5BFF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#2447D1] hover:shadow-md"
            >
              View on Google Maps
            </a>
          </div>
        </div>
      </section>
 
      {/* Section 4 — Call To Action */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl rounded-[20px] border border-[#E5E7EB] bg-white px-6 py-10 shadow-sm sm:px-10 lg:px-14">
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#2F5BFF]/10">
              <Compass className="h-9 w-9 text-[#2F5BFF]" />
            </div>
 
            <div className="max-w-xl">
              <h2 className="font-serif text-2xl font-semibold text-[#1F2937] sm:text-3xl">
                Plan Your Next Adventure
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#6B7280] sm:text-base">
                Have a destination in mind? Contact us today and let us help
                you create an unforgettable journey with personalized travel
                experiences.
              </p>
            </div>
 
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[200px]">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#2F5BFF] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#2447D1] hover:shadow-md"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#2F5BFF] bg-white px-6 py-3 text-sm font-semibold text-[#2F5BFF] transition-all duration-300 hover:bg-[#2F5BFF]/5"
              >
                Explore Tours
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage
