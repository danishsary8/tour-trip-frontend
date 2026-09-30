function DestinationCard({ destination }) {
  return (
    <article className="h-90 overflow-hidden rounded-[11px] bg-[#203267] shadow-sm relative">
      <img
        src={destination.image}
        alt={destination.name}
        className="h-full w-full object-cover absolute inset-0"
      />

      <span className="px-3 py-1 top-3 rounded-full bg-[#263dd9] text-[11px] text-white absolute left-3 leading-none">
        Popular
      </span>

      <span className="px-2 py-1 top-3 rounded-full bg-[#263dd9] text-[11px] text-white absolute right-3 leading-none">
        <span className="text-yellow-300">★</span> {destination.rating}
      </span>

      <div className="px-3 pb-3 pt-2 bottom-0 min-h-30 bg-[#17285e]/95 text-white absolute inset-x-0">
        <h3 className="font-serif text-[15px] font-semibold leading-[1.15]">
          {destination.name}
        </h3>

        <p className="mt-1 font-serif text-[10px] text-white/95 line-clamp-2 leading-[1.2]">
          {destination.description}
        </p>

        <div className="mt-2 pt-1 justify-between border-t border-white/20 flex items-end">
          <div>
            <p className="text-[9px] text-white leading-none">Starting from</p>
            <p className="mt-1 text-[16px] text-[#ff4f58] leading-none">${destination.price}</p>
          </div>

          <button className="px-5 py-1 rounded-full bg-[#182cdf] text-[9px] text-white transition-colors hover:bg-[#101eb5]">
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

export default DestinationCard;