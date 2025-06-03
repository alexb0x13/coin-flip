import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const stateParam = searchParams.get("state")

  const state = stateParam
    ? JSON.parse(decodeURIComponent(stateParam))
    : {
        balance: 10.0,
        betAmount: 0.25,
        streak: 0,
        gamePhase: "betting",
        userChoice: null,
        result: null,
        currentWinnings: 0,
      }

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fef3c7",
        fontSize: 32,
        fontWeight: 600,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 style={{ fontSize: 48, marginBottom: 20, color: "#d97706" }}>🪙 Coin Flip Multiplier</h1>

        <div style={{ display: "flex", gap: 40, marginBottom: 30 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#059669" }}>Balance</div>
            <div style={{ fontSize: 36 }}>${state.balance.toFixed(2)}</div>
          </div>

          {state.streak > 0 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#dc2626" }}>Streak</div>
              <div style={{ fontSize: 36 }}>{state.streak} wins</div>
            </div>
          )}

          {state.currentWinnings > 0 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#7c3aed" }}>Winnings</div>
              <div style={{ fontSize: 36 }}>${state.currentWinnings.toFixed(2)}</div>
            </div>
          )}
        </div>

        {state.gamePhase === "betting" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 20 }}>Bet Amount: ${state.betAmount.toFixed(2)}</div>
            <div style={{ fontSize: 24, color: "#6b7280" }}>Win up to 20x your bet!</div>
          </div>
        )}

        {state.gamePhase === "choosing" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 20 }}>Choose Heads or Tails</div>
            <div style={{ fontSize: 24, color: "#6b7280" }}>
              Betting: ${state.betAmount.toFixed(2)} | Next: {getMultiplier(state.streak + 1)}x
            </div>
          </div>
        )}

        {state.gamePhase === "result" && state.result && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>{state.result === "heads" ? "🪙" : "💰"}</div>
            <div style={{ marginBottom: 10 }}>Result: {state.result.toUpperCase()}</div>
            <div style={{ color: state.userChoice === state.result ? "#059669" : "#dc2626" }}>
              {state.userChoice === state.result ? "YOU WON!" : "YOU LOST!"}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 30,
            fontSize: 18,
            color: "#6b7280",
          }}
        >
          <span>1 Win: 2x</span>
          <span>2 Wins: 3x</span>
          <span>3 Wins: 4x</span>
          <span>4 Wins: 20x</span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}

function getMultiplier(streakCount: number) {
  if (streakCount === 1) return 2
  if (streakCount === 2) return 3
  if (streakCount === 3) return 4
  if (streakCount >= 4) return 20
  return 1
}

export const dynamic = "force-dynamic"
