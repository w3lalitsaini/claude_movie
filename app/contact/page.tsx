import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | AtoZ Movies",
  description: "Contact AtoZ Movies for inquiries or support",
};

export default function ContactPage() {
  return (
    <div className="pt-[110px] pb-20 max-w-[900px] mx-auto px-4 min-h-screen">
      <h1 className="font-display text-3xl font-bold uppercase tracking-widest text-[#e50914] mb-8">
        Contact Us
      </h1>
      <div className="bg-[#111] border border-[#222] rounded-sm p-8 text-[#ccc]">
        <p className="mb-6 leading-relaxed">
          If you have any questions, suggestions, or concerns regarding
          AtoZ Movies, please feel free to reach out. We value our users' feedback
          and strive to respond to all inquiries as quickly as possible.
        </p>

        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
              General Inquiries
            </h3>
            <a
              href="mailto:contact@atozmovies.in"
              className="text-[#e50914] hover:text-[#ff1e2d] transition-colors"
            >
              contact@atozmovies.in
            </a>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
              DMCA & Legal
            </h3>
            <a
              href="mailto:admin@atozmovies.in"
              className="text-[#e50914] hover:text-[#ff1e2d] transition-colors"
            >
              admin@atozmovies.in
            </a>
          </div>
        </div>

        <div className="p-4 bg-[#1a1a1a] rounded-sm border border-[#333]">
          <h4 className="text-white font-bold mb-2">Note to users:</h4>
          <p className="text-sm">
            Please use the corresponding email addresses for faster responses. We
            typically aim to reply to all emails within 24-48 business hours. For
            DMCA takedown requests, please refer to our <a href="/dmca" className="text-[#e50914] hover:underline">DMCA Policy</a> page first before sending an email.
          </p>
        </div>
      </div>
    </div>
  );
}
