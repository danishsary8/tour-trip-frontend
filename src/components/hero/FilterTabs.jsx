import React from 'react'


const FilterTabs = ({
  filters,
  activeFilter,
  setActiveFilter,
}) => {
  return (
    <div className="mt-12 px-4 sm:mt-16 sm:px-0">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:justify-center">
        {filters.map(({ label, icon: Icon }) => {
          const active = activeFilter === label;

          return (
            <button
              key={label}
              onClick={() => setActiveFilter(label)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition duration-200 sm:px-5 sm:py-2.5 ${
                active
                  ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "border-gray-200 bg-white text-gray-800 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  active
                    ? "text-white"
                    : "text-indigo-600 group-hover:text-white"
                }`}
              />

              <span className="whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterTabs
