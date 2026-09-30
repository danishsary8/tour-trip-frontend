import React, { useState, useCallback, useEffect } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import CustomerListPage from "./CustomerListPage";
import { emptyForm, INITIAL_CUSTOMERS, STEPS } from '../../../constants/customerConstant';
import StepPersonal from '../../../components/admin/StepPersonal';
import StepTrip from '../../../components/admin/StepTrip';
import StepReview from '../../../components/admin/StepReview';
import Toast from '../../../components/admin/Toast';
import { cx } from '../../../utils/helpers';


const FONTS = (
  <style>{`
            .font-display { font-family: var(--font-display); }
            .font-body { font-family: var(--font-ui); }
            @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes fadeSlideOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-6px); } }
            @keyframes toastIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes dashTravel { to { stroke-dashoffset: -24; } }
            @keyframes rowHighlight { 0% { background-color: color-mix(in srgb, var(--primary) 8%, transparent); } 100% { background-color: transparent; } }
            @keyframes popIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
            .anim-step-in { animation: fadeSlideIn 0.32s cubic-bezier(0.16,1,0.3,1); }
            .anim-toast { animation: toastIn 0.3s cubic-bezier(0.16,1,0.3,1); }
            .anim-row { animation: rowHighlight 2.2s ease-out; }
            .anim-pop { animation: popIn 0.35s cubic-bezier(0.16,1,0.3,1); }
            .flight-dash { stroke-dasharray: 4 6; animation: dashTravel 1.2s linear infinite; }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.55; cursor: pointer; }
          `}</style>
);


const CreateCustomer = () => {

  const [view, setView] = useState(
    location.pathname === "/admin/customers/create"
      ? "create"
      : "list");
  const [step, setStep] = useState(1);
  const [furthestStep, setFurthestStep] = useState(1);
  const [data, setData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);

  // Add this state
  const [selectedIds, setSelectedIds] = useState([]);

  const [highlightId, setHighlightId] = useState(null);

  const handleDeleteSelected = () => {

    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete the selected customer(s)?"
    );

    if (!confirmed) return;

    setCustomers((list) =>
      list.filter((c) => !selectedIds.includes(c.id))
    );

    setSelectedIds([]);
  };


  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const setField = useCallback((key, value) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }, []);

  const toggleArrayField = useCallback((key, value) => {
    setData((d) => {
      const arr = d[key];
      return { ...d, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  }, []);

  const resetAndGoToList = () => {
    setData(emptyForm);
    setErrors({});
    setConfirmed(false);
    setStep(1);
    setFurthestStep(1);
    setView("list");
  };

  const validateStep1 = () => {
    const e = {};
    if (!data.fullName.trim()) e.fullName = "Full name is required.";
    if (!data.email.trim()) e.email = "Email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Enter a valid email address.";
    if (!data.phone.trim()) e.phone = "Phone number is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    const next = Math.min(step + 1, 3);
    setStep(next);
    setFurthestStep((f) => Math.max(f, next));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const jumpToStep = (s) => setStep(s);

  const handleSaveDraft = () => {
    setSaving("draft");
    setTimeout(() => {
      setSaving(false);
      setToast("Draft saved.");
    }, 900);
  };

  const handleCreate = () => {
    if (!validateStep1()) { setStep(1); setFurthestStep((f) => Math.max(f, 1)); return; }
    if (step === 3 && !confirmed) return;
    if (step !== 3) { setStep(3); setFurthestStep((f) => Math.max(f, 3)); return; }

    setSaving("create");
    setTimeout(() => {
      const initials = data.fullName.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "CU";
      const newCustomer = {
        id: `c${Date.now()}`,
        name: data.fullName,
        email: data.email,
        destination: data.destination,
        status: "Active",
        created: "Aug 25, 2026",
        initials,
        photo: data.photo?.url || null,
      };
      setCustomers((list) => [newCustomer, ...list]);
      setHighlightId(newCustomer.id);
      setSaving(false);
      setToast("Customer created successfully.");
      setTimeout(() => {
        resetAndGoToList();
        setTimeout(() => setHighlightId(null), 2200);
      }, 900);
    }, 1200);
  };

  if (view === "list") {
    return (
      <div className="anim-step-in">
        {FONTS}
        <Toast toast={toast} />
        <CustomerListPage
          customers={customers}
          onCreate={() => setView("create")}
          highlightId={highlightId}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onDeleteSelected={handleDeleteSelected}
        />

      </div>
    );
  }

  const isLastStep = step === 3;

  return (
    <div className="min-h-screen bg-background font-body">
      {FONTS}
      <Toast toast={toast} />

      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto
          px-4 sm:px-6
          pt-4 sm:pt-5
          pb-4
          flex
          flex-col
          sm:flex-row
          sm:items-start
          sm:justify-between
          gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-foreground font-display">Create Customer</h1>
            <p className="text-[13px] text-muted mt-1 font-body">Add a new customer before booking a tour. Complete the information below to create a customer profile.</p>
          </div>
          <div className="flex
            flex-wrap
            gap-2
            w-full
            sm:w-auto">
            <button
              onClick={resetAndGoToList}
              className="text-[13px] font-medium px-3.5 py-2 rounded-lg text-muted hover:bg-surface-2 transition-colors font-body"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={saving === "draft"}
              className="min-h-[44px]
                flex-1
                sm:flex-none
                px-3.5
                py-2
                rounded-lg
                border
                border-border
                text-foreground
                text-[13px]
                flex
                items-center
                justify-center
                gap-1.5"
            >
              {saving === "draft" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Draft
            </button>
            <button
              onClick={() => navigate("/admin/customers/create")}
              disabled={saving === "create"}
              className="min-h-[44px]
                w-full
                sm:w-auto
                px-4
                py-2
                rounded-lg
                bg-primary
                text-white
                text-[13px]
                font-semibold
                flex
                items-center
                justify-center
                gap-1.5"
            >
              {saving === "create" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Create Customer
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto
          px-4 sm:px-6
          pb-10 sm:pb-6
          pt-2
          overflow-x-auto">
          <Stepper step={step} furthestStep={furthestStep} onJump={jumpToStep} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto
        px-4 sm:px-6
        py-6 sm:py-8
        pb-32">
        {step === 1 && <StepPersonal data={data} setField={setField} errors={errors} />}
        {step === 2 && <StepTrip data={data} setField={setField} toggleArrayField={toggleArrayField} />}
        {step === 3 && <StepReview data={data} confirmed={confirmed} setConfirmed={setConfirmed} onEdit={jumpToStep} />}
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur border-t border-border">
        <div className="max-w-5xl mx-auto
          px-4 sm:px-6
          py-3 sm:py-4
          flex
          items-center
          justify-between
          gap-3">
          <button
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 text-[13.5px] font-medium px-4 py-2.5 rounded-lg border border-border text-muted hover:bg-background transition-colors font-body disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />

            <span className="hidden sm:inline">
              Previous
            </span>
          </button>

          {!isLastStep ? (
            <button
              onClick={goNext}
              className="min-h-[44px]
                flex-1
                sm:flex-none
                justify-center
                inline-flex
                items-center
                gap-1.5
                text-[13.5px]
                font-semibold
                px-4 sm:px-5
                py-2.5"
            >
              Next: {STEPS[step]} <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={!confirmed || saving === "create"}
              className={cx(
                "inline-flex items-center gap-2 text-[13.5px] font-semibold px-5 py-2.5 rounded-lg transition-colors font-body shadow-sm",
                confirmed ? "bg-primary text-white hover:bg-primary" : "bg-surface-2 text-muted cursor-not-allowed"
              )}
            >
              {saving === "create" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving === "create" ? "Creating..." : "Create Customer"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateCustomer
