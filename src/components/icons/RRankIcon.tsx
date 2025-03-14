import { SVGProps } from "react";
import { useConfigProvider } from "../../context";

interface RankIconProps extends SVGProps<SVGSVGElement> {
  rank: number;
}

export const RRankIcon: React.FC<RankIconProps> = ({ rank, ...props }) => {
  const { mode } = useConfigProvider();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={46}
      height={46}
      viewBox="0 0 46 46"
      fill="none"
      {...props}
    >
      <path
        fill="url(#rank-gradient)"
        stroke={mode === "dark" ? "#000" : "#fff"}
        strokeWidth={3}
        d="M26.652 2.362a8.166 8.166 0 0 0-7.304 0L6.014 9.03A8.167 8.167 0 0 0 1.5 16.333v13.334a8.167 8.167 0 0 0 4.514 7.304l13.334 6.667a8.166 8.166 0 0 0 7.304 0l13.334-6.667a8.167 8.167 0 0 0 4.514-7.304V16.333a8.167 8.167 0 0 0-4.514-7.304L26.652 2.362Z"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="18"
        fontWeight="bold"
        fill="white"
      >
        {rank}
      </text>
      <defs>
        <radialGradient
          id="rank-gradient"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(0 40 -40 0 23 3)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF1B8" />
          <stop offset={1} stopColor="#FFC53D" />
        </radialGradient>
      </defs>
    </svg>
  );
};
