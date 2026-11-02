"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Ahmedabad");
  const [enquiryType, setEnquiryType] = useState<
    "general" | "service_quote" | "material_quote" | "bulk_order" | "emergency"
  >("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          city: city.trim(),
          enquiry_type: enquiryType,
          subject: subject.trim() || undefined,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to submit enquiry. Please verify details.");
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
    setSuccess(false);
    setError(null);
  }

  if (success) {
    return (
      <div className="bg-white rounded-[20px] border border-sandstone p-8 text-center shadow-luxury">
        <div className="h-16 w-16 bg-ivory text-mocha border border-sandstone rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-espresso">Message Dispatched Successfully</h3>
        <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto">
          Thank you for reaching out to WeldingPanchal. Our engineering project coordinator will review
          your request and call you at <strong className="text-espresso">{phone}</strong> within 2 hours.
        </p>
        <div className="mt-6">
          <Button variant="secondary" onClick={handleReset}>
            Send Another Enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[20px] border border-sandstone p-6 sm:p-8 shadow-luxury space-y-4">
      <h2 className="text-xl font-bold text-espresso mb-1">
        Send an Operational Inquiry
      </h2>
      <p className="text-xs text-text-secondary mb-4">
        Fill out the project scope below. Our regional engineers are on standby 24/7.
      </p>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-espresso mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Bhavesh Panchal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-3.5 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all placeholder:text-text-secondary/60"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-espresso mb-1.5">
            10-Digit Mobile Number *
          </label>
          <input
            type="tel"
            required
            pattern="^[6-9]\d{9}$"
            placeholder="e.g. 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full h-11 px-3.5 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all placeholder:text-text-secondary/60"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-espresso mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="e.g. bhavesh@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-3.5 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all placeholder:text-text-secondary/60"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-espresso mb-1.5">
            Site Location / City *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Ahmedabad, Gujarat"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-11 px-3.5 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all placeholder:text-text-secondary/60"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-espresso mb-1.5">
            Nature of Enquiry *
          </label>
          <select
            value={enquiryType}
            onChange={(e: any) => setEnquiryType(e.target.value)}
            className="w-full h-11 px-3.5 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all"
          >
            <option value="general">General Support / Question</option>
            <option value="service_quote">Skilled Labor / Service Quote</option>
            <option value="material_quote">Bulk Building Materials Quote</option>
            <option value="bulk_order">Turnkey Commercial Contracting</option>
            <option value="emergency">24/7 Site Emergency / Repair</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-espresso mb-1.5">
            Project Subject
          </label>
          <input
            type="text"
            placeholder="e.g. Structural steel warehouse fabrication"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full h-11 px-3.5 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all placeholder:text-text-secondary/60"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-espresso mb-1.5">
          Detailed Requirements *
        </label>
        <textarea
          rows={4}
          required
          placeholder="Please describe project dimensions, required trades (welders, masons), site address, target start date, etc."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3.5 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all placeholder:text-text-secondary/60"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={loading}
          leftIcon={<Send className="h-4 w-4" />}
        >
          Submit Commercial Enquiry
        </Button>
      </div>
    </form>
  );
}
