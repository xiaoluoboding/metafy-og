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
        <div tw="flex flex-col">
          <div tw="flex relative">
            <img width="1200" height="630" src={json.image} />
          </div>
          <div tw="flex relative w-full p-8 bg-[#05051e]">
            <div tw="flex flex-col justify-between h-full w-full">
              <div tw="flex items-center font-semibold text-white">
                <span tw="text-3xl">{json.title}</span>
              </div>
              <div tw="flex items-center mt-4 text-white">
                <span tw="text-lg">{json.description}</span>
              </div>
              <div tw="flex items-center mt-4">
                <img src={json.logo} tw="mr-2 h-4 w-4 h-4 w-4" />
                <span tw="text-lg text-white">
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
