"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  HardHat,
  Building2,
  Package,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
} from "lucide-react";

interface AdminConsoleClientProps {
  metrics: {
    users_count: number;
    workers_count: number;
    contractors_count: number;
    services_count: number;
    materials_count: number;
    bookings_count: number;
    pending_bookings_count: number;
    pending_enquiries_count: number;
    reviews_count: number;
  };
  workers: any[];
  contractors: any[];
  bookings: any[];
  materials: any[];
  enquiries: any[];
  logs: any[];
}

export function AdminConsoleClient({
  metrics: initialMetrics,
  workers: initialWorkers,
  contractors: initialContractors,
  bookings: initialBookings,
  materials: initialMaterials,
  enquiries: initialEnquiries,
  logs: initialLogs,
}: AdminConsoleClientProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "verifications" | "bookings" | "materials" | "enquiries" | "logs"
  >("overview");

  const [workers, setWorkers] = useState(initialWorkers);
  const [contractors, setContractors] = useState(initialContractors);
  const [bookings, setBookings] = useState(initialBookings);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }

  // Handle verification action
  async function handleVerify(type: "worker" | "contractor", id: number, status: "verified" | "rejected") {
    const actionKey = `${type}-${id}-${status}`;
    setLoadingAction(actionKey);

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, status }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.message || "Verification update failed");
        return;
      }

      if (type === "worker") {
        setWorkers((prev) =>
          prev.map((w) => (w.id === id ? { ...w, verification_status: status } : w))
        );
      } else {
        setContractors((prev) =>
          prev.map((c) => (c.id === id ? { ...c, verification_status: status } : c))
        );
      }

      showToast("success", `${type === "worker" ? "Worker" : "Contractor"} #${id} marked as ${status}`);
    } catch (err: any) {
      showToast("error", err.message || "Network error");
    } finally {
      setLoadingAction(null);
    }
  }

  // Handle booking status override
  async function handleBookingStatus(bookingId: number, status: string) {
    setLoadingAction(`booking-${bookingId}`);

    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason: "Admin status override" }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.message || "Booking update failed");
        return;
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
      showToast("success", `Booking #${bookingId} status updated to ${status}`);
    } catch (err: any) {
      showToast("error", err.message || "Network error");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-luxury flex items-center gap-2 border text-xs font-semibold animate-in slide-in-from-bottom duration-200 ${
            toast.type === "success"
              ? "bg-espresso text-white border-sandstone/30"
              : "bg-red-700 text-white border-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-bronze" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Admin Subnav Tabs */}
      <div className="bg-white rounded-[20px] border border-sandstone p-2 shadow-luxury flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {[
          { id: "overview", label: "KPI Overview", icon: <Activity className="h-4 w-4" /> },
          {
            id: "verifications",
            label: "Verification Queue",
            icon: <ShieldCheck className="h-4 w-4" />,
            badge:
              workers.filter((w) => w.verification_status === "pending").length +
              contractors.filter((c) => c.verification_status === "pending").length,
          },
          { id: "bookings", label: "Work Orders", icon: <CalendarCheck className="h-4 w-4" />, badge: initialMetrics.pending_bookings_count },
          { id: "materials", label: "Materials Inventory", icon: <Package className="h-4 w-4" /> },
          { id: "enquiries", label: "Inquiries Desk", icon: <FileText className="h-4 w-4" />, badge: initialMetrics.pending_enquiries_count },
          { id: "logs", label: "System Audit Logs", icon: <ShieldAlert className="h-4 w-4" /> },
        ].map((tab: any) => {
          const isCurrent = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isCurrent
                  ? "bg-espresso text-white shadow-sm"
                  : "bg-transparent text-text-secondary hover:bg-ivory hover:text-espresso"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-bronze text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: KPI OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
              <div className="h-10 w-10 rounded-xl bg-ivory border border-sandstone text-bronze flex items-center justify-center mb-2.5">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Total Users</span>
              <p className="text-2xl font-black text-espresso mt-0.5">{initialMetrics.users_count}</p>
              <span className="text-[11px] text-text-secondary">Customers, workers, contractors</span>
            </div>

            <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
              <div className="h-10 w-10 rounded-xl bg-ivory border border-sandstone text-mocha flex items-center justify-center mb-2.5">
                <HardHat className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Skilled Tradesmen</span>
              <p className="text-2xl font-black text-espresso mt-0.5">{initialMetrics.workers_count}</p>
              <span className="text-[11px] text-text-secondary">10 Building trades</span>
            </div>

            <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
              <div className="h-10 w-10 rounded-xl bg-ivory border border-sandstone text-mocha flex items-center justify-center mb-2.5">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Contractor Firms</span>
              <p className="text-2xl font-black text-espresso mt-0.5">{initialMetrics.contractors_count}</p>
              <span className="text-[11px] text-text-secondary">Registered agencies</span>
            </div>

            <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
              <div className="h-10 w-10 rounded-xl bg-espresso text-bronze flex items-center justify-center mb-2.5">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Total Bookings</span>
              <p className="text-2xl font-black text-espresso mt-0.5">{initialMetrics.bookings_count}</p>
              <span className="text-[11px] text-mocha font-semibold">
                {initialMetrics.pending_bookings_count} Pending Review
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[20px] border border-sandstone p-6 shadow-luxury">
              <h3 className="font-bold text-espresso text-sm mb-3">Live Platform Status</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-sandstone/40">
                  <span className="text-text-secondary">Database Engine:</span>
                  <span className="font-mono font-bold text-mocha">MySQL 8.0 (InnoDB)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-sandstone/40">
                  <span className="text-text-secondary">Pool Status:</span>
                  <span className="font-bold text-espresso">10 Connections (Online)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-sandstone/40">
                  <span className="text-text-secondary">Session Guard:</span>
                  <span className="font-bold text-espresso">SHA-256 Hashed Tokens</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-text-secondary">Active Services:</span>
                  <span className="font-bold text-espresso">{initialMetrics.services_count} Standardized</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-sandstone p-6 shadow-luxury md:col-span-2">
              <h3 className="font-bold text-espresso text-sm mb-3">Quick Operations Access</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("verifications")}
                  className="p-4 rounded-xl border border-sandstone bg-ivory/50 hover:bg-sandstone/30 text-left transition-colors"
                >
                  <ShieldCheck className="h-5 w-5 text-bronze mb-1" />
                  <p className="font-bold text-espresso">Review Verification Queue</p>
                  <p className="text-[11px] text-text-secondary mt-0.5">Approve new tradesmen and contractor licenses</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("bookings")}
                  className="p-4 rounded-xl border border-sandstone bg-ivory/50 hover:bg-sandstone/30 text-left transition-colors"
                >
                  <CalendarCheck className="h-5 w-5 text-espresso mb-1" />
                  <p className="font-bold text-espresso">Manage Work Orders</p>
                  <p className="text-[11px] text-text-secondary mt-0.5">Override booking milestones and shift assignments</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFICATION QUEUE */}
      {activeTab === "verifications" && (
        <div className="space-y-6">
          {/* Workers Section */}
          <div className="bg-white rounded-[20px] border border-sandstone overflow-hidden shadow-luxury">
            <div className="p-6 border-b border-sandstone/60 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-espresso text-base">
                  Skilled Tradesmen Verification Queue
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Verify worker Aadhaar, background clearance, and trade credentials.
                </p>
              </div>
              <Badge variant="bronze">{workers.length} Total Workers</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sandstone/40 text-xs">
                <thead className="bg-ivory/60 text-text-secondary font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-left">Worker Name</th>
                    <th className="px-4 py-3 text-left">Trade & Experience</th>
                    <th className="px-4 py-3 text-left">City</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone/40">
                  {workers.map((w) => (
                    <tr key={w.id} className="hover:bg-ivory/40">
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-espresso block">
                          {w.worker_name || "Tradesman"}
                        </span>
                        <span className="text-text-secondary text-[11px]">{w.worker_email}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-espresso block">{w.title}</span>
                        <span className="text-text-secondary">{w.experience_years} yrs exp</span>
                      </td>
                      <td className="px-4 py-3.5 text-text-primary">{w.city}, Gujarat</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            w.verification_status === "verified"
                              ? "bg-ivory text-espresso border-sandstone font-bold"
                              : w.verification_status === "rejected"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-sandstone/40 text-espresso border-sandstone"
                          }`}
                        >
                          {w.verification_status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {w.verification_status !== "verified" && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="h-8 px-3 text-xs"
                              isLoading={loadingAction === `worker-${w.id}-verified`}
                              onClick={() => handleVerify("worker", w.id, "verified")}
                            >
                              Approve
                            </Button>
                          )}
                          {w.verification_status !== "rejected" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-700 hover:bg-red-50 h-8 px-2.5 text-xs"
                              isLoading={loadingAction === `worker-${w.id}-rejected`}
                              onClick={() => handleVerify("worker", w.id, "rejected")}
                            >
                              Reject
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contractors Section */}
          <div className="bg-white rounded-[20px] border border-sandstone overflow-hidden shadow-luxury">
            <div className="p-6 border-b border-sandstone/60 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-espresso text-base">
                  Contractor Licensing Verification Queue
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Verify commercial registration numbers, GSTIN, and structural capacity.
                </p>
              </div>
              <Badge variant="charcoal">{contractors.length} Contractors</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sandstone/40 text-xs">
                <thead className="bg-ivory/60 text-text-secondary font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-left">Company Name</th>
                    <th className="px-4 py-3 text-left">Registration / GST</th>
                    <th className="px-4 py-3 text-left">Team & City</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone/40">
                  {contractors.map((c) => (
                    <tr key={c.id} className="hover:bg-ivory/40">
                      <td className="px-4 py-3.5 font-bold text-espresso">
                        {c.company_name}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-text-secondary">
                        {c.registration_number || "Unregistered"}
                      </td>
                      <td className="px-4 py-3.5 text-text-primary">
                        {c.team_size} crew • {c.city}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            c.verification_status === "verified"
                              ? "bg-ivory text-espresso border-sandstone font-bold"
                              : c.verification_status === "rejected"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-sandstone/40 text-espresso border-sandstone"
                          }`}
                        >
                          {c.verification_status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {c.verification_status !== "verified" && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="h-8 px-3 text-xs"
                              isLoading={loadingAction === `contractor-${c.id}-verified`}
                              onClick={() => handleVerify("contractor", c.id, "verified")}
                            >
                              Approve
                            </Button>
                          )}
                          {c.verification_status !== "rejected" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-700 hover:bg-red-50 h-8 px-2.5 text-xs"
                              isLoading={loadingAction === `contractor-${c.id}-rejected`}
                              onClick={() => handleVerify("contractor", c.id, "rejected")}
                            >
                              Reject
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS OPERATIONS */}
      {activeTab === "bookings" && (
        <div className="bg-white rounded-[20px] border border-sandstone overflow-hidden shadow-luxury">
          <div className="p-6 border-b border-sandstone/60">
            <h3 className="font-bold text-espresso text-base">Work Orders & Booking Dispatch</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Supervise all client job bookings and enforce milestone transitions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sandstone/40 text-xs">
              <thead className="bg-ivory/60 text-text-secondary font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">Order #</th>
                  <th className="px-4 py-3 text-left">Client & Assigned Pro</th>
                  <th className="px-4 py-3 text-left">Scheduled Date</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Current Status</th>
                  <th className="px-4 py-3 text-right">Status Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone/40">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-ivory/40">
                    <td className="px-4 py-3.5 font-mono font-bold text-text-secondary">
                      #{b.booking_number}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-espresso block">
                        {b.customer_name || "Client"}
                      </span>
                      <span className="text-text-secondary text-[11px]">
                        Pro: {b.worker_name || b.contractor_name || "Unassigned"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-text-primary">
                      {b.scheduled_date || "Flexible"}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-espresso">
                      {b.estimated_amount ? formatCurrency(b.estimated_amount) : "TBD"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-ivory text-espresso border border-sandstone">
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <select
                        value={b.status}
                        onChange={(e) => handleBookingStatus(b.id, e.target.value)}
                        className="h-8 px-2.5 text-xs rounded-xl border border-sandstone bg-ivory/40 text-espresso focus:border-mocha focus:bg-white outline-none"
                      >
                        <option value="pending">pending</option>
                        <option value="accepted">accepted</option>
                        <option value="in_progress">in_progress</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                        <option value="rejected">rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MATERIALS INVENTORY */}
      {activeTab === "materials" && (
        <div className="bg-white rounded-[20px] border border-sandstone overflow-hidden shadow-luxury">
          <div className="p-6 border-b border-sandstone/60 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-espresso text-base">Materials Catalog & Stock Levels</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Centralized warehouse inventory, wholesale trade pricing, and stock status.
              </p>
            </div>
            <Badge variant="bronze">{initialMaterials.length} Items Listed</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sandstone/40 text-xs">
              <thead className="bg-ivory/60 text-text-secondary font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">SKU & Item Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Brand</th>
                  <th className="px-4 py-3 text-left">Unit Price</th>
                  <th className="px-4 py-3 text-left">Stock Count</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone/40">
                {initialMaterials.map((m) => (
                  <tr key={m.id} className="hover:bg-ivory/40">
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-espresso block">{m.name}</span>
                      <span className="font-mono text-text-secondary text-[11px]">{m.sku}</span>
                    </td>
                    <td className="px-4 py-3.5 text-text-secondary">{m.category_name}</td>
                    <td className="px-4 py-3.5 text-espresso font-medium">{m.brand || "—"}</td>
                    <td className="px-4 py-3.5 font-bold text-espresso">
                      {formatCurrency(m.price_per_unit)} / {m.unit}
                    </td>
                    <td className="px-4 py-3.5 text-espresso font-mono">
                      {m.stock_quantity} {m.unit}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          m.is_in_stock
                            ? "bg-ivory text-espresso border-sandstone font-bold"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {m.is_in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: INQUIRIES DESK */}
      {activeTab === "enquiries" && (
        <div className="bg-white rounded-[20px] border border-sandstone overflow-hidden shadow-luxury">
          <div className="p-6 border-b border-sandstone/60">
            <h3 className="font-bold text-espresso text-base">Commercial Inquiries & Leads</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Client requests submitted through the portal for service quotes or bulk materials.
            </p>
          </div>

          <div className="divide-y divide-sandstone/40">
            {initialEnquiries.map((e) => (
              <div key={e.id} className="p-6 hover:bg-ivory/40 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-espresso text-sm">{e.name}</span>
                    <span className="text-text-secondary text-xs">({e.city})</span>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-ivory border border-sandstone text-espresso uppercase">
                      {e.enquiry_type}
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary">
                    {new Date(e.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-text-secondary mb-2">
                  Phone: <strong className="text-espresso">{e.phone}</strong> • Email:{" "}
                  <strong className="text-espresso">{e.email}</strong>
                </div>
                {e.subject && (
                  <p className="text-xs font-bold text-espresso mb-1">
                    Subject: {e.subject}
                  </p>
                )}
                <p className="text-xs text-text-primary leading-relaxed bg-ivory/50 p-3.5 rounded-xl border border-sandstone">
                  "{e.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT ACTIVITY LOGS */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-[20px] border border-sandstone overflow-hidden shadow-luxury">
          <div className="p-6 border-b border-sandstone/60">
            <h3 className="font-bold text-espresso text-base">Administrative Activity Logs</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Immutable audit history of staff operations, status overrides, and verification decisions.
            </p>
          </div>

          <div className="divide-y divide-sandstone/40 text-xs">
            {initialLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between gap-4 hover:bg-ivory/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-bronze bg-ivory px-2 py-0.5 rounded-lg border border-sandstone">
                      {log.action}
                    </span>
                    <span className="text-text-secondary">
                      on <strong className="text-espresso">{log.target_entity}</strong> (ID: {log.target_id})
                    </span>
                  </div>
                  <p className="text-text-secondary text-[11px]">
                    Admin: {log.admin_name || `User #${log.admin_user_id}`}
                  </p>
                </div>
                <span className="text-text-secondary font-mono text-[11px] flex-shrink-0">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
