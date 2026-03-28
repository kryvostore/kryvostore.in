import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import { SiteChrome } from "@/components/SiteChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  getDefaultOgImage,
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
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Premium tech & lifestyle`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: getDefaultOgImage(),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — premium tech accessories and lifestyle products`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [getDefaultOgImage()],
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
      </body>
    </html>
  );
}
