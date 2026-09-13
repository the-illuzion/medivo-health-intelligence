import { Icon } from './UI';
export function WellnessIllustration({ kind = 'meditate' }: { kind?: string }) {
  return (
    <div className={`wellness-art ${kind}`}>
      <svg
        viewBox="0 0 400 310"
        role="img"
        aria-label={
          kind === 'shield'
            ? 'Healthy shield with sleep, activity and heart symbols'
            : 'Woman in green surrounded by healthy wellness symbols'
        }
      >
        <defs>
          <linearGradient id="green-art" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#70ddb2" />
            <stop offset="1" stopColor="#20b980" />
          </linearGradient>
        </defs>
        <path
          d="M48 211 C5 153 75 109 95 64 C130 -5 227 31 248 51 C334 2 383 62 352 134 C420 227 351 288 277 274 C189 312 104 288 48 211"
          fill="#edf9f3"
        />
        <ellipse cx="201" cy="285" rx="130" ry="13" fill="#dbf6e9" />
        <g fill="#bcebd8">
          <path d="M96 278 Q47 263 40 207 Q82 209 96 278" />
          <path d="M102 281 Q81 226 104 215 Q124 239 102 281" />
          <path d="M302 280 Q308 218 357 206 Q355 255 302 280" />
          <path d="M316 282 Q336 247 369 259 Q350 282 316 282" />
        </g>
        <g fill="#d6f4e6">
          <circle cx="44" cy="149" r="7" />
          <circle cx="141" cy="40" r="6" />
          <circle cx="355" cy="176" r="7" />
          <circle cx="290" cy="47" r="6" />
        </g>
        {kind === 'shield' ? (
          <g>
            <path
              d="M198 91 Q235 116 271 118 L269 174 Q261 239 198 269 Q137 236 129 174 L130 118 Q170 112 198 91"
              fill="#ddf8eb"
              stroke="#68d4a3"
              strokeWidth="9"
            />
            <path
              d="M159 170 L187 198 L238 144"
              stroke="#00a66f"
              strokeWidth="17"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        ) : (
          <g>
            <path
              d="M144 182 Q110 175 130 130 Q116 84 157 77 Q185 45 213 75 Q256 69 259 122 Q294 167 264 206 L153 218Z"
              fill="#123b51"
            />
            <path
              d="M145 160 Q168 149 183 155 L217 155 Q242 158 255 191 L261 249 L143 249Z"
              fill="url(#green-art)"
            />
            <path d="M182 139 L182 158 Q199 177 217 156 L216 137" fill="#ffc094" />
            <ellipse cx="199" cy="114" rx="34" ry="39" fill="#ffc69b" />
            <path
              d="M161 111 Q161 65 202 72 Q239 71 235 113 Q215 102 210 85 Q192 108 161 111"
              fill="#123b51"
            />
            <path
              d="M179 119 Q184 126 190 119 M207 119 Q213 126 219 119"
              fill="none"
              stroke="#234556"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M190 137 Q200 145 209 135"
              fill="none"
              stroke="#e98169"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {kind === 'meditate' ? (
              <>
                <path
                  d="M148 185 L126 228 L87 232"
                  stroke="#ffc69b"
                  strokeWidth="18"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M252 185 L272 228 L311 232"
                  stroke="#ffc69b"
                  strokeWidth="18"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M190 255 Q137 217 102 241 Q71 272 179 284 L242 279 Q321 254 283 236 Q259 221 206 254"
                  fill="#153f55"
                />
                <path d="M152 251 L238 278" stroke="#0d3047" strokeWidth="3" />
              </>
            ) : kind === 'celebrate' ? (
              <>
                <path
                  d="M149 183 L112 137 L90 88 M248 183 L283 130 L299 74"
                  stroke="#ffc69b"
                  strokeWidth="19"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="89" cy="84" r="13" fill="#ffc69b" />
                <circle cx="300" cy="70" r="13" fill="#ffc69b" />
                <path d="M146 280 Q247 260 298 186" stroke="#17b97f" strokeWidth="13" fill="none" />
                <path d="M281 187 L307 176 L304 205" fill="#17b97f" />
                <g fill="#92ddbc">
                  <rect x="226" y="263" width="18" height="20" rx="3" />
                  <rect x="252" y="248" width="18" height="35" rx="3" />
                  <rect x="278" y="227" width="18" height="56" rx="3" />
                </g>
              </>
            ) : (
              <>
                <path
                  d="M149 184 Q134 235 178 228 M249 183 Q273 245 239 248"
                  stroke="#42c895"
                  strokeWidth="22"
                  fill="none"
                  strokeLinecap="round"
                />
                <g transform="rotate(8 220 215)">
                  <rect x="184" y="164" width="73" height="102" rx="5" fill="white" />
                  {[185, 213, 241].map((y) => (
                    <g key={y}>
                      <circle cx="199" cy={y} r="9" fill="#e1f7ec" />
                      <path
                        d={`M194 ${y} l4 4 l7 -8`}
                        stroke="#0bab75"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d={`M218 ${y} h24`}
                        stroke="#bde5d8"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </g>
                  ))}
                </g>
                <ellipse cx="177" cy="224" rx="13" ry="9" fill="#ffc69b" />
                <ellipse cx="254" cy="246" rx="10" ry="15" fill="#ffc69b" />
              </>
            )}
          </g>
        )}
        <g>
          <circle cx="80" cy="82" r="43" fill="#dff7ee" />
          <path d="M86 53 A28 28 0 1 0 108 94 A24 24 0 0 1 86 53" fill="#49a4f8" />
          <path d="M104 60 l3 6 6 3 -6 2 -3 6 -2 -6 -6 -2 6 -3Z" fill="#83c6f9" />
          <circle cx="316" cy="83" r="43" fill="#e0f9eb" />
          <circle cx="319" cy="61" r="7" fill="#0eaa70" />
          <path
            d="M298 83 L307 72 L322 80 L333 76 M315 80 L308 98 L294 100 M313 96 L325 105 L320 118"
            fill="none"
            stroke="#0eaa70"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="344" cy="182" r="36" fill="#ffeded" />
          <path d="M344 201 C301 177 330 153 344 171 C360 153 388 177 344 201" fill="#fc625f" />
        </g>
      </svg>
    </div>
  );
}
export function DeviceArt({ kind = 'watch' }: { kind?: string }) {
  return (
    <div className={`device-art ${kind}`}>
      {kind === 'watch' ? (
        <svg viewBox="0 0 70 90" role="img" aria-label="Apple Watch">
          <rect x="23" y="2" width="27" height="86" rx="11" fill="#27353f" />
          <rect x="14" y="19" width="45" height="54" rx="12" fill="#53616c" />
          <rect x="18" y="23" width="37" height="46" rx="9" fill="#0d171c" />
          <circle cx="36" cy="45" r="13" fill="none" stroke="#ee326f" strokeWidth="4" />
          <circle cx="36" cy="45" r="8" fill="none" stroke="#bde62b" strokeWidth="4" />
          <circle cx="36" cy="45" r="3" fill="none" stroke="#44c4d8" strokeWidth="3" />
          <rect x="59" y="32" width="3" height="9" rx="2" fill="#53616c" />
        </svg>
      ) : kind === 'monitor' ? (
        <svg viewBox="0 0 70 90" role="img" aria-label="Blood pressure monitor">
          <rect
            x="12"
            y="10"
            width="47"
            height="68"
            rx="12"
            fill="#d4e0e8"
            stroke="#25394c"
            strokeWidth="3"
          />
          <rect x="20" y="19" width="31" height="35" rx="4" fill="#24425d" />
          <path d="M26 27h18m-18 7h18m-18 7h11" stroke="#aed2e2" strokeWidth="3" />
          <circle cx="35" cy="65" r="4" fill="#263a4a" />
        </svg>
      ) : kind === 'ring' ? (
        <svg viewBox="0 0 70 90" role="img" aria-label="Oura Ring">
          <ellipse
            cx="34"
            cy="45"
            rx="21"
            ry="28"
            transform="rotate(33 34 45)"
            fill="none"
            stroke="#353c41"
            strokeWidth="13"
          />
          <path d="M23 24 Q8 43 20 63" stroke="#777e81" strokeWidth="3" fill="none" />
        </svg>
      ) : (
        <svg viewBox="0 0 70 90" role="img" aria-label="Dexcom CGM">
          <ellipse
            cx="35"
            cy="45"
            rx="28"
            ry="24"
            fill="#e6e9ec"
            stroke="#abb2bb"
            strokeWidth="2"
          />
          <text x="35" y="48" fontSize="8" textAnchor="middle" fill="#5c6570">
            dexcom
          </text>
        </svg>
      )}
    </div>
  );
}
export function ScanPortrait() {
  return (
    <svg
      className="scan-portrait"
      viewBox="0 0 400 225"
      role="img"
      aria-label="Face positioned within scan frame"
    >
      <defs>
        <linearGradient id="scan-bg">
          <stop stopColor="#e7eff8" />
          <stop offset=".5" stopColor="#d4dde3" />
          <stop offset="1" stopColor="#e8f1fc" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#scan-bg)" />
      <path d="M116 225 L123 134 Q107 26 199 16 Q286 13 277 140 L290 225" fill="#263b46" />
      <path d="M96 225 Q105 175 179 169 L220 168 Q285 172 304 225" fill="#f9fafb" />
      <path d="M178 145 L178 177 Q200 198 220 176 L218 145" fill="#e8b18c" />
      <ellipse cx="198" cy="101" rx="55" ry="69" fill="#f2c4a3" />
      <path d="M140 86 Q127 23 190 24 Q252 5 258 82 Q221 73 207 43 Q179 80 140 86" fill="#243945" />
      <path
        d="M162 102 Q172 93 182 102 M216 102 Q226 93 236 102"
        stroke="#39444a"
        fill="none"
        strokeWidth="3"
      />
      <circle cx="173" cy="102" r="3" fill="#314d50" />
      <circle cx="226" cy="102" r="3" fill="#314d50" />
      <path
        d="M196 110 l-4 19 10 0 M182 143 Q199 153 216 142"
        stroke="#bc816c"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M134 49 h-17 q-10 0 -10 10 v18 M266 49 h17 q10 0 10 10 v18 M107 147 v18 q0 10 10 10 h17 M293 147 v18 q0 10 -10 10 h-17"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
export function PrivacyNote() {
  return (
    <div className="privacy-note">
      <Icon name="lock" size={12} /> Demo data only · No health data is sent or stored.
    </div>
  );
}
