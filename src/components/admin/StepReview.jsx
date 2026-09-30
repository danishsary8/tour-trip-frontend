import React from 'react'
import {
  UserCircle2,
  Phone,
  Bell,
  Plane,
} from "lucide-react";

import ReviewCard from './ReviewCard';
import ReviewRow from './ReviewRow';

const StepReview = ({ data, confirmed, setConfirmed, onEdit }) => {
  return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 anim-step-in">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface rounded-xl border border-border shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full border border-border overflow-hidden bg-background flex items-center justify-center mb-3">
                {data.photo ? <img src={data.photo.url} className="w-full h-full object-cover" alt="Customer" /> : <UserCircle2 className="w-14 h-14 text-muted" />}
              </div>
              <p className="font-display font-semibold text-foreground">{data.fullName || "Unnamed Customer"}</p>
              <p className="text-[12.5px] text-muted font-body">{data.email || "No email provided"}</p>
            </div>
    
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded accent-primary"
                />
                <span className="text-[13px] text-foreground font-body leading-relaxed">
                  I confirm all customer information is correct.
                </span>
              </label>
            </div>
          </div>
    
          <div className="lg:col-span-2 space-y-6">
            <ReviewCard title="Personal Information" icon={UserCircle2} onEdit={() => onEdit(1)}>
              <ReviewRow label="Full Name" value={data.fullName} />
              <ReviewRow label="Gender" value={data.gender} />
              <ReviewRow label="Date of Birth" value={data.dob} />
              <ReviewRow label="Nationality" value={data.nationality} />
              <ReviewRow label="Occupation" value={data.occupation} />
              <ReviewRow label="Passport Number" value={data.passportNumber} />
              <ReviewRow label="Passport Expiry" value={data.passportExpiry} />
            </ReviewCard>
    
            <ReviewCard title="Contact Information" icon={Phone} onEdit={() => onEdit(1)}>
              <ReviewRow label="Email" value={data.email} />
              <ReviewRow label="Phone" value={data.phone ? `${data.countryCode} ${data.phone}` : ""} />
              <ReviewRow label="Address" value={[data.address, data.city, data.province, data.country, data.postalCode].filter(Boolean).join(", ")} />
            </ReviewCard>
    
            <ReviewCard title="Emergency Contact" icon={Bell} onEdit={() => onEdit(1)}>
              <ReviewRow label="Name" value={data.emergencyName} />
              <ReviewRow label="Relationship" value={data.relationship} />
              <ReviewRow label="Phone" value={data.emergencyPhone} />
              <ReviewRow label="Email" value={data.emergencyEmail} />
              <ReviewRow label="Address" value={data.emergencyAddress} />
            </ReviewCard>
    
            <ReviewCard title="Trip Preferences" icon={Plane} onEdit={() => onEdit(2)}>
              <ReviewRow label="Destination" value={data.destination} />
              <ReviewRow label="Departure City" value={data.departureCity} />
              <ReviewRow label="Dates" value={data.flexibleDates ? "Flexible" : [data.departureDate, data.returnDate].filter(Boolean).join(" → ")} />
              <ReviewRow label="Travel Type" value={data.travelType} />
              <ReviewRow label="Accommodation" value={data.accommodation} />
              <ReviewRow label="Transportation" value={data.transportation} />
              <ReviewRow label="Interests" value={data.interests.join(", ")} />
              <ReviewRow label="Special Requests" value={data.specialRequests} />
            </ReviewCard>
          </div>
        </div>
      )
}

export default StepReview
