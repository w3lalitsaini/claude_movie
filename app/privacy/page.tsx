import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | AtoZ Movies",
  description: "Privacy Policy for AtoZ Movies",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-[110px] pb-20 max-w-[900px] mx-auto px-4 min-h-screen">
      <h1 className="font-display text-3xl font-bold uppercase tracking-widest text-[#e50914] mb-8">
        Privacy Policy
      </h1>
      <div className="prose prose-invert max-w-none text-[#ccc] space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>
          At <strong>AtoZ Movies</strong>, accessible from https://atozmovies.in, one of our main
          priorities is the privacy of our visitors. This Privacy Policy document
          contains types of information that is collected and recorded by AtoZ Movies
          and how we use it.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
          Information We Collect
        </h2>
        <p>
          The personal information that you are asked to provide, and the reasons
          why you are asked to provide it, will be made clear to you at the point
          we ask you to provide your personal information.
        </p>
        <p>
          If you contact us directly, we may receive additional information about
          you such as your name, email address, phone number, the contents of the
          message and/or attachments you may send us, and any other information
          you may choose to provide.
        </p>
        <p>
          When you register for an Account, we may ask for your contact
          information, including items such as name, company name, address, email
          address, and telephone number.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
          How We Use Your Information
        </h2>
        <p>We use the information we collect in various ways, including to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>
            Communicate with you, either directly or through one of our
            partners, including for customer service, to provide you with
            updates and other information relating to the website, and for
            marketing and promotional purposes
          </li>
          <li>Send you emails</li>
          <li>Find and prevent fraud</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">Log Files</h2>
        <p>
          AtoZ Movies follows a standard procedure of using log files. These files
          log visitors when they visit websites. All hosting companies do this and
          a part of hosting services' analytics. The information collected by log
          files include internet protocol (IP) addresses, browser type, Internet
          Service Provider (ISP), date and time stamp, referring/exit pages, and
          possibly the number of clicks. These are not linked to any information
          that is personally identifiable. The purpose of the information is for
          analyzing trends, administering the site, tracking users' movement on
          the website, and gathering demographic information.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
          Cookies and Web Beacons
        </h2>
        <p>
          Like any other website, AtoZ Movies uses 'cookies'. These cookies are
          used to store information including visitors' preferences, and the pages
          on the website that the visitor accessed or visited. The information is
          used to optimize the users' experience by customizing our web page
          content based on visitors' browser type and/or other information.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
          Third Party Privacy Policies
        </h2>
        <p>
          AtoZ Movies's Privacy Policy does not apply to other advertisers or
          websites. Thus, we are advising you to consult the respective Privacy
          Policies of these third-party ad servers for more detailed information.
          It may include their practices and instructions about how to opt-out
          of certain options.
        </p>
        
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
          Consent
        </h2>
        <p>
          By using our website, you hereby consent to our Privacy Policy and
          agree to its terms.
        </p>
      </div>
    </div>
  );
}
