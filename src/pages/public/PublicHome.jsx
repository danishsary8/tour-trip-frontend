import { CalendarDays, ChevronDown, MapPin, Search, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/images/trips/Angkor-Wat(1).jpg";

export default function PublicHome() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("2");

  function handleSearch(event) {
    event.preventDefault();
    navigate("/admin/masters/tours");
  }

  return (
    <main className="min-h-screen bg-[#f5f1e9] p-2 sm:p-3">
      <section className="relative isolate min-h-[calc(100vh-1rem)] overflow-hidden rounded-xs text-white sm:min-h-[calc(100vh-1.5rem)]">
        <img
          src={heroImage}
          alt="Angkor Wat at sunset"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,28,34,0.18),rgba(16,42,92,0.08)_42%,rgba(15,48,128,0.6))]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(4,24,30,0.42),transparent_48%)]" />

        <div className="mx-auto flex w-full max-w-310 flex-col items-end px-5 pt-16 sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">
          <div className="w-full max-w-155 text-left lg:mr-2">
            <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-slate-950 sm:text-sm">
              DISCOVER · EXPLORE · REMEMBER
            </p>
            <h1 className="max-w-155 font-serif text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-[70px]">
              Explore Cambodia,
              <br />
              one trip at a time.
            </h1>
            <p className="mt-5 max-w-130 text-base leading-7 text-gray-200 sm:text-lg">
              Find beautiful places, unforgettable experiences, and tours made
              for your next adventure.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-28 w-full max-w-187.5 rounded-[20px] bg-[#121d59]/95 p-3 shadow-2xl shadow-slate-950/25 backdrop-blur-sm sm:mt-36 sm:flex sm:items-center sm:gap-1 sm:p-2"
          >
            <label className="flex min-w-0 flex-1 items-center gap-3 border-b border-white/25 px-3 py-3 sm:border-b-0 sm:border-r sm:px-5">
              <MapPin size={17} className="shrink-0 text-white/80" />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold tracking-[0.14em] text-white/75">
                  WHERE
                </span>
                <input
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  placeholder="Search destination"
                  className="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/90"
                />
              </span>
            </label>
            <label className="flex min-w-0 flex-1 items-center gap-3 border-b border-white/25 px-3 py-3 sm:border-b-0 sm:border-r sm:px-5">
              <CalendarDays size={17} className="shrink-0 text-white/80" />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold tracking-[0.14em] text-white/75">
                  DATE
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-1 w-full bg-transparent text-sm text-white outline-none scheme-dark"
                />
              </span>
            </label>
            <label className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 sm:px-5">
              <Users size={17} className="shrink-0 text-white/80" />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold tracking-[0.14em] text-white/75">
                  GUESTS
                </span>
                <select
                  value={guests}
                  onChange={(event) => setGuests(event.target.value)}
                  className="mt-1 w-full appearance-none bg-transparent text-sm text-white outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                    <option
                      key={count}
                      value={count}
                      className="text-slate-900"
                    >
                      {count} {count === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </span>
              <ChevronDown size={15} className="shrink-0 text-white/75" />
            </label>
            <button
              type="submit"
              className="inline-flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-[15px] bg-[#2942d8] px-8 font-serif text-2xl text-white transition hover:bg-[#3852eb] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:w-auto"
            >
              <Search size={19} />
              Search
            </button>
          </form>

          <div className="mt-3 self-start rounded-full bg-white/75 px-4 py-2 text-xs text-slate-900 shadow-sm backdrop-blur-sm sm:ml-1">
            ★★★★★ <strong>4.9/5</strong> from 2,000+ happy travelers
          </div>
        </div>
      </section>
    </main>
  );
}
