import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge'
}

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const url = searchParams.get('url')
  const mode = searchParams.get('mode')
  const style = searchParams.get('style')
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
  const isDarkmode = mode === 'dark'
  const isHorizontal = style === 'horizontal'
  const rect = {
    width: 1200,
    height: isHorizontal ? 216 : 840
  }
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
        <div
          tw={`flex flex-row-reverse w-full h-full ${
            !isHorizontal && 'flex-col'
          }`}
        >
          <div
            tw="flex relative"
            style={{
              height: `${isHorizontal ? 216 : 630}px`
            }}
          >
            <img
              width={isHorizontal ? 384 : 1200}
              height={isHorizontal ? 216 : 630}
              src={json.image}
            />
          </div>
          <div
            tw="flex flex-1 relative w-full h-full"
            style={{
              backgroundImage:
                'linear-gradient(to bottom right, #6EE7B7, #3B82F6, #7C3AED)'
            }}
          >
            <div
              tw="flex flex-col justify-between h-full w-full gap-3 py-6 px-8"
              style={{
                backdropFilter: 'blur(16px) saturate(180%)',
                backgroundColor: isDarkmode
                  ? 'rgba(0, 0, 0, .75)'
                  : 'rgba(255, 255, 255, .75)'
              }}
            >
              <div
                tw={`flex items-center font-semibold ${
                  isDarkmode ? 'text-white' : 'text-dark'
                }`}
              >
                <span tw={`${isHorizontal ? 'text-2xl' : 'text-3xl'}`}>
                  {json.title}
                </span>
              </div>
              <div
                tw={`flex items-center ${
                  isDarkmode ? 'text-neutral-50' : 'text-neutral-900'
                }`}
              >
                <span tw={`${isHorizontal ? 'text-base' : 'text-lg'}`}>
                  {json.description}
                </span>
              </div>
              <div
                tw={`flex items-center ${
                  isDarkmode ? 'text-neutral-50' : 'text-neutral-900'
                }`}
              >
                <img src={json.logo} tw="mr-2 h-4 w-4" />
                <span tw={`${isHorizontal ? 'text-base' : 'text-lg'}`}>
                  {json.author || json.publisher || url}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    rect
  )
}
