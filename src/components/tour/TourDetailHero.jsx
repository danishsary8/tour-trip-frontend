import React from 'react';
import { MapPin, Star, Clock, Calendar } from 'lucide-react';

const TourDetail = () => {
    const images = [
        {
            src: "https://i.pinimg.com/1200x/93/6e/2e/936e2ef3f6dac8116740c3862c50d3ca.jpg",
            alt: "Angkor Wat",
            className: "col-span-1 md:col-span-2 row-span-2 h-full min-h-[350px]"
        },
        {
            src: "https://cloudfront-us-east-1.images.arcpublishing.com/radiofreeasia/PLWHAGOILIMYVY3V6GXUBCB3I4.jpg",
            alt: "Airplane",
            className: "h-44 md:h-52"
        },
        {
            src: "https://cdn.sanity.io/images/nxpteyfv/goguides/fc890f80006606e0bbf8a4bfbab232f422b40412-1600x1066.jpg",
            alt: "pub Street",
            className: "h-44 md:h-52"
        },
        {
            src: "https://i.pinimg.com/1200x/9f/05/32/9f0532fed1cd0d329a4b67b2b96df8a1.jpg",
            alt: "siem reap hotel",
            className: "h-44 md:h-52"
        },
        {
            src: "https://i.pinimg.com/736x/be/86/00/be86007bad3cb63804c8befdfa610a45.jpg",
            alt: "Cambodian Food",
            className: "h-44 md:h-52"
        },
        {
            src: "https://i.pinimg.com/736x/e3/40/19/e34019f115f864ce4684703225c35f49.jpg",
            alt: "culture",
            className: "h-44 md:h-52"
        }
    ];

    const highlights = [
        {
            image:"https://i.pinimg.com/736x/02/29/f2/0229f26b1752bccda0a56c076e3997c3.jpg",
            title: "Visit Angkor Wat",
            subtitle: "at sunrise",
        },
        {
            image:"https://i.pinimg.com/1200x/8a/06/3c/8a063c70727124cba37f67ca92e7dea1.jpg",
            title: "Explore",
            subtitle: "Ta Prohm Temple",
        },
        {
            image:"https://i.pinimg.com/1200x/9c/8c/87/9c8c871608d2a5aaf7288a0debdb6679.jpg",
            title: "Discover",
            subtitle: "Bayon Temple",
        },
        {
            image:"https://i.pinimg.com/736x/22/a4/22/22a4228ed0105b144648fd9fce226da4.jpg",
            title: "Explore",
            subtitle: "Tonle Sap Lake",
        },
        {
            image:"https://i.pinimg.com/736x/be/86/00/be86007bad3cb63804c8befdfa610a45.jpg",
            title: "Enjoy traditional",
            subtitle: "Cambodian food",
        },
        {
            image:"https://i.pinimg.com/736x/eb/4d/eb/eb4debfbc6b9e679a2d355db95687ab7.jpg",
            title: "Experience",
            subtitle: "Local culture",
        },
    ];

    return (
        <div className="w-full min-h-screen bg-white px-4 md:px-8 py-4 font-sans">
            <div className=" mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4 border-b border-gray-100 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                            Discover Angkor Wat & Siem Reap
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-base text-gray-600 mb-2 md:mb-0">
                            <div className="flex items-center gap-1.5 font-medium">
                                <MapPin className="w-5 h-5 text-gray-800" />
                                <span>Siem Reap, Cambodia</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                <span className="font-semibold text-gray-900">4.9</span>
                                <span className="text-gray-500">(128 Reviews)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-5 h-5 text-gray-500" />
                                <span>3 days / 2 nights</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="text-sm text-gray-500 font-medium block">From</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl md:text-3xl font-bold text-emerald-600">$189</span>
                                <span className="text-sm text-gray-500">/ person</span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Booking Button */}
                    <div className="flex items-center justify-between md:justify-end md:mt-20 mt-2">
                        <button style={{ borderRadius: '12px' }}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg px-8 py-3.5 transition-all shadow-md hover:shadow-lg"
                        >
                            <Calendar className="w-5 h-5" />
                            <span>Book Now</span>
                        </button>
                    </div>
                </div>

                {/* Gallery Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
                    <div className="lg:col-span-6 overflow-hidden rounded-2xl bg-gray-100 h-[380px] lg:h-[420px]">
                        <img
                            src={images[0].src}
                            alt={images[0].alt}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                        />
                    </div>
                    <div className="lg:col-span-6 grid grid-rows-2 gap-2 h-[380px] lg:h-[420px]">
                        <div className="grid grid-cols-2 gap-2 h-full overflow-hidden">
                            {images.slice(1, 3).map((img, idx) => (
                                <div key={idx} className="overflow-hidden rounded-2xl bg-gray-100 h-full">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-3 gap-2 h-full overflow-hidden">
                            {images.slice(3, 6).map((img, idx) => (
                                <div key={idx} className="overflow-hidden rounded-2xl bg-gray-100 h-full">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>

                    </div>

                </div>

                {/* About Section */}
                <div className="mb-2 border-b border-gray-100 pb-3">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">About This Tour</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Experience the beauty, history, and culture of Siem Reap on an unforgettable 3-day adventure.
                        Explore the magnificent Angkor Wat, discover ancient temples, visit Tonlé Sap Lake, enjoy delicious
                        Cambodian cuisine, and experience the unique local culture and lifestyle.
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Tour Highlights
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        {highlights.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center text-center p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors"
                            >
                                <div className="w-22 h-16 rounded-xl overflow-hidden mb-2">
                                    <img
                                        src={item.image}
                                        alt={`${item.title} ${item.subtitle}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-base font-semibold text-gray-900 block">
                                    {item.title}
                                </span>
                                <span className="text-sm text-gray-500 block">
                                    {item.subtitle}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDetail;