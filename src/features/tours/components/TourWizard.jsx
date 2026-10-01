import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, Plus, Trash2, X } from "lucide-react";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { Drawer } from "../../../components/shared/Drawer";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Button } from "../../../components/ui/Button";
import { TOUR_STEPS, tourSchema } from "../schema";
import { TOUR_PHOTOS } from "../../../mocks/tourImages";

// The real tour photo library (see mocks/tourImages.js).
const PHOTOS = Object.values(TOUR_PHOTOS).flat().map((photo) => photo.src);
const field = "w-full rounded-control border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, name, register, errors, type = "text", children, ...props }) {
  return <div className="min-w-0"><label htmlFor={`tour-${name}`} className="mb-1.5 block text-sm font-semibold">{label}</label>
    {children ? <select id={`tour-${name}`} {...register(name)} className={field} aria-invalid={Boolean(errors[name])}>{children}</select> : type === "textarea" ?
      <textarea id={`tour-${name}`} {...register(name)} rows={4} className={field} aria-invalid={Boolean(errors[name])} {...props} /> :
      <input id={`tour-${name}`} type={type} {...register(name)} className={field} aria-invalid={Boolean(errors[name])} {...props} />}
    {errors[name] && <p role="alert" className="mt-1 text-xs text-danger-ink">{errors[name].message}</p>}</div>;
}

function TagList({ label, name, values, setValue, error }) {
  const [draft, setDraft] = useState("");
  function add() { const text = draft.trim(); if (!text || values.some((value) => value.toLowerCase() === text.toLowerCase())) return; setValue(name, [...values, text], { shouldDirty: true, shouldValidate: true }); setDraft(""); }
  return <div><label htmlFor={`tour-${name}-new`} className="mb-2 block text-sm font-semibold">{label}</label>
    <div className="flex gap-2"><input id={`tour-${name}-new`} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); add(); } }} className={field} placeholder={`Add ${label.toLowerCase()} item`} />
      <Button variant="outline" onClick={add} aria-label={`Add ${label.toLowerCase()} item`}><Plus className="size-4" /></Button></div>
    <div className="mt-3 flex min-h-12 flex-wrap gap-2">{values.map((value, index) => <span key={`${value}-${index}`} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm">{value}
      <button type="button" onClick={() => setValue(name, values.filter((_, position) => position !== index), { shouldDirty: true, shouldValidate: true })} aria-label={`Remove ${value}`} className="rounded-full p-0.5 text-muted transition-colors hover:bg-danger/15 hover:text-danger-ink focus-visible:ring-2 focus-visible:ring-primary"><X className="size-3" /></button></span>)}</div>
    {error && <p role="alert" className="mt-1 text-xs text-danger-ink">{error.message}</p>}</div>;
}

/** One form survives every animated step, so going back never loses input. */
export function TourWizard({ item, categories, destinations, guides, onSave, onClose, loading }) {
  const reduced = useReducedMotion(); const [step, setStep] = useState(0); const [exitOpen, setExitOpen] = useState(false);
  const { register, handleSubmit, trigger, setValue, control, formState: { errors, isDirty } } = useForm({ resolver: zodResolver(tourSchema), defaultValues: {
    name: item?.name ?? "", categoryId: item?.categoryId ?? "", destinationId: item?.destinationId ?? "", guideId: item?.guideId ?? "",
    price: item?.price ?? "", durationDays: item?.durationDays ?? 1, capacity: item?.capacity ?? 16, description: item?.description ?? "",
    itinerary: item?.itinerary ?? [{ title: "", description: "" }], included: item?.included ?? ["Local guide"], excluded: item?.excluded ?? [],
    gallery: item?.gallery ?? [], coverImage: item?.coverImage ?? "", status: item?.status ?? "Active",
  } });
  const values = useWatch({ control }); const itinerary = values.itinerary ?? []; const photos = values.gallery ?? [];
  function requestExit() { if (isDirty) setExitOpen(true); else onClose(); }
  async function next() { if (await trigger(TOUR_STEPS[step].fields, { shouldFocus: true })) setStep(step + 1); }
  function setDays(days) { setValue("itinerary", days, { shouldDirty: true, shouldValidate: true }); }
  function moveDay(index, delta) { const days = [...itinerary]; [days[index], days[index + delta]] = [days[index + delta], days[index]]; setDays(days); }
  function togglePhoto(photo) { const next = photos.includes(photo) ? photos.filter((entry) => entry !== photo) : [...photos, photo]; setValue("gallery", next, { shouldDirty: true, shouldValidate: true }); if (!next.includes(values.coverImage)) setValue("coverImage", next[0] ?? "", { shouldDirty: true, shouldValidate: true }); }
  const destination = destinations.find((entry) => entry.id === values.destinationId);
  const category = categories.find((entry) => entry.id === values.categoryId);
  const guide = guides.find((entry) => entry.id === values.guideId);
  return <><Drawer open onClose={requestExit} full title={item ? "Edit tour" : "Create tour"} description="Build an experience guests can picture before they book."
    footer={<div className="flex w-full flex-wrap items-center gap-2"><span className="mr-auto text-xs font-semibold text-muted">Step {step + 1} of {TOUR_STEPS.length}</span>
      <Button variant="outline" onClick={requestExit}>Cancel</Button>{step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}><ArrowLeft className="size-4" /> Back</Button>}
      {step < TOUR_STEPS.length - 1 ? <Button onClick={next}>Next <ArrowRight className="size-4" /></Button> : <Button onClick={handleSubmit(onSave)} loading={loading}>{item ? "Save tour" : "Create tour"}</Button>}</div>}>
    <div className="mx-auto max-w-3xl space-y-7">
      <div className="grid grid-cols-5 gap-1" aria-label="Tour creation progress">{TOUR_STEPS.map((entry, index) => <div key={entry.label} className="min-w-0"><div className={`mb-2 h-1.5 rounded-full transition-colors ${index <= step ? "bg-primary" : "bg-border"}`} />
        <span className={`flex items-center gap-1 text-[10px] font-semibold sm:text-xs ${index === step ? "text-primary-ink" : "text-muted"}`}>{index < step && <Check className="size-3.5" />}<span className="truncate">{entry.label}</span></span></div>)}</div>
      <motion.div key={step} initial={reduced ? false : { opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0 : 0.25 }} className="space-y-5">
        <div><p className="text-xs font-semibold uppercase tracking-widest text-accent-ink">{String(step + 1).padStart(2, "0")} / 05</p><h3 className="mt-1 font-display text-2xl font-semibold">{TOUR_STEPS[step].label}</h3></div>
        {step === 0 && <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Tour name" name="name" register={register} errors={errors} placeholder="e.g. Mekong Sunset Discovery" /></div>
          <Field label="Category" name="categoryId" register={register} errors={errors}><option value="">Choose category</option>{categories.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</Field>
          <Field label="Destination" name="destinationId" register={register} errors={errors}><option value="">Choose destination</option>{destinations.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</Field>
          <Field label="Guide" name="guideId" register={register} errors={errors}><option value="">Choose guide</option>{guides.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</Field>
          <Field label="Status" name="status" register={register} errors={errors}><option>Active</option><option>Inactive</option></Field>
          <Field label="Price (USD)" name="price" register={register} errors={errors} type="number" min="1" step="0.01" />
          <Field label="Duration (days)" name="durationDays" register={register} errors={errors} type="number" min="1" step="1" />
          <Field label="Capacity (seats)" name="capacity" register={register} errors={errors} type="number" min="1" step="1" />
          <div className="sm:col-span-2"><Field label="Description" name="description" register={register} errors={errors} type="textarea" placeholder="Describe what guests will see, do and remember." /></div></div>}
        {step === 1 && <div className="space-y-3">{itinerary.map((day, index) => <div key={index} className="rounded-card border border-border bg-surface-2/35 p-4"><div className="mb-3 flex items-center gap-2"><strong className="mr-auto text-sm">Day {index + 1}</strong>
          <button type="button" disabled={index === 0} onClick={() => moveDay(index, -1)} aria-label={`Move day ${index + 1} up`} className="rounded p-1 text-muted hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-30"><ArrowUp className="size-4" /></button>
          <button type="button" disabled={index === itinerary.length - 1} onClick={() => moveDay(index, 1)} aria-label={`Move day ${index + 1} down`} className="rounded p-1 text-muted hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-30"><ArrowDown className="size-4" /></button>
          <button type="button" disabled={itinerary.length === 1} onClick={() => setDays(itinerary.filter((_, position) => position !== index))} aria-label={`Remove day ${index + 1}`} className="rounded p-1 text-danger-ink hover:bg-danger/10 focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-30"><Trash2 className="size-4" /></button></div>
          <div className="space-y-3"><input value={day.title} onChange={(event) => setDays(itinerary.map((entry, position) => position === index ? { ...entry, title: event.target.value } : entry))} className={field} placeholder="Day title" aria-label={`Day ${index + 1} title`} />
            <textarea value={day.description} onChange={(event) => setDays(itinerary.map((entry, position) => position === index ? { ...entry, description: event.target.value } : entry))} className={field} rows={2} placeholder="Where will guests go?" aria-label={`Day ${index + 1} description`} /></div></div>)}
          {errors.itinerary && <p role="alert" className="text-xs text-danger-ink">Complete each day's title and description.</p>}
          <Button variant="outline" onClick={() => setDays([...itinerary, { title: "", description: "" }])}><Plus className="size-4" /> Add day</Button></div>}
        {step === 2 && <div className="grid gap-6 sm:grid-cols-2"><TagList label="Included" name="included" values={values.included ?? []} setValue={setValue} error={errors.included} /><TagList label="Excluded" name="excluded" values={values.excluded ?? []} setValue={setValue} error={errors.excluded} /></div>}
        {step === 3 && <div><p className="mb-3 text-sm text-muted">Select photos, then choose one as the cover.</p><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{PHOTOS.map((photo, index) => <div key={photo} className={`overflow-hidden rounded-card border-2 ${photos.includes(photo) ? "border-primary" : "border-border"}`}>
          <button type="button" onClick={() => togglePhoto(photo)} aria-pressed={photos.includes(photo)} aria-label={`Select gallery photo ${index + 1}`} className="relative block aspect-[4/3] w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary"><img src={photo} alt={`Cambodia gallery option ${index + 1}`} className="size-full object-cover transition-transform hover:scale-105" />{photos.includes(photo) && <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-primary text-white"><Check className="size-3.5" /></span>}</button>
          {photos.includes(photo) && <button type="button" onClick={() => setValue("coverImage", photo, { shouldDirty: true, shouldValidate: true })} className={`w-full px-2 py-2 text-xs font-semibold outline-none hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary ${values.coverImage === photo ? "text-primary-ink" : "text-muted"}`}>{values.coverImage === photo ? "Cover photo" : "Set as cover"}</button>}</div>)}</div>
          {(errors.gallery || errors.coverImage) && <p role="alert" className="mt-2 text-xs text-danger-ink">Choose at least one gallery photo and a cover.</p>}
          {photos.length > 1 && <div className="mt-4 flex flex-wrap gap-2">{photos.map((photo, index) => <div key={photo} className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 p-1"><img src={photo} alt="" className="size-9 rounded object-cover" /><span className="px-1 text-xs text-muted">{index + 1}</span><button type="button" disabled={index === 0} onClick={() => { const next = [...photos]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; setValue("gallery", next, { shouldDirty: true }); }} aria-label={`Move photo ${index + 1} left`} className="rounded p-1 hover:bg-surface focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-30"><ArrowLeft className="size-3" /></button><button type="button" disabled={index === photos.length - 1} onClick={() => { const next = [...photos]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; setValue("gallery", next, { shouldDirty: true }); }} aria-label={`Move photo ${index + 1} right`} className="rounded p-1 hover:bg-surface focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-30"><ArrowRight className="size-3" /></button></div>)}</div>}</div>}
        {step === 4 && <div className="overflow-hidden rounded-panel border border-border bg-surface shadow-soft"><div className="relative h-56 bg-surface-2">{values.coverImage && <img src={values.coverImage} alt="Tour cover preview" className="size-full object-cover" />}<div className="absolute bottom-4 left-4"><StatusBadge status={values.status} /></div></div>
          <div className="space-y-4 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-accent-ink">{category?.name} · {destination?.name}</p><h4 className="mt-1 font-display text-2xl font-semibold">{values.name}</h4></div><strong className="font-display text-xl text-primary-ink">${Number(values.price).toFixed(2)}</strong></div>
            <p className="text-sm leading-relaxed text-muted">{values.description}</p><p className="text-xs font-semibold text-muted">{values.durationDays} days · {values.capacity} seats · Guided by {guide?.name}</p>
            <div className="border-t border-border pt-4"><h5 className="text-sm font-semibold">Itinerary</h5><ol className="mt-2 space-y-2">{itinerary.map((day, index) => <li key={index} className="text-sm"><span className="font-semibold">Day {index + 1}: {day.title}</span><span className="text-muted"> — {day.description}</span></li>)}</ol></div>
            <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2"><div><h5 className="text-sm font-semibold">Included</h5><p className="mt-1 text-sm text-muted">{values.included?.join(" · ")}</p></div><div><h5 className="text-sm font-semibold">Excluded</h5><p className="mt-1 text-sm text-muted">{values.excluded?.join(" · ") || "None"}</p></div></div></div></div>}
      </motion.div></div></Drawer>
  <ConfirmDialog open={exitOpen} onClose={() => setExitOpen(false)} onConfirm={onClose} title="Discard unsaved changes?" description="Changes to this tour will be lost." confirmLabel="Discard changes" /></>;
}
