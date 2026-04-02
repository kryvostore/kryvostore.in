import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { AppProviders } from "@/components/providers/AppProviders";
import { SiteChrome } from "@/components/SiteChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  getTwitterHandle,
} from "@/lib/seo/config";
import { organizationSchema, webSiteSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const site = getSiteUrl();
const tw = getTwitterHandle();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9fa" },
    { media: "(prefers-color-scheme: dark)", color: "#001420" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: `${SITE_NAME} — Premium tech & lifestyle`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [...DEFAULT_KEYWORDS],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: site }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
  },
  // Do not set openGraph.images here — child routes (e.g. /product/[slug]) would merge with
  // the logo and WhatsApp/Facebook often pick the first og:image (the logo). Set per-page instead.
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Premium tech & lifestyle`,
    description: DEFAULT_DESCRIPTION,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    ...(tw && { site: tw, creator: tw }),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }),
  category: "shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <JsonLd data={[organizationSchema(), webSiteSchema()]} />
        <AppProviders>
          <SiteChrome>{children}</SiteChrome>
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
