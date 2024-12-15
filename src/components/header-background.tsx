import React from "react";

export const HeaderBackground = () => (
  <svg
    className="absolute inset-0 -z-10 h-[120%] w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
    aria-hidden="true"
  >
    <defs>
      <pattern
        id="animated-pattern"
        width="100"
        height="100"
        patternUnits="userSpaceOnUse"
      >
        {/* Diagonal Lines */}
        <path
          d="M0 100 L100 0 M-25 75 L75 -25 M25 125 L125 25"
          stroke="gray"
          strokeWidth="0.5"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="200"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
        {/* Animated Dots */}
        <circle cx="50" cy="50" r="2" fill="gray">
          <animate
            attributeName="r"
            from="2"
            to="4"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0s"
          />
          <animate
            attributeName="opacity"
            from="1"
            to="0"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0s"
          />
        </circle>
      </pattern>
    </defs>
    <rect
      width="100%"
      height="100%"
      fill="url(#animated-pattern)"
    />
  </svg>
);
