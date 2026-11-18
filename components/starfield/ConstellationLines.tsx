'use client'

import { useEffect, useState } from 'react'
import type { Memory } from '@/types'

// Manually defined pairs matching the constellation shape
const CONNECTIONS: [string, string][] = [
  ['memory-01', 'memory-02'],
  ['memory-02', 'memory-07'],
  ['memory-07', 'memory-03'],
  ['memory-03', 'memory-06'],
  ['memory-06', 'memory-08'],
  ['memory-08', 'memory-04'],
  ['memory-04', 'memory-05'],
  ['memory-05', 'memory-01'],
  ['memory-02', 'memory-04'],
]

interface ConstellationLinesProps {
  memories: Memory[]
  activeId: string | null
  discoveredIds: Set<string>
}

export default function ConstellationLines({
  memories,
  activeId,
  discoveredIds,
}: ConstellationLinesProps) {
  // Mount flag prevents hydration mismatch (no random on first render)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const memMap = new Map(memories.map((m) => [m.id, m]))

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        {/* Gradient for discovered lines */}
        <linearGradient id="line-discovered" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#648BFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7656C9" stopOpacity="0.6" />
        </linearGradient>
        {/* Gradient for undiscovered lines */}
        <linearGradient id="line-undiscovered" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#648BFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#648BFF" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {CONNECTIONS.map(([fromId, toId], idx) => {
        const from = memMap.get(fromId)
        const to = memMap.get(toId)
        if (!from || !to) return null

        const bothDiscovered = discoveredIds.has(fromId) && discoveredIds.has(toId)
        const isActive =
          activeId === fromId || activeId === toId

        // Deterministic line length approximation for dasharray
        const dx = to.x - from.x
        const dy = to.y - from.y
        const lineLen = Math.sqrt(dx * dx + dy * dy)

        // Stroke dasharray: discovered = solid dashes, undiscovered = fine dots
        const dashArray = bothDiscovered ? '1 0.5' : '0.4 0.8'
        const strokeOpacity = bothDiscovered ? (isActive ? 0.8 : 0.5) : 0.18
        const strokeColor = bothDiscovered ? '#648BFF' : '#648BFF'
        const strokeWidth = bothDiscovered ? (isActive ? 0.22 : 0.15) : 0.1

        // Animation: draw from dashoffset=lineLen to 0 (only after mount)
        const animStyle: React.CSSProperties = mounted
          ? {
              strokeDashoffset: 0,
              transition: `stroke-dashoffset ${0.8 + idx * 0.15}s ease-out`,
            }
          : { strokeDashoffset: lineLen * 10 }

        return (
          <line
            key={`${fromId}-${toId}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeOpacity={strokeOpacity}
            strokeDasharray={dashArray}
            strokeLinecap="round"
            style={{
              ...animStyle,
              ...(isActive && bothDiscovered
                ? {
                    filter: 'drop-shadow(0 0 1px #7656C9)',
                  }
                : {}),
            }}
          />
        )
      })}
    </svg>
  )
}
