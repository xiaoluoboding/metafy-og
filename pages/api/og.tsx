import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge'
}

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const url = searchParams.get('url')
  if (!url) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 40,
            color: 'black',
            background: 'white',
            width: '100%',
            height: '100%',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <span>👋, Please input the URL!!!</span>
        </div>
      )
    )
  }
  const imageUrl = `https://metafy.vercel.app/api?url=${url}`
  const response = await fetch(imageUrl)

  const json = (await response.json()) as {
    author: string
    logo: string
    publisher: string
    description: string
    image: string
    title: string
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white'
        }}
      >
        <div tw="flex flex-col h-full">
          <div tw="flex relative h-[630px]">
            <img width="1200" height="630" src={json.image} />
          </div>
          <div
            tw="flex flex-1 relative w-full h-full"
            style={{
              backgroundImage:
                'linear-gradient(to bottom right, #6EE7B7, #3B82F6, #7C3AED)'
            }}
          >
            <div
              tw="flex flex-col justify-between h-full w-full gap-3 py-6 px-8 bg-white/75"
              style={{
                backdropFilter: 'blur(16px) saturate(180%)'
              }}
            >
              <div tw="flex items-center font-semibold text-stone-800">
                <span tw="text-3xl">{json.title}</span>
              </div>
              <div tw="flex items-center text-stone-800">
                <span tw="text-lg">{json.description}</span>
              </div>
              <div tw="flex items-center">
                <img src={json.logo} tw="mr-2 h-4 w-4 h-4 w-4" />
                <span tw="text-lg text-stone-800">
                  {json.author || json.publisher || url}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 840
    }
  )
}
