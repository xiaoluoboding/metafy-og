import Head from 'next/head'

export default function Page() {
  return (
    <div>
      <Head>
        <meta name="og:title" content="Open Graph Image | Bookmark Style" />
        <meta
          name="og:description"
          content="Open Graph Image | Bookmark Style"
        />
        <meta
          name="og:image"
          content={`${
            process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
          }/api/og?url=https://bookmark.style`}
        />
      </Head>
      <h1>A page with Open Graph Image.</h1>
    </div>
  )
}
