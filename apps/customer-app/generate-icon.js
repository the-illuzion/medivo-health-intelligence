const fs = require('fs');
const path = require('path');
const { generateImageAsync } = require('@expo/image-utils');

async function run() {
  const svgPath = path.join(__dirname, 'assets', 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  const sizes = [
    { target: path.join(__dirname, 'assets', 'icon.png'), width: 1024, height: 1024 },
    { target: path.join(__dirname, 'assets', 'adaptive-icon.png'), width: 1024, height: 1024 },
    { target: path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'mipmap-mdpi', 'ic_launcher.png'), width: 48, height: 48 },
    { target: path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'mipmap-hdpi', 'ic_launcher.png'), width: 72, height: 72 },
    { target: path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'mipmap-xhdpi', 'ic_launcher.png'), width: 96, height: 96 },
    { target: path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'mipmap-xxhdpi', 'ic_launcher.png'), width: 144, height: 144 },
    { target: path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'mipmap-xxxhdpi', 'ic_launcher.png'), width: 192, height: 192 },
    { target: path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'mipmap-mdpi', 'ic_launcher_round.png'), width: 48, height: 48 },
    { target: path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'mipmap-hdpi', 'ic_launcher_round.png'), width: 72, height: 72 },
    { target: path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'mipmap-xhdpi', 'ic_launcher_round.png'), width: 96, height: 96 },
    { target: path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'mipmap-xxhdpi', 'ic_launcher_round.png'), width: 144, height: 144 },
    { target: path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'mipmap-xxxhdpi', 'ic_launcher_round.png'), width: 192, height: 192 },
  ];

  for (const s of sizes) {
    const res = await generateImageAsync({ projectRoot: __dirname, cacheType: 'icon' }, { src: svgPath, width: s.width, height: s.height, mime: 'image/png' });
    fs.mkdirSync(path.dirname(s.target), { recursive: true });
    fs.writeFileSync(s.target, res.source);
    console.log('Generated:', s.target, s.width + 'x' + s.height);
  }
}

run().catch(console.error);
