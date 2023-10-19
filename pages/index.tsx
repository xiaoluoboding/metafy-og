import Head from 'next/head'
import { useSearchParams } from 'next/navigation'

export default function Page() {
  const searchParams = useSearchParams()
  const url = searchParams?.get('url')
  const mode = searchParams?.get('mode')
  const style = searchParams?.get('style')
  const isDarkmode = mode === 'dark'
  const isHorizontal = style === 'horizontal'
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
            process.env.VERCEL_URL
              ? 'https://' + process.env.VERCEL_URL
              : 'https://og.bookmark.style'
          }/api/v1?url=${url}&mode=${isDarkmode ? 'dark' : 'light'}&style=${
            isHorizontal ? 'horizontal' : 'vertical'
          }`}
        />
      </Head>
      <h1>A page with Open Graph Image.</h1>
    </div>
  )
}
