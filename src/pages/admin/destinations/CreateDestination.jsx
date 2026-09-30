import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Plus, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  name: "",
  province: "",
  startingPrice: "",
  description: "",
};

export default function CreateDestination() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(
    () => () => {
      if (image?.url) URL.revokeObjectURL(image.url);
    },
    [image],
  );

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  }

  function handleImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please choose a PNG, JPG, or WEBP image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("The destination image must be smaller than 10MB.");
      return;
    }

    setImage({ file, url: URL.createObjectURL(file) });
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (
      !form.name.trim() ||
      !form.province.trim() ||
      !form.description.trim()
    ) {
      setError("Complete all required fields before creating the destination.");
      return;
    }

    navigate("/admin/destinations");
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate("/admin/destinations")}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Destinations
        </button>

        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Create Destination
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Add a new destination to your tour trip website
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 rounded-xl border border-slate-200 bg-white px-5 py-7 shadow-sm sm:px-7 sm:py-8"
        >
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">
              Destination Information
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Please provide the core details and imagery for this tour
              attraction.
            </p>
          </div>

          <div className="space-y-5 pt-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Destination Name <Required />
              </span>
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Angkor Wat"
                className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Province <Required />
                </span>
                <input
                  name="province"
                  value={form.province}
                  onChange={updateField}
                  placeholder="e.g. Siem Reap"
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Starting Price
                </span>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    name="startingPrice"
                    value={form.startingPrice}
                    onChange={updateField}
                    placeholder="0"
                    className="h-10 w-full rounded-lg border border-slate-300 pl-8 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Description <Required />
              </span>
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows="4"
                placeholder="Describe this destination..."
                className="mt-1.5 block min-h-24 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <div>
              <span className="text-sm font-medium text-slate-700">
                Main Image
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImage}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1.5 flex min-h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50 px-4 py-5 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
              >
                {image ? (
                  <img
                    src={image.url}
                    alt="Destination preview"
                    className="h-28 w-full rounded-md object-cover"
                  />
                ) : (
                  <>
                    <span className="mb-3 grid size-8 place-items-center rounded-full bg-blue-50 text-blue-600">
                      <Plus size={18} strokeWidth={2} />
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                      <Upload size={15} /> Upload Destination Image
                    </span>
                    <span className="mt-1 text-xs text-slate-400">
                      PNG, JPG, or WEBP up to 10MB (recommended aspect ratio
                      16:9)
                    </span>
                  </>
                )}
              </button>
              {image && (
                <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                  <ImagePlus size={14} /> {image.file.name}
                </p>
              )}
            </div>
          </div>

          {error && (
            <p className="mt-5 text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => navigate("/admin/destinations")}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1"
            >
              Create Destination
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Required() {
  return <span className="text-red-500">*</span>;
}
