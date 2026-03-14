import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA - Copyright Policy | AtoZ Movies",
  description: "DMCA Policy for AtoZ Movies",
};

export default function DMCAPage() {
  return (
    <div className="pt-[110px] pb-20 max-w-[900px] mx-auto px-4 min-h-screen">
      <h1 className="font-display text-3xl font-bold uppercase tracking-widest text-[#e50914] mb-8">
        DMCA Notice
      </h1>
      <div className="prose prose-invert max-w-none text-[#ccc] space-y-6">
        <p>
          AtoZ Movies ("we", "us", or "our") respects the intellectual property rights
          of others and expects its users to do the same. In accordance with the Digital
          Millennium Copyright Act of 1998, the text of which may be found on the U.S.
          Copyright Office website at <a href="http://www.copyright.gov/legislation/dmca.pdf" className="text-[#e50914] hover:underline" target="_blank" rel="noopener noreferrer">http://www.copyright.gov/legislation/dmca.pdf</a>,
          AtoZ Movies will respond expeditiously to claims of copyright infringement
          committed using the AtoZ Movies website (the "Site") if such claims are reported
          to our Designated Copyright Agent identified below.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
          Notice of Copyright Infringement
        </h2>
        <p>
          Please note that AtoZ Movies is an index and database. <strong>We do not host any
          files or videos on our servers.</strong> All files and videos are hosted on remote
          third-party servers. If you believe your copyrighted work is being made available
          on AtoZ Movies in a way that constitutes copyright infringement, please notify us.
        </p>

        <p>To file a DMCA notice, you must provide a written communication that includes the following:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
          <li>Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works at that site.</li>
          <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit the service provider to locate the material (specifically, the URLs).</li>
          <li>Information reasonably sufficient to permit the service provider to contact the complaining party, such as an address, telephone number, and, if available, an electronic mail address at which the complaining party may be contacted.</li>
          <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
          <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
          Designated Agent
        </h2>
        <p>
          Please send the written communication to our designated agent at the following email:
        </p>
        <p className="font-semibold text-white">
          Email: <a href="mailto:admin@atozmovies.in" className="text-[#e50914] hover:underline">admin@atozmovies.in</a>
        </p>

        <p className="mt-6 text-sm italic text-[#888]">
          Please allow up to 48 hours for an email response. Note that emailing your complaint to other parties such as our Internet Service Provider will not expedite your request and may result in a delayed response due to the complaint not properly being filed.
        </p>
      </div>
    </div>
  );
}
