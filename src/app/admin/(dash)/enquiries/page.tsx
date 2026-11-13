import type { Metadata } from "next";
import { EnquiryActions } from "@/components/admin/enquiry-actions";
import { formatDateTime } from "@/lib/pricing";
import { getEnquiries } from "@/lib/queries";
import { ENQUIRY_TYPES } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Enquiries", robots: { index: false, follow: false } };

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries();
  const newCount = enquiries.filter((enquiry) => enquiry.status === "new").length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Enquiries & B2B pipeline</h1>
        <p className="mt-1 text-[12px] text-slate-500">{enquiries.length} total enquiries · {newCount} awaiting first response. Update status and keep internal notes.</p>
      </div>

      <div className="space-y-3">
        {enquiries.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-[11.5px] text-slate-400">
            No enquiries yet. Submit a form from the storefront to test the pipeline.
          </div>
        ) : null}
        {enquiries.map((enquiry) => (
          <div key={enquiry.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-slate-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                    {ENQUIRY_TYPES[enquiry.type as keyof typeof ENQUIRY_TYPES] ?? enquiry.type}
                  </span>
                  <span className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${enquiry.status === "new" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>{enquiry.status}</span>
                  <span className="text-[9.5px] text-slate-400">{formatDateTime(enquiry.createdAt)}</span>
                </div>
                <p className="mt-1.5 text-[12.5px] font-semibold text-slate-900">{enquiry.name}{enquiry.company ? ` · ${enquiry.company}` : ""}</p>
                <p className="text-[10.5px] text-slate-500">{enquiry.mobile}{enquiry.email ? ` · ${enquiry.email}` : ""}{enquiry.gstin ? ` · GSTIN ${enquiry.gstin}` : ""}</p>
              </div>
              <EnquiryActions id={enquiry.id} status={enquiry.status} notes={enquiry.adminNotes} />
            </div>
            <div className="mt-2.5 grid gap-1.5 rounded-lg bg-slate-50 p-2.5 text-[10.5px] text-slate-600 sm:grid-cols-3">
              <p><span className="font-semibold text-slate-700">Product:</span> {enquiry.productName ?? "—"}</p>
              <p><span className="font-semibold text-slate-700">Quantity:</span> {enquiry.quantity ?? "—"}</p>
              <p><span className="font-semibold text-slate-700">Location:</span> {enquiry.deliveryLocation ?? "—"}</p>
            </div>
            {enquiry.message ? <p className="mt-2 text-[11px] leading-relaxed text-slate-600">{enquiry.message}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
