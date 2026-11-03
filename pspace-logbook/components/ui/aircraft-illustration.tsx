import React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { palette } from "@/constants/ui";

export function AircraftIllustration() {
  return <Svg width={138} height={58} viewBox="0 0 138 58" accessibilityLabel="Aircraft illustration">
    <Path d="M5 29 Q35 38 69 31 Q103 38 133 29 L100 34 L38 34 Z" fill={palette.navy} />
    <Path d="M67 31 L68 9 Q69 3 70 9 L72 31 M39 30 L40 17 Q41 12 42 17 L44 32 M94 32 L96 17 Q97 12 98 17 L99 31" stroke={palette.navy} strokeWidth={2.6} fill="none" strokeLinecap="round" />
    {[43, 60, 78, 95].map((x) => <React.Fragment key={x}><Circle cx={x} cy={38} r={7.5} stroke={palette.navy} strokeWidth={2.4} fill="#F3F5F8" /><Circle cx={x} cy={38} r={3} fill={palette.navy} /></React.Fragment>)}
    <Path d="M63 25 Q69 21 75 25 L75 32 Q69 37 63 32 Z" fill={palette.navy} />
  </Svg>;
}
