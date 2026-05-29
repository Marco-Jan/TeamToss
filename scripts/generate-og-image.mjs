import sharp from 'sharp';

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0d0e11"/>

  <!-- top accent bar -->
  <rect x="0" y="0" width="1200" height="6" fill="#e8670a"/>

  <!-- corner brackets top-left -->
  <rect x="60" y="60" width="48" height="3" fill="#e8670a"/>
  <rect x="60" y="60" width="3" height="48" fill="#e8670a"/>

  <!-- corner brackets top-right -->
  <rect x="1092" y="60" width="48" height="3" fill="#e8670a"/>
  <rect x="1137" y="60" width="3" height="48" fill="#e8670a"/>

  <!-- corner brackets bottom-left -->
  <rect x="60" y="567" width="48" height="3" fill="#e8670a"/>
  <rect x="60" y="522" width="3" height="48" fill="#e8670a"/>

  <!-- corner brackets bottom-right -->
  <rect x="1092" y="567" width="48" height="3" fill="#e8670a"/>
  <rect x="1137" y="522" width="3" height="48" fill="#e8670a"/>

  <!-- main title -->
  <text x="600" y="348"
        text-anchor="middle"
        font-family="'Arial Black', Impact, Arial, sans-serif"
        font-weight="900"
        font-size="168"
        letter-spacing="16">
    <tspan fill="#e8670a">TEAM</tspan><tspan fill="#c9d1d9">TOSS</tspan>
  </text>

  <!-- divider -->
  <rect x="557" y="382" width="36" height="2" fill="#e8670a"/>

  <!-- subtitle -->
  <text x="600" y="432"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-weight="600"
        font-size="26"
        letter-spacing="11"
        fill="#8b949e">SQUAD GENERATOR</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile('public/og-image.png');

console.log('Generated: public/og-image.png (1200x630)');
