import { characters } from "../game";
export function Avatar({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  const c = characters.find((x) => x.name === name) || characters[0];
  return (
    <svg
      className={large ? "avatar large" : "avatar"}
      viewBox="0 0 120 150"
      role="img"
      aria-label={`${c.name}, özgün RİTMA karakteri`}
    >
      <ellipse cx="60" cy="141" rx="36" ry="6" fill="#000" opacity=".12" />
      <path
        d="M39 108L35 139H50L58 112M62 112L70 139H85L79 105"
        fill="#302544"
      />
      <path d="M36 77Q60 66 84 77L91 115Q60 130 29 115Z" fill={c.color} />
      <path
        d="M39 83L23 108M81 83L97 108"
        stroke="#c99176"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d={
          c.style % 2
            ? "M29 50Q22 4 62 8Q101 9 93 71L87 91L33 83Z"
            : "M25 48Q22 8 60 9Q98 6 95 50L104 87L82 82L36 85L18 84Z"
        }
        fill={c.hair}
      />
      <rect x="53" y="62" width="14" height="18" rx="6" fill="#c99176" />
      <ellipse
        cx="60"
        cy="46"
        rx="26"
        ry="29"
        fill={c.style === 3 ? "#aa7058" : "#e3af91"}
      />
      <path
        d={
          c.style % 2
            ? "M32 40Q40 8 75 17L88 42Q66 36 61 24Q47 40 32 40"
            : "M33 35Q42 10 70 15Q89 20 87 38L78 30Q55 37 51 22L33 42Z"
        }
        fill={c.hair}
      />
      <path
        d="M46 46h2M72 46h2"
        stroke="#362332"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M54 60Q60 65 66 59"
        fill="none"
        stroke="#794c4b"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx={c.style % 2 ? 87 : 31} cy="27" r="7" fill={c.color} />
      <path
        d="M55 92L60 81L65 92L77 94L68 102L70 114L60 108L50 114L52 102L43 94Z"
        fill="#fff"
        opacity=".75"
      />
      {c.style === 2 && (
        <path
          d="M32 41H55V53H32ZM65 41H88V53H65ZM55 45H65"
          fill="none"
          stroke="#27454d"
          strokeWidth="2"
        />
      )}
      {c.style === 4 && (
        <path
          d="M31 62L22 79L34 93"
          fill="none"
          stroke={c.hair}
          strokeWidth="12"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
