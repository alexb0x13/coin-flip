import { type FrameRequest, getFrameMessage, getFrameHtmlResponse } from "@coinbase/onchainkit/frame"
import { type NextRequest, NextResponse } from "next/server"

type FrameButton = { label: string; action?: string; target?: string }

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json()
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: "NEYNAR_ONCHAIN_KIT" })

  if (!isValid) {
    return new NextResponse("Message not valid", { status: 500 })
  }

  // Get button pressed and current state
  const buttonId = message?.button
  const state = message?.state
    ? JSON.parse(decodeURIComponent(message.state))
    : {
        balance: 10.0,
        betAmount: 0.25,
        streak: 0,
        gamePhase: "betting", // 'betting', 'choosing', 'result'
        userChoice: null,
        result: null,
        currentWinnings: 0,
      }

  const newState = { ...state }
  let imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image`
  let buttons: FrameButton[] = []

  // Handle different game phases
  switch (state.gamePhase) {
    case "betting":
      if (buttonId === 1) {
        // Decrease bet
        newState.betAmount = Math.max(0.25, state.betAmount - 0.25)
      } else if (buttonId === 2) {
        // Increase bet
        newState.betAmount = Math.min(1.0, Math.min(state.balance, state.betAmount + 0.25))
      } else if (buttonId === 3) {
        // Start game
        newState.gamePhase = "choosing"
      }

      if (newState.gamePhase === "betting") {
        buttons = [
          { label: `Bet -$0.25 (${newState.betAmount.toFixed(2)})` },
          { label: `Bet +$0.25 (${newState.betAmount.toFixed(2)})` },
          { label: `Start Game ($${newState.betAmount.toFixed(2)})` },
        ]
      } else {
        buttons = [{ label: "🪙 Heads" }, { label: "💰 Tails" }]
      }
      break

    case "choosing":
      if (buttonId === 1) {
        // Heads
        newState.userChoice = "heads"
      } else if (buttonId === 2) {
        // Tails
        newState.userChoice = "tails"
      }

      if (newState.userChoice) {
        // Deduct bet if new game
        if (newState.streak === 0) {
          newState.balance -= newState.betAmount
        }

        // Generate random result
        newState.result = Math.random() < 0.5 ? "heads" : "tails"
        const isWin = newState.userChoice === newState.result

        if (isWin) {
          newState.streak += 1
          const multiplier = getMultiplier(newState.streak)
          newState.currentWinnings = newState.betAmount * multiplier
          newState.gamePhase = "result"

          if (newState.streak >= 4) {
            // Auto cash out at 4 wins
            newState.balance += newState.currentWinnings
            newState.streak = 0
            newState.currentWinnings = 0
            newState.gamePhase = "betting"
            buttons = [
              { label: "🎉 20x WIN! Play Again" },
              { label: `Balance: $${newState.balance.toFixed(2)}` },
              { label: "New Game" },
            ]
          } else {
            buttons = [
              { label: `💰 Cash Out $${newState.currentWinnings.toFixed(2)}` },
              { label: `🎲 Continue (${getMultiplier(newState.streak + 1)}x)` },
            ]
          }
        } else {
          // Lost
          newState.streak = 0
          newState.currentWinnings = 0
          newState.gamePhase = "betting"
          buttons = [
            { label: "😞 You Lost!" },
            { label: `Balance: $${newState.balance.toFixed(2)}` },
            { label: "Play Again" },
          ]
        }
      }
      break

    case "result":
      if (buttonId === 1) {
        // Cash out
        newState.balance += newState.currentWinnings
        newState.streak = 0
        newState.currentWinnings = 0
        newState.gamePhase = "betting"
        buttons = [
          { label: `Cashed Out! $${newState.balance.toFixed(2)}` },
          { label: "Play Again" },
          { label: "New Game" },
        ]
      } else if (buttonId === 2) {
        // Continue
        newState.gamePhase = "choosing"
        buttons = [{ label: "🪙 Heads" }, { label: "💰 Tails" }]
      }
      break
  }

  // Add state to image URL
  const stateParam = encodeURIComponent(JSON.stringify(newState))
  imageUrl += `?state=${stateParam}`

  return new NextResponse(
    getFrameHtmlResponse({
      buttons,
      image: {
        src: imageUrl,
      },
      state: {
        ...newState,
      },
    }),
  )
}

function getMultiplier(streakCount: number) {
  if (streakCount === 1) return 2
  if (streakCount === 2) return 3
  if (streakCount === 3) return 4
  if (streakCount >= 4) return 20
  return 1
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req)
}

export const dynamic = "force-dynamic"
