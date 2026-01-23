import React from 'react'

export const FlagSK = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 640 480" className={className}>
    <path fill="#ffffff" d="M0 0h640v480H0z" />
    <path fill="#ffffff" d="M0 160h640v320H0z" />
    <path fill="#0b4ea2" d="M0 160h640v160H0z" />
    <path fill="#ee1c25" d="M0 320h640v160H0z" />
    <path
      fill="#ffffff"
      d="M190 200c0 40-10 80-50 80-40 0-50-40-50-80h100z"
      transform="translate(40)"
    />
    <path
      fill="#0b4ea2"
      d="M185 205c0 30-5 60-35 60-30 0-35-30-35-60h70z"
      transform="translate(40)"
    />
    <path
      fill="#ee1c25"
      d="M165 240l10 20 10-20h-20z"
      transform="translate(40)"
    />
  </svg>
)

export const FlagUS = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 640 480" className={className}>
    <path fill="#bd3d44" d="M0 0h640v480H0" />
    <path
      stroke="#fff"
      strokeWidth="37"
      d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"
    />
    <path fill="#192f5d" d="M0 0h364.8v258.5H0" />
    <marker id="us-star" markerWidth="30" markerHeight="30" viewBox="0 0 18 18">
      <path fill="#fff" d="M9 0l3 6 6 .8-4 5 1 7-6-3-6 3 1-7-4-5 6-.8z" />
    </marker>
  </svg>
)

export const FlagCZ = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 640 480" className={className}>
    <path fill="#ffffff" d="M0 0h640v240H0z" />
    <path fill="#d7141a" d="M0 240h640v240H0z" />
    <path fill="#11457e" d="M0 0l360 240L0 480z" />
  </svg>
)
