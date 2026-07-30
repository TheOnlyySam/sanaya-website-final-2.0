import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Mail, RefreshCw, Save, Search } from "lucide-react";
import { getSupabaseFileUserRole, isSupabaseAuthenticated } from "../lib/supabaseFiles";
import { getServiceRequestAccessToken, listServiceRequests, updateServiceRequest } from "../lib/supabaseServiceRequests";
import { formatIqd, servicePackages, serviceTypes } from "../data/servicePackages";

const statuses = ["new", "contacted", "awaiting_payment", "scheduled", "in_progress", "completed", "cancelled"];
const statusLabel = (value) => value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const formatDate = (value) => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Baghdad", dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

function csvCell(value) {
  const text = String(value ?? "");
  const spreadsheetSafe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${spreadsheetSafe.replace(/"/g, '""')}"`;
}

const ServiceRequestsAdmin = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [requests, setRequests] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [filters, setFilters] = useState({ search: "", status: "", packageId: "", serviceType: "", date: "" });
  const [editor, setEditor] = useState({ status: "new", internal_notes: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    if (!isSupabaseAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const userRole = await getSupabaseFileUserRole();
      setRole(userRole);
      if (userRole === "admin") {
        const rows = await listServiceRequests();
        setRequests(rows || []);
        setSelectedId((current) => current || rows?.[0]?.id || "");
      }
    } catch (error) {
      if (error.message === "AUTH_REQUIRED") navigate("/login", { replace: true });
      else setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => requests.filter((request) => {
    const needle = filters.search.trim().toLowerCase();
    const matchesSearch = !needle || [request.public_reference, request.customer_name, request.phone, request.email].some((value) => String(value || "").toLowerCase().includes(needle));
    const matchesDate = !filters.date || String(request.created_at).slice(0, 10) === filters.date;
    return matchesSearch
      && (!filters.status || request.status === filters.status)
      && (!filters.packageId || request.package_id === filters.packageId)
      && (!filters.serviceType || request.service_type === filters.serviceType)
      && matchesDate;
  }), [filters, requests]);

  const selected = requests.find((request) => request.id === selectedId) || null;
  useEffect(() => {
    if (selected) setEditor({ status: selected.status, internal_notes: selected.internal_notes || "" });
  }, [selected]);

  const save = async () => {
    if (!selected) return;
    setIsSaving(true);
    setMessage("");
    try {
      const rows = await updateServiceRequest(selected.id, editor);
      setRequests((current) => current.map((item) => item.id === selected.id ? rows[0] : item));
      setMessage("Request updated.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const resendConfirmation = async () => {
    if (!selected) return;
    setIsSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/service-request-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getServiceRequestAccessToken()}` },
        body: JSON.stringify({ reference: selected.public_reference }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Confirmation could not be resent.");
      setMessage("Customer confirmation resent.");
      await load();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const exportCsv = () => {
    const columns = ["public_reference", "created_at", "status", "customer_name", "company_name", "phone", "email", "package_name_snapshot", "package_price_snapshot_iqd", "service_type", "preferred_contact_method"];
    const rows = [columns.join(","), ...filtered.map((request) => columns.map((column) => csvCell(request[column])).join(","))];
    const blob = new Blob([`\uFEFF${rows.join("\r\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `service-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <main className="min-h-screen bg-slate-50 px-4 pt-36 text-center text-slate-600">Loading service requests...</main>;
  if (role !== "admin") return <main className="min-h-screen bg-slate-50 px-4 pt-36 text-center"><h1 className="text-3xl font-bold">Admin access required</h1><button onClick={() => navigate("/portal")} className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-white">Back to Portal</button></main>;

  const details = selected ? [
    ["Reference", selected.public_reference], ["Submitted (Baghdad)", formatDate(selected.created_at)], ["Customer", selected.customer_name], ["Company", selected.company_name], ["Phone", selected.phone], ["Email", selected.email], ["Governorate", selected.governorate], ["Package", selected.package_name_snapshot], ["Price", formatIqd(selected.package_price_snapshot_iqd, "en")], ["Service type", statusLabel(selected.service_type)], ["Odoo version", selected.odoo_version], ["Hosting", selected.hosting_type], ["Contact method", statusLabel(selected.preferred_contact_method)], ["Preferred date", selected.preferred_contact_date], ["Preferred time", selected.preferred_contact_time], ["Internal email", selected.email_delivery_status], ["Customer email", selected.customer_confirmation_delivery_status], ["Attachment", selected.attachment_metadata?.name],
  ] : [];

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-[90rem]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-bold text-teal-700">Operations</p><h1 className="mt-2 font-display text-4xl font-bold text-slate-950">Service requests</h1><p className="mt-2 text-slate-600">Review, filter, and follow up on public package requests.</p></div>
          <div className="flex gap-2"><button onClick={load} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white" title="Refresh"><RefreshCw size={18} /></button><button onClick={exportCsv} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white"><Download size={17} /> Export CSV</button></div>
        </div>

        {message && <div role="status" className="mt-5 rounded-lg border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700">{message}</div>}

        <div className="mt-7 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="relative"><span className="sr-only">Search</span><Search className="absolute left-3 top-3.5 text-slate-400" size={17} /><input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Reference, name, phone, email" className="min-h-11 w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3" /></label>
          <select aria-label="Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="min-h-11 rounded-lg border border-slate-300 px-3"><option value="">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{statusLabel(item)}</option>)}</select>
          <select aria-label="Package" value={filters.packageId} onChange={(event) => setFilters({ ...filters, packageId: event.target.value })} className="min-h-11 rounded-lg border border-slate-300 px-3"><option value="">All packages</option>{servicePackages.map((item) => <option key={item.id} value={item.id}>{item.name.en}</option>)}</select>
          <select aria-label="Service type" value={filters.serviceType} onChange={(event) => setFilters({ ...filters, serviceType: event.target.value })} className="min-h-11 rounded-lg border border-slate-300 px-3"><option value="">All service types</option>{serviceTypes.map((item) => <option key={item} value={item}>{statusLabel(item)}</option>)}</select>
          <input aria-label="Submission date" type="date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} className="min-h-11 rounded-lg border border-slate-300 px-3" />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(20rem,0.7fr)_minmax(0,1.3fr)]">
          <div className="max-h-[52rem] overflow-y-auto rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3 text-sm font-bold text-slate-600">{filtered.length} requests</div>
            {filtered.map((request) => <button key={request.id} onClick={() => setSelectedId(request.id)} className={`block w-full border-b border-slate-100 p-4 text-left transition ${selectedId === request.id ? "bg-teal-50" : "hover:bg-slate-50"}`}><div className="flex items-center justify-between gap-3"><span className="font-mono text-sm font-bold text-slate-950">{request.public_reference}</span><span className="text-xs font-bold text-teal-700">{statusLabel(request.status)}</span></div><p className="mt-2 font-bold text-slate-900">{request.customer_name}</p><p className="mt-1 text-sm text-slate-500">{request.package_name_snapshot} · {formatDate(request.created_at)}</p></button>)}
            {!filtered.length && <p className="p-8 text-center text-slate-500">No requests match these filters.</p>}
          </div>

          {selected ? <article className="rounded-lg border border-slate-200 bg-white p-5 sm:p-7">
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">{details.map(([label, value]) => <div key={label} className="border-b border-slate-100 pb-3"><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-semibold text-slate-900">{value || "Not provided"}</p></div>)}</div>
            <div className="mt-6"><h2 className="font-display text-xl font-bold">Request description</h2><p className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-700">{selected.description}</p></div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Status<select value={editor.status} onChange={(event) => setEditor({ ...editor, status: event.target.value })} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3">{statuses.map((item) => <option key={item} value={item}>{statusLabel(item)}</option>)}</select></label><label className="text-sm font-bold text-slate-700 sm:col-span-2">Internal notes<textarea value={editor.internal_notes} onChange={(event) => setEditor({ ...editor, internal_notes: event.target.value })} maxLength={5000} rows={5} className="mt-2 w-full rounded-lg border border-slate-300 p-3" /></label></div>
            <div className="mt-6 flex flex-wrap gap-3"><button onClick={save} disabled={isSaving} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-700 px-5 py-2 text-sm font-bold text-white disabled:opacity-60"><Save size={17} /> Save changes</button><button onClick={resendConfirmation} disabled={isSaving} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-bold text-slate-800 disabled:opacity-60"><Mail size={17} /> Resend customer email</button></div>
          </article> : <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">Select a request to view it.</div>}
        </div>
      </section>
    </main>
  );
};

export default ServiceRequestsAdmin;
