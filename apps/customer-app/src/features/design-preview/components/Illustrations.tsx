import React from 'react';
import { View } from 'react-native';
import Svg, {
  Path,
  Ellipse,
  G,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
  ClipPath,
} from 'react-native-svg';
export function WellnessIllustration({ kind = 'meditate' }: { kind?: string }) {
  return (
    <View style={{ width: '100%', aspectRatio: 400 / 310 }}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 310"
        accessibilityRole="image"
        accessibilityLabel={
          kind === 'shield'
            ? 'Healthy shield with sleep, activity and heart symbols'
            : 'Woman in green surrounded by healthy wellness symbols'
        }
      >
        <Defs>
          <LinearGradient id="green-art" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#70ddb2" />
            <Stop offset="1" stopColor="#20b980" />
          </LinearGradient>
        </Defs>
        <Path
          d="M48 211 C5 153 75 109 95 64 C130 -5 227 31 248 51 C334 2 383 62 352 134 C420 227 351 288 277 274 C189 312 104 288 48 211"
          fill="#edf9f3"
        />
        <Ellipse cx="201" cy="285" rx="130" ry="13" fill="#dbf6e9" />
        <G fill="#bcebd8">
          <Path d="M96 278 Q47 263 40 207 Q82 209 96 278" />
          <Path d="M102 281 Q81 226 104 215 Q124 239 102 281" />
          <Path d="M302 280 Q308 218 357 206 Q355 255 302 280" />
          <Path d="M316 282 Q336 247 369 259 Q350 282 316 282" />
        </G>
        <G fill="#d6f4e6">
          <Circle cx="44" cy="149" r="7" />
          <Circle cx="141" cy="40" r="6" />
          <Circle cx="355" cy="176" r="7" />
          <Circle cx="290" cy="47" r="6" />
        </G>
        {kind === 'shield' ? (
          <G>
            <Path
              d="M198 91 Q235 116 271 118 L269 174 Q261 239 198 269 Q137 236 129 174 L130 118 Q170 112 198 91"
              fill="#ddf8eb"
              stroke="#68d4a3"
              strokeWidth="9"
            />
            <Path
              d="M159 170 L187 198 L238 144"
              stroke="#00a66f"
              strokeWidth="17"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </G>
        ) : (
          <G>
            <Path
              d="M144 182 Q110 175 130 130 Q116 84 157 77 Q185 45 213 75 Q256 69 259 122 Q294 167 264 206 L153 218Z"
              fill="#123b51"
            />
            <Path
              d="M145 160 Q168 149 183 155 L217 155 Q242 158 255 191 L261 249 L143 249Z"
              fill="url(#green-art)"
            />
            <Path d="M182 139 L182 158 Q199 177 217 156 L216 137" fill="#ffc094" />
            <Ellipse cx="199" cy="114" rx="34" ry="39" fill="#ffc69b" />
            <Path
              d="M161 111 Q161 65 202 72 Q239 71 235 113 Q215 102 210 85 Q192 108 161 111"
              fill="#123b51"
            />
            <Path
              d="M179 119 Q184 126 190 119 M207 119 Q213 126 219 119"
              fill="none"
              stroke="#234556"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <Path
              d="M190 137 Q200 145 209 135"
              fill="none"
              stroke="#e98169"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {kind === 'meditate' ? (
              <>
                <Path
                  d="M148 185 L126 228 L87 232"
                  stroke="#ffc69b"
                  strokeWidth="18"
                  fill="none"
                  strokeLinecap="round"
                />
                <Path
                  d="M252 185 L272 228 L311 232"
                  stroke="#ffc69b"
                  strokeWidth="18"
                  fill="none"
                  strokeLinecap="round"
                />
                <Path
                  d="M190 255 Q137 217 102 241 Q71 272 179 284 L242 279 Q321 254 283 236 Q259 221 206 254"
                  fill="#153f55"
                />
                <Path d="M152 251 L238 278" stroke="#0d3047" strokeWidth="3" />
              </>
            ) : kind === 'celebrate' ? (
              <>
                <Path
                  d="M149 183 L112 137 L90 88 M248 183 L283 130 L299 74"
                  stroke="#ffc69b"
                  strokeWidth="19"
                  fill="none"
                  strokeLinecap="round"
                />
                <Circle cx="89" cy="84" r="13" fill="#ffc69b" />
                <Circle cx="300" cy="70" r="13" fill="#ffc69b" />
                <Path d="M146 280 Q247 260 298 186" stroke="#17b97f" strokeWidth="13" fill="none" />
                <Path d="M281 187 L307 176 L304 205" fill="#17b97f" />
                <G fill="#92ddbc">
                  <Rect x="226" y="263" width="18" height="20" rx="3" />
                  <Rect x="252" y="248" width="18" height="35" rx="3" />
                  <Rect x="278" y="227" width="18" height="56" rx="3" />
                </G>
              </>
            ) : (
              <>
                <Path
                  d="M149 184 Q134 235 178 228 M249 183 Q273 245 239 248"
                  stroke="#42c895"
                  strokeWidth="22"
                  fill="none"
                  strokeLinecap="round"
                />
                <G transform="rotate(8 220 215)">
                  <Rect x="184" y="164" width="73" height="102" rx="5" fill="white" />
                  {[185, 213, 241].map((y) => (
                    <G key={y}>
                      <Circle cx="199" cy={y} r="9" fill="#e1f7ec" />
                      <Path
                        d={`M194 ${y} l4 4 l7 -8`}
                        stroke="#0bab75"
                        strokeWidth="3"
                        fill="none"
                      />
                      <Path
                        d={`M218 ${y} h24`}
                        stroke="#bde5d8"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </G>
                  ))}
                </G>
                <Ellipse cx="177" cy="224" rx="13" ry="9" fill="#ffc69b" />
                <Ellipse cx="254" cy="246" rx="10" ry="15" fill="#ffc69b" />
              </>
            )}
          </G>
        )}
        <G>
          <Circle cx="80" cy="82" r="43" fill="#dff7ee" />
          <Path d="M86 53 A28 28 0 1 0 108 94 A24 24 0 0 1 86 53" fill="#49a4f8" />
          <Path d="M104 60 l3 6 6 3 -6 2 -3 6 -2 -6 -6 -2 6 -3Z" fill="#83c6f9" />
          <Circle cx="316" cy="83" r="43" fill="#e0f9eb" />
          <Circle cx="319" cy="61" r="7" fill="#0eaa70" />
          <Path
            d="M298 83 L307 72 L322 80 L333 76 M315 80 L308 98 L294 100 M313 96 L325 105 L320 118"
            fill="none"
            stroke="#0eaa70"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="344" cy="182" r="36" fill="#ffeded" />
          <Path d="M344 201 C301 177 330 153 344 171 C360 153 388 177 344 201" fill="#fc625f" />
        </G>
      </Svg>
    </View>
  );
}
export function DeviceArt({ kind = 'watch', size = 42 }: { kind?: string; size?: number }) {
  return (
    <View
      style={{ width: size, height: size * 1.12, backgroundColor: '#edf5fc', borderRadius: 12 }}
    >
      {kind === 'watch' ? (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 70 90"
          accessibilityRole="image"
          accessibilityLabel="Apple Watch"
        >
          <Rect x="23" y="2" width="27" height="86" rx="11" fill="#27353f" />
          <Rect x="14" y="19" width="45" height="54" rx="12" fill="#53616c" />
          <Rect x="18" y="23" width="37" height="46" rx="9" fill="#0d171c" />
          <Circle cx="36" cy="45" r="13" fill="none" stroke="#ee326f" strokeWidth="4" />
          <Circle cx="36" cy="45" r="8" fill="none" stroke="#bde62b" strokeWidth="4" />
          <Circle cx="36" cy="45" r="3" fill="none" stroke="#44c4d8" strokeWidth="3" />
          <Rect x="59" y="32" width="3" height="9" rx="2" fill="#53616c" />
        </Svg>
      ) : kind === 'monitor' ? (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 70 90"
          accessibilityRole="image"
          accessibilityLabel="Blood pressure monitor"
        >
          <Rect
            x="12"
            y="10"
            width="47"
            height="68"
            rx="12"
            fill="#d4e0e8"
            stroke="#25394c"
            strokeWidth="3"
          />
          <Rect x="20" y="19" width="31" height="35" rx="4" fill="#24425d" />
          <Path d="M26 27h18m-18 7h18m-18 7h11" stroke="#aed2e2" strokeWidth="3" />
          <Circle cx="35" cy="65" r="4" fill="#263a4a" />
        </Svg>
      ) : kind === 'ring' ? (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 70 90"
          accessibilityRole="image"
          accessibilityLabel="Oura Ring"
        >
          <Ellipse
            cx="34"
            cy="45"
            rx="21"
            ry="28"
            transform="rotate(33 34 45)"
            fill="none"
            stroke="#353c41"
            strokeWidth="13"
          />
          <Path d="M23 24 Q8 43 20 63" stroke="#777e81" strokeWidth="3" fill="none" />
        </Svg>
      ) : (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 70 90"
          accessibilityRole="image"
          accessibilityLabel="Dexcom CGM"
        >
          <Ellipse
            cx="35"
            cy="45"
            rx="28"
            ry="24"
            fill="#e6e9ec"
            stroke="#abb2bb"
            strokeWidth="2"
          />
          <SvgText x="35" y="48" fontSize="8" textAnchor="middle" fill="#5c6570">
            dexcom
          </SvgText>
        </Svg>
      )}
    </View>
  );
}
export function ScanPortrait() {
  return (
    <View style={{ width: '100%', aspectRatio: 400 / 225 }}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 225"
        accessibilityRole="image"
        accessibilityLabel="Face positioned within scan frame"
      >
        <Defs>
          <LinearGradient id="scan-bg">
            <Stop offset="0" stopColor="#e7eff8" />
            <Stop offset=".5" stopColor="#d4dde3" />
            <Stop offset="1" stopColor="#e8f1fc" />
          </LinearGradient>
        </Defs>
        <Rect width="400" height="225" fill="url(#scan-bg)" />
        <Path d="M116 225 L123 134 Q107 26 199 16 Q286 13 277 140 L290 225" fill="#263b46" />
        <Path d="M96 225 Q105 175 179 169 L220 168 Q285 172 304 225" fill="#f9fafb" />
        <Path d="M178 145 L178 177 Q200 198 220 176 L218 145" fill="#e8b18c" />
        <Ellipse cx="198" cy="101" rx="55" ry="69" fill="#f2c4a3" />
        <Path
          d="M140 86 Q127 23 190 24 Q252 5 258 82 Q221 73 207 43 Q179 80 140 86"
          fill="#243945"
        />
        <Path
          d="M162 102 Q172 93 182 102 M216 102 Q226 93 236 102"
          stroke="#39444a"
          fill="none"
          strokeWidth="3"
        />
        <Circle cx="173" cy="102" r="3" fill="#314d50" />
        <Circle cx="226" cy="102" r="3" fill="#314d50" />
        <Path
          d="M196 110 l-4 19 10 0 M182 143 Q199 153 216 142"
          stroke="#bc816c"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M134 49 h-17 q-10 0 -10 10 v18 M266 49 h17 q10 0 10 10 v18 M107 147 v18 q0 10 10 10 h17 M293 147 v18 q0 10 -10 10 h-17"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

export function Avatar({ male = false, size = 36 }: { male?: boolean; size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      accessibilityRole="image"
      accessibilityLabel={male ? 'Profile illustration' : 'Aanya profile illustration'}
    >
      <Defs>
        <ClipPath id={male ? 'male-clip' : 'female-clip'}>
          <Circle cx="40" cy="40" r="40" />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${male ? 'male-clip' : 'female-clip'})`}>
        <Rect width="80" height="80" fill="#d9dce0" />
        <Path
          d={male ? 'M20 42 Q11 7 40 6 Q70 5 60 45' : 'M15 72 L14 33 Q13 3 40 5 Q69 3 67 37 L70 78'}
          fill="#152d39"
        />
        <Path d="M5 83 Q8 57 32 55 L48 55 Q73 57 76 83" fill="#172c34" />
        <Path d="M32 49 L32 60 Q40 68 49 59 L48 47" fill="#e9ac86" />
        <Ellipse cx="40" cy="33" rx="18" ry="23" fill="#f1bb97" />
        <Path d="M21 29 Q19 8 40 9 Q60 8 60 28 Q46 27 39 17 Q34 26 21 29" fill="#142b37" />
        <Path d="M29 35h4m14 0h4" stroke="#283844" strokeWidth="2" strokeLinecap="round" />
        <Path d="M34 44 Q40 49 46 44" fill="none" stroke="#bc705e" strokeWidth="2" />
        {male && (
          <Path d="M23 40 Q24 57 40 57 Q56 54 58 40 Q51 49 40 49 Q29 47 23 40" fill="#243340" />
        )}
      </G>
    </Svg>
  );
}
