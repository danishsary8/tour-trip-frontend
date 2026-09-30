import React, { useState } from 'react';
import {
    User, Mail, Phone, Calendar, Lock, ShieldCheck,
    CreditCard, Landmark, DollarSign, MoreHorizontal,
    Minus, Plus, Info, Zap, Headphones, AlertCircle, HelpCircle
} from 'lucide-react';

export default function BookingPage() {
    // Quantities State
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(1);
    const [infants, setInfants] = useState(0);
    const [rooms, setRooms] = useState(1);

    // Payment Method State
    const [paymentMethod, setPaymentMethod] = useState('card');

    // Prices
    const adultPrice = 120;
    const childPrice = 90;
    const totalAmount = (adults * adultPrice) + (children * childPrice);

    return (
        <div className="w-full min-h-screen px-4 md:px-8 py-4 bg-white font-sans">
            <div className="w-full py-4 space-y-6">

                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    
                    <div className="lg:col-span-2 space-y-6">

                        {/* Traveler Information Card */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-5">
                            <h2 className="text-xl font-bold text-gray-900">Traveler Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Enter full name"
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Email Address */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            placeholder="Enter email address"
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            placeholder="Enter phone number"
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Country */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                                    <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                                        <option value="">Select your country</option>
                                        <option value="kh">Cambodia</option>
                                        <option value="us">United States</option>
                                    </select>
                                </div>

                                {/* Nationality */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nationality</label>
                                    <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                                        <option value="">Select your nationality</option>
                                        <option value="kh">Cambodian</option>
                                        <option value="us">American</option>
                                    </select>
                                </div>
                            </div>

                            {/* Special Request */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Special Request (optional)</label>
                                <textarea
                                    rows="3"
                                    placeholder="Tell us about your special request.."
                                    className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                ></textarea>
                            </div>
                        </div>

                        {/* Traveler Details Card */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-5">
                            <h2 className="text-xl font-bold text-gray-900">Traveler Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Tour Package */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tour Package</label>
                                    <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                                        <option>Angkor Wat Adventure</option>
                                    </select>
                                </div>

                                {/* Travel Date */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Travel Date
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split("T")[0]} // ការពារមិនឱ្យជ្រើសរើសថ្ងៃក្នុងអតីតកាល
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                                    <input
                                        type="text"
                                        value="3 Days / 2Nights"
                                        readOnly
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-600 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Incremental Counters */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">

                                {/* Adults Counter */}
                                <div className="text-center">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Number of Travelers</label>
                                    <div className="text-sm font-semibold text-gray-800 mb-2">Adults (12+years)</div>
                                    <div className="flex items-center justify-between border border-gray-300 rounded-lg p-1 bg-white">
                                        <button
                                            onClick={() => setAdults(Math.max(1, adults - 1))}
                                            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 border border-gray-200"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="font-semibold text-gray-800">{adults}</span>
                                        <button
                                            onClick={() => setAdults(adults + 1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 border border-gray-200"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Children Counter */}
                                <div className="text-center">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Number of Travelers</label>
                                    <div className="text-sm font-semibold text-gray-800 mb-2">Children (5-11years)</div>
                                    <div className="flex items-center justify-between border border-gray-300 rounded-lg p-1 bg-white">
                                        <button
                                            onClick={() => setChildren(Math.max(0, children - 1))}
                                            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 border border-gray-200"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="font-semibold text-gray-800">{children}</span>
                                        <button
                                            onClick={() => setChildren(children + 1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 border border-gray-200"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Infants Counter */}
                                <div className="text-center">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Number of Travelers</label>
                                    <div className="text-sm font-semibold text-gray-800 mb-2">Infants (0-5years)</div>
                                    <div className="flex items-center justify-between border border-gray-300 rounded-lg p-1 bg-white">
                                        <button
                                            onClick={() => setInfants(Math.max(0, infants - 1))}
                                            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 border border-gray-200"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="font-semibold text-gray-800">{infants}</span>
                                        <button
                                            onClick={() => setInfants(infants + 1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 border border-gray-200"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Room Counter */}
                                <div className="text-center">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Number of Travelers</label>
                                    <div className="text-sm font-semibold text-gray-800 mb-2">Room</div>
                                    <div className="flex items-center justify-between border border-gray-300 rounded-lg p-1 bg-white">
                                        <button
                                            onClick={() => setRooms(Math.max(1, rooms - 1))}
                                            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 border border-gray-200"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="font-semibold text-gray-800">{rooms}</span>
                                        <button
                                            onClick={() => setRooms(rooms + 1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 border border-gray-200"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Payment Information Card */}
                        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm space-y-5">
                            <h2 className="text-xl font-bold text-gray-900">Payment Information</h2>

                            {/* Payment Method Selector Buttons */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex items-center justify-center gap-1 p-2 text-sm font-semibold rounded-lg border transition ${paymentMethod === 'card'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <input type="radio" checked={paymentMethod === 'card'} readOnly className="accent-blue-600" />
                                    <CreditCard className="w-4 h-4" /> Credit Card
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('bank')}
                                    className={`flex items-center justify-center gap-1 p-2 text-sm font-semibold rounded-lg border transition ${paymentMethod === 'bank'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <input type="radio" checked={paymentMethod === 'bank'} readOnly className="accent-blue-600" />
                                    <Landmark className="w-4 h-4" /> Bank Transfer
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('paypal')}
                                    className={`flex items-center justify-center gap-1 p-2 text-sm font-semibold rounded-lg border transition ${paymentMethod === 'paypal'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <input type="radio" checked={paymentMethod === 'paypal'} readOnly className="accent-blue-600" />
                                    <DollarSign className="w-4 h-4" /> PayPal
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('other')}
                                    className={`flex items-center justify-center gap-1 p-2 text-sm font-semibold rounded-lg border transition ${paymentMethod === 'other'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <MoreHorizontal className="w-4 h-4" /> Other
                                </button>
                            </div>

                            {/* Card Inputs */}
                            <div className="space-y-4 pt-2">
                                <h3 className="font-semibold text-gray-800 text-sm">Card Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Card Number */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Card Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="••••••••••••••••"
                                                className="w-full pr-10 pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Expiry Date */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Expiry Date</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="w-full pr-10 pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* CVV */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">CVV</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                placeholder="123"
                                                maxLength="4"
                                                className="w-full pr-10 pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Name on Card */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Name on Card</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter name on card"
                                            className="w-full pr-10 pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Security Banner */}
                            <div className="flex items-center gap-3 p-2 bg-blue-50 text-blue-900 text-sm rounded-lg border border-blue-100">
                                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                                <span>Your payment information is secure and encrypted. We do not store your card details</span>
                            </div>

                        </div>

                    </div>

                    {/* RIGHT COLUMN: Summary & Trust Badges */}
                    <div className="space-y-6">

                        {/* Booking Summary Box */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Booking Summary</h2>

                            {/* Tour Thumbnail Info */}
                            <div className="flex gap-3 items-center">
                                <img
                                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200"
                                    alt="Angkor Wat"
                                    className="w-24 h-19 object-cover rounded-lg"
                                />
                                <div className="space-y-1">
                                    <h3 className="font-bold text-xl text-gray-900 leading-tight">Angkor Wat Adventure</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        📍 Siem Reap
                                    </p>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        🕒 3 Days /2 Nights
                                    </p>
                                </div>
                            </div>

                            {/* Cost Calculations */}
                            <div className="space-y-2 text-sm border-t border-b border-gray-100 py-3 text-gray-600">
                                <div className="flex justify-between items-center">
                                    <span>Adults (12+years)</span>
                                    <span className="font-medium text-gray-900">{adults} × ${adultPrice} <span className="ml-4 font-bold">${adults * adultPrice}</span></span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Children (5-11years)</span>
                                    <span className="font-medium text-gray-900">{children} × ${childPrice} <span className="ml-4 font-bold">${children * childPrice}</span></span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Infants (0-5years)</span>
                                    <span className="font-medium text-gray-900">{infants} × $0 <span className="ml-4 font-bold">$0</span></span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Room</span>
                                    <span className="font-medium text-gray-900">{rooms} × $0 <span className="ml-4 font-bold">$0</span></span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Discount</span>
                                    <span className="font-medium text-gray-900">-$0 <span className="ml-4 font-bold">-$0</span></span>
                                </div>
                            </div>

                            {/* Total Price */}
                            <div className="flex justify-between items-center pt-1">
                                <span className="font-bold text-gray-900 text-xl">Total Amount</span>
                                <span className="font-extrabold text-red-500 text-xl">${totalAmount}</span>
                            </div>

                            {/* Action Button */}
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                                <Lock className="w-4 h-4" /> Confirm Booking
                            </button>

                            <div className="flex items-center justify-center gap-1 text-sm text-gray-500 pt-1">
                                <Lock className="w-3 h-3" /> You will not be charged yet
                            </div>
                        </div>

                        {/* Why Book With Us Box */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Why Book With Us?</h3>

                            <div className="space-y-4 text-sm">
                                <div className="flex gap-3">
                                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-gray-800">Best Price Guarantee</h4>
                                        <p className="text-gray-500 mt-0.5">We offer the best price for your trip.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Zap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-gray-800">Free Cancellation</h4>
                                        <p className="text-gray-500 mt-0.5">Cancel up to 24 hours before your trip.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-gray-800">Instant Confirmation</h4>
                                        <p className="text-gray-500 mt-0.5">Get instant confirmation after booking.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Headphones className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-gray-800">24/7 Customer Support</h4>
                                        <p className="text-gray-500 mt-0.5">We are here to help you anytime.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                {/* BOTTOM: Booking Process Stepper */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-base mb-6">Booking Process</h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">

                        <div className="flex items-center gap-3 ">
                            <div className="w-8 h-8 rounded-full border-2 border-blue-600 text-blue-600 font-bold flex items-center justify-center shrink-0 text-sm">
                                1
                            </div>
                            <div>
                                <div className="text-sm font-bold text-blue-600">Fill Information</div>
                                <div className="text-sm text-gray-400">Booking Process</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-600 font-bold flex items-center justify-center shrink-0 text-sm">
                                2
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-800">Review Booking</div>
                                <div className="text-sm text-gray-400">Check your booking summary</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-600 font-bold flex items-center justify-center shrink-0 text-sm">
                                3
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-800">Confirm & Pay</div>
                                <div className="text-sm text-gray-400">Confirm and complete payment</div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-600 font-bold flex items-center justify-center shrink-0 text-sm">
                                4
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-800">Get Confirmation</div>
                                <div className="text-sm text-gray-400">Receive your booking confirmation</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Support Alert Banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-center gap-2 text-sm text-amber-900 font-medium">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Need help with your booking? Contact us at +855 23 348 907 or email info@tourtrip.com
                </div>

            </div>
        </div>
    );
}