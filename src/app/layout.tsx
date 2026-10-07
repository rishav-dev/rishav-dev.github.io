import type { Metadata, Viewport } from "next";
import { PERSON, THESIS } from "@/data/profile";

/* Three families, each doing one job.
   Inter Tight for display, Inter's proportions with the tighter fitting that
   large sizes need. Inter for everything you actually read. IBM Plex Mono for
   labels, figures and the console; it is the only one with real personality,
   and a quiet nod to the IBM Z certification.

   Self-hosted through Fontsource rather than next/font/google on purpose: no
   request leaves the visitor's browser for a third party, the build does not
   depend on Google being reachable, and the two variable faces are one file
   each for every weight. The `unicode-range` rules in those stylesheets mean
   a Latin-only visitor still downloads only the Latin subset. */
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/inter-tight/wght.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";

import "./globals.css";

const TITLE = `${PERSON.name} | Data Analytics, Applied Data Science & Product Analytics`;

const DESCRIPTION =
  "UMass Amherst DACSS master's student with experience in data analytics, business and product " +
  "analytics, applied machine learning, behavioral research, and data visualization.";

export const metadata: Metadata = {
  metadataBase: new URL(PERSON.site),
  title: {
    default: TITLE,
    template: `%s | ${PERSON.name}`,
  },
  description: DESCRIPTION,
  keywords: [
    "data analytics",
    "business analytics",
    "product analytics",
    "applied data science",
    "computational social science",
    "behavioral analytics",
    "UMass Amherst",
    "DACSS",
    PERSON.name,
  ],
  authors: [{ name: PERSON.name, url: PERSON.site }],
  creator: PERSON.name,
  /* The link preview. For a job search this image is seen far more often than
     the site, it is what appears when a recruiter is sent the URL in LinkedIn,
     Slack, iMessage or email. Regenerate it with `node tools/make-og.mjs`. */
  openGraph: {
    type: "profile",
    siteName: PERSON.name,
    title: TITLE,
    description: DESCRIPTION,
    url: PERSON.site,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${PERSON.name}, data analytics, applied data science and product analytics`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: PERSON.site },
};

export const viewport: Viewport = {
  themeColor: "#050509",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/* Structured data. Cheap to emit, and it is what puts the right thing in a
   search result when someone looks him up by name. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSON.name,
  url: PERSON.site,
  email: `mailto:${PERSON.email}`,
  jobTitle: "Product Manager and Data Analytics Master's Student",
  description: THESIS.body,
  image: `${PERSON.site}/og.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Amherst",
    addressRegion: "MA",
    addressCountry: "US",
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "University of Massachusetts Amherst" },
    { "@type": "CollegeOrUniversity", name: "The University of Texas at Austin" },
    { "@type": "CollegeOrUniversity", name: "Virginia Tech" },
  ],
  knowsAbout: [
    "Data analytics",
    "Business analytics",
    "Product analytics",
    "Applied data science",
    "Behavioral analytics",
    "Computational social science",
  ],
  sameAs: [PERSON.linkedin, PERSON.github],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
