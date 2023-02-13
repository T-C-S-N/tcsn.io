/** @format */

import Head from "next/head";
import Script from "next/script";

export default function SEO({ description, title, siteTitle }: { description: string, title: string, siteTitle: string }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Tocausan Home" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        <meta name='description' content={description} />
        <meta name='author' content='tocausan' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:site_name' content={siteTitle} />
        <meta property='og:url' content='https://tcsn.io' />
        <meta property='og:image' content='https://tcsn.io/logo.png' />
      </Head>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script id="gtag1" async src={`https://www.googletagmanager.com/gtag/js?id=G-7WF1VPC5J3`} />
      <Script id="gtag2"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7WF1VPC5J3', {
              page_path: window.location.pathname,
            });
          `,
        }} />
    </>
  );
}
