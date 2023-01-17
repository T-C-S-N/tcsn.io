/** @format */

import Head from "next/head";

export default function SEO({ description, title, siteTitle }: { description: string, title: string, siteTitle: string }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="Tocausan Home" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      <meta name='description' content={description} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:site_name' content={siteTitle} />
    </Head>
  );
}
