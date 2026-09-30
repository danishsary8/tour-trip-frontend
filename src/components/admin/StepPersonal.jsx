import React from 'react'
import { UserCircle2, Phone, Bell } from "lucide-react";
import Card from './Card';
import TextField from './TextField';
import SelectField from './SelectField';
import PhotoUpload from './PhotoUpload';
import { COUNTRY_CODES } from '../../constants/customerConstant';

const StepPersonal = ({ data, setField, errors }) => {
  return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 anim-step-in">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Basic Information" subtitle="Who is this customer?" icon={UserCircle2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <TextField label="Full Name" required placeholder="e.g. Sokha Chan" value={data.fullName}
                    error={errors.fullName} onChange={(e) => setField("fullName", e.target.value)} />
                </div>
                <SelectField label="Gender" value={data.gender} onChange={(e) => setField("gender", e.target.value)}>
                  <option value="">Select gender</option>
                  <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                </SelectField>
                <TextField label="Date of Birth" type="date" value={data.dob} onChange={(e) => setField("dob", e.target.value)} />
                <TextField label="Nationality" placeholder="e.g. Cambodian" value={data.nationality} onChange={(e) => setField("nationality", e.target.value)} />
                <TextField label="Occupation" placeholder="e.g. Software Engineer" value={data.occupation} onChange={(e) => setField("occupation", e.target.value)} />
                <TextField label="Passport Number" placeholder="e.g. N1234567" value={data.passportNumber} onChange={(e) => setField("passportNumber", e.target.value)} />
                <TextField label="Passport Expiry" type="date" value={data.passportExpiry} onChange={(e) => setField("passportExpiry", e.target.value)} />
              </div>
            </Card>
    
            <Card title="Contact Information" subtitle="How should we reach them?" icon={Phone}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField label="Email Address" required type="email" placeholder="name@email.com" value={data.email}
                  error={errors.email} onChange={(e) => setField("email", e.target.value)} />
                <div className="grid grid-cols-[88px_1fr] gap-2">
                  <SelectField label="Code" value={data.countryCode} onChange={(e) => setField("countryCode", e.target.value)}>
                    {COUNTRY_CODES.map((c) => <option key={c}>{c}</option>)}
                  </SelectField>
                  <TextField label="Phone Number" required placeholder="12 345 678" value={data.phone}
                    error={errors.phone} onChange={(e) => setField("phone", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <TextField label="Address" placeholder="Street address" value={data.address} onChange={(e) => setField("address", e.target.value)} />
                </div>
                <TextField label="City" value={data.city} onChange={(e) => setField("city", e.target.value)} />
                <TextField label="Province / State" value={data.province} onChange={(e) => setField("province", e.target.value)} />
                <TextField label="Country" value={data.country} onChange={(e) => setField("country", e.target.value)} />
                <TextField label="Postal Code" value={data.postalCode} onChange={(e) => setField("postalCode", e.target.value)} />
              </div>
            </Card>
    
            <Card title="Emergency Contact" subtitle="Who should we contact in case of an emergency?" icon={Bell}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField label="Contact Name" value={data.emergencyName} onChange={(e) => setField("emergencyName", e.target.value)} />
                <TextField label="Relationship" placeholder="e.g. Spouse, Parent" value={data.relationship} onChange={(e) => setField("relationship", e.target.value)} />
                <TextField label="Contact Phone" value={data.emergencyPhone} onChange={(e) => setField("emergencyPhone", e.target.value)} />
                <TextField label="Emergency Email" type="email" value={data.emergencyEmail} onChange={(e) => setField("emergencyEmail", e.target.value)} />
                <div className="sm:col-span-2">
                  <TextField label="Address" value={data.emergencyAddress} onChange={(e) => setField("emergencyAddress", e.target.value)} />
                </div>
              </div>
            </Card>
          </div>
    
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-[168px]">
              <PhotoUpload
                photo={data.photo}
                onUpload={(photo) => setField("photo", photo)}
                onRemove={() => setField("photo", null)}
              />
            </div>
          </div>
        </div>
      )
}

export default StepPersonal
