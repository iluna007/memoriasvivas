import { useMemo } from 'react'

/**
 * Fondo estrellado con símbolos + y ✦ repartidos aleatoriamente.
 * Se renderiza como capa fixed detrás de todo el contenido.
 */
const STAR_COUNT = 120

function pseudoRand(i, seed) {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453
  return x - Math.floor(x)
}

export default function StarfieldCSS() {
  const stars = useMemo(() => {
    const arr = []
    for (let i = 0; i < STAR_COUNT; i++) {
      arr.push({
        symbol: pseudoRand(i, 1) > 0.5 ? '+' : '✦',
        left: pseudoRand(i, 2) * 100,
        top: pseudoRand(i, 3) * 100,
        opacity: 0.06 + pseudoRand(i, 4) * 0.16,
        size: 8 + pseudoRand(i, 5) * 14,
        animDelay: pseudoRand(i, 6) * 8,
        animDuration: 4 + pseudoRand(i, 7) * 6
      })
    }
    return arr
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: `${s.size}px`,
            color: `rgba(122,159,196,${s.opacity})`,
            lineHeight: 1,
            animationDelay: `${s.animDelay}s`,
            animationDuration: `${s.animDuration}s`
          }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  )
}
