import React from 'react'
import { Plane, Compass, MapPin, Check } from "lucide-react";

import Card from './Card';
import TextField from './TextField';
import SelectField from './SelectField';
import Chip from './Chip';

import {
  TRAVEL_TYPES,
  ACCOMMODATION_OPTIONS,
  TRANSPORT_OPTIONS,
  INTEREST_OPTIONS,
} from "../../constants/customerConstant";
import { cx } from '../../utils/helpers';

const StepTrip = ({ data, setField, toggleArrayField }) => {
  return (
          <div className="space-y-6 anim-step-in">
            <Card title="Destination" subtitle="Where are they headed?" icon={Compass}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField label="Preferred Destination" placeholder="e.g. Bali, Indonesia" value={data.destination} onChange={(e) => setField("destination", e.target.value)} />
                <TextField label="Departure City" placeholder="e.g. Phnom Penh" value={data.departureCity} onChange={(e) => setField("departureCity", e.target.value)} />
                <TextField label="Departure Date" type="date" value={data.departureDate} onChange={(e) => setField("departureDate", e.target.value)} />
                <TextField label="Return Date" type="date" value={data.returnDate} onChange={(e) => setField("returnDate", e.target.value)} />
                <label className="sm:col-span-2 flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" checked={data.flexibleDates} onChange={(e) => setField("flexibleDates", e.target.checked)}
                    className="w-4 h-4 rounded accent-primary" />
                  <span className="text-[13.5px] text-foreground font-body">Dates are flexible</span>
                </label>
              </div>
            </Card>
      
            <Card title="Travel Type" subtitle="Who is travelling?" icon={Plane}>
              <div className="flex flex-wrap gap-2.5">
                {TRAVEL_TYPES.map((t) => (
                  <Chip key={t} active={data.travelType === t} onClick={() => setField("travelType", t)}>{t}</Chip>
                ))}
              </div>
            </Card>
      
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card title="Accommodation" icon={MapPin}>
                <SelectField label="Preferred Tier" value={data.accommodation} onChange={(e) => setField("accommodation", e.target.value)}>
                  <option value="">Select accommodation</option>
                  {ACCOMMODATION_OPTIONS.map((a) => <option key={a}>{a}</option>)}
                </SelectField>
              </Card>
      
              <Card title="Transportation" icon={Compass}>
                <div className="grid grid-cols-2 gap-3">
                  {TRANSPORT_OPTIONS.map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="transportation"
                        value={t}
                        checked={data.transportation === t}
                        onChange={(e) => setField("transportation", e.target.value)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-[13.5px] text-foreground font-body">
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
              </Card>
            </div>
      
            <Card title="Interests" subtitle="Select all that apply">
              <div className="flex flex-wrap gap-2.5">
                {INTEREST_OPTIONS.map((tag) => {
                  const active = data.interests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleArrayField("interests", tag)}
                      className={cx(
                        "px-3.5 py-1.5 rounded-full text-[12.5px] font-medium font-body border transition-all duration-150 flex items-center gap-1.5",
                        active ? "bg-success/12 border-success/30 text-success-ink" : "bg-surface border-border text-muted hover:border-border"
                      )}
                    >
                      {active && <Check className="w-3 h-3" />}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </Card>
      
            <Card title="Special Requests" subtitle="Dietary needs, accessibility, celebrations, etc.">
              <textarea
                rows={4}
                value={data.specialRequests}
                onChange={(e) => setField("specialRequests", e.target.value)}
                placeholder="Anything the tour team should know before booking..."
                className="w-full px-3.5 py-3 rounded-lg border border-border text-[14px] font-body text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-colors"
              />
            </Card>
          </div>
        )
}

export default StepTrip
