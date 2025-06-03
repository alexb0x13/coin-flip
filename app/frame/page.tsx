import { getFrameMetadata } from "@coinbase/onchainkit/frame"
import type { Metadata } from "next"

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Start Playing",
    },
  ],
  image: {
    src: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image`,
  },
  postUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
})

export const metadata: Metadata = {
  title: "Coin Flip Multiplier Game",
  description: "Win up to 20x your bet with consecutive coin flips!",
  openGraph: {
    title: "Coin Flip Multiplier Game",
    description: "Win up to 20x your bet with consecutive coin flips!",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image`],
  },
  other: {
    ...frameMetadata,
  },
}

export default function FramePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Coin Flip Multiplier</h1>
      <p className="text-lg text-center mb-8">
        This is a Farcaster Frame! Share this link in Farcaster to play the game directly in the feed.
      </p>
      <div className="bg-amber-100 p-6 rounded-lg">
        <p className="text-sm">
          Frame URL: <code>{process.env.NEXT_PUBLIC_BASE_URL}/frame</code>
        </p>
      </div>
    </div>
  )
}
