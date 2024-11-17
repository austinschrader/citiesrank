"use client";

import Script from "next/script";

const GoogleAnalytics = () => {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=G-F36JR4K6DZ`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`

        window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-X596FMZ50F');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
