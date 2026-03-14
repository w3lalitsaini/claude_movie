import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | AtoZ Movies",
  description: "Terms of Use for AtoZ Movies",
};

export default function TermsOfUsePage() {
  return (
    <div className="pt-[110px] pb-20 max-w-[900px] mx-auto px-4 min-h-screen">
      <h1 className="font-display text-3xl font-bold uppercase tracking-widest text-[#e50914] mb-8">
        Terms of Use
      </h1>
      <div className="prose prose-invert max-w-none text-[#ccc] space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing and utilizing the website <strong>AtoZ Movies</strong> ("we", "us", or "our"), you
          agree to comply with and be bound by the following terms and conditions of use, which
          together with our Privacy Policy govern AtoZ Movies' relationship with you
          concerning this website.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
          2. Use of Site Content
        </h2>
        <p>
          The content of the pages of this website is for your general information and use only.
          It is subject to change without notice. AtoZ Movies acts as a search engine/index for
          publicly available movie and web series data on the web. We do not host any of the video 
          content found on our pages. All files and links are hosted on third-party servers.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
          3. User Accounts
        </h2>
        <p>
          In order to use certain features of the website, such as commenting, rating, or creating
          a watchlist, you may be required to register for an account. You are responsible for
          maintaining the confidentiality of your account information, including your password,
          and for all activity that occurs under your account.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
          4. User Generated Content
        </h2>
        <p>
          Users may post reviews, comments, and other content, so long as the content is not
          illegal, obscene, threatening, defamatory, invasive of privacy, infringing of
          intellectual property rights, or otherwise injurious to third parties. We reserve the
          right (but not the obligation) to remove or edit such content without prior notice.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
          5. External Links
        </h2>
        <p>
          From time to time, this website may also include links to other websites. These links
          are provided for your convenience to provide further information. They do not signify
          that we endorse the website(s). We have no responsibility for the content of the linked
          website(s).
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
          6. Limitation of Liability
        </h2>
        <p>
          In no event will we be liable for any loss or damage including without limitation,
          indirect or consequential loss or damage, or any loss or damage whatsoever arising from
          loss of data or profits arising out of, or in connection with, the use of this website.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
          7. Changes to Terms
        </h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any
          time. By continuing to access or use our Service after those revisions become effective,
          you agree to be bound by the revised terms.
        </p>
      </div>
    </div>
  );
}
