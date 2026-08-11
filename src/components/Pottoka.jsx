// Mascotte Pottoka — poney pottok façon Duo, avec txapela rouge.
// Prop `expression` : 'happy' | 'cheer' | 'sad' | 'wave'. Prop `size` en px.
export default function Pottoka({ expression = 'happy', size = 120, className }) {
  const pupilY = expression === 'sad' ? 224 : 214
  const showTeeth = expression === 'happy' || expression === 'cheer' || expression === 'wave'

  return (
    <svg
      className={className}
      width={size}
      height={size * (410 / 270)}
      viewBox="205 45 270 410"
      role="img"
      aria-label="Pottoka, la mascotte"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* corps */}
      <path
        d="M340 106 C 264 106, 220 166, 220 244 C 220 330, 246 402, 296 418 C 316 426, 364 426, 384 418 C 434 402, 460 330, 460 244 C 460 166, 416 106, 340 106 Z"
        fill="#B06A34"
      />
      {/* sabots */}
      <ellipse cx="308" cy="426" rx="28" ry="17" fill="#2B211A" />
      <ellipse cx="372" cy="426" rx="28" ry="17" fill="#2B211A" />
      {/* museau crème */}
      <ellipse cx="340" cy="300" rx="78" ry="60" fill="#ECD4AE" />
      {/* joues */}
      <ellipse cx="286" cy="310" rx="14" ry="9" fill="#E8927C" opacity="0.4" />
      <ellipse cx="394" cy="310" rx="14" ry="9" fill="#E8927C" opacity="0.4" />

      {/* yeux */}
      {expression === 'cheer' ? (
        <>
          <path d="M282 218 Q304 200 326 218" stroke="#2C2622" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M354 218 Q376 200 398 218" stroke="#2C2622" strokeWidth="6" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="304" cy="212" rx="40" ry="46" fill="#ffffff" />
          <ellipse cx="376" cy="212" rx="40" ry="46" fill="#ffffff" />
          <ellipse cx="306" cy={pupilY} rx="18" ry="26" fill="#2C2622" />
          <ellipse cx="374" cy={pupilY} rx="18" ry="26" fill="#2C2622" />
          <circle cx="299" cy={pupilY - 11} r="5" fill="#ffffff" />
          <circle cx="367" cy={pupilY - 11} r="5" fill="#ffffff" />
        </>
      )}

      {/* larme quand triste */}
      {expression === 'sad' && (
        <path d="M286 246 q-7 13 0 20 q7 -7 0 -20 Z" fill="#8FD0E8" />
      )}

      {/* naseaux */}
      <ellipse cx="318" cy="286" rx="6" ry="9" fill="#7A5C46" />
      <ellipse cx="362" cy="286" rx="6" ry="9" fill="#7A5C46" />

      {/* bouche */}
      {expression === 'cheer' ? (
        <path d="M310 320 Q340 356 370 320 Z" fill="#6E4A34" />
      ) : expression === 'sad' ? (
        <path d="M314 338 Q340 322 366 338" stroke="#7A5C46" strokeWidth="4" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M312 322 Q340 342 368 322" stroke="#7A5C46" strokeWidth="4" fill="none" strokeLinecap="round" />
      )}

      {/* petites dents */}
      {showTeeth && (
        <>
          <rect x="330" y="330" width="8" height="15" rx="3" fill="#ffffff" />
          <rect x="342" y="330" width="8" height="15" rx="3" fill="#ffffff" />
        </>
      )}

      {/* txapela */}
      <ellipse cx="338" cy="104" rx="74" ry="20" fill="#9E2028" transform="rotate(-8 338 104)" />
      <ellipse cx="340" cy="92" rx="82" ry="30" fill="#C1272D" transform="rotate(-8 340 92)" />
      <circle cx="349" cy="64" r="7" fill="#8E1B20" />

      {/* oreilles (devant la txapela inclinée) */}
      <path d="M300 122 C 286 80, 296 62, 314 74 C 326 82, 328 110, 322 128 Z" fill="#B06A34" />
      <path d="M306 118 C 300 90, 308 78, 317 86 C 324 92, 323 110, 319 122 Z" fill="#D89C92" />
      <path d="M380 122 C 394 80, 384 62, 366 74 C 354 82, 352 110, 358 128 Z" fill="#B06A34" />
      <path d="M374 118 C 380 90, 372 78, 363 86 C 356 92, 357 110, 361 122 Z" fill="#D89C92" />

      {/* toupet */}
      <path d="M326 128 C 330 144, 350 144, 354 128 C 360 142, 348 156, 340 156 C 332 156, 320 142, 326 128 Z" fill="#3A281A" />
    </svg>
  )
}
