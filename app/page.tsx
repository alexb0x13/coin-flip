import { CoinFlipGame } from "@/components/coin-flip-game"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100 dark:from-zinc-900 dark:to-zinc-800 p-4">
      <div className="max-w-md w-full mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-amber-600 dark:text-amber-400">Coin Flip Game</h1>
        <CoinFlipGame />
      </div>
    </main>
  )
}
