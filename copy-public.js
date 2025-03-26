const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const src = path.join(__dirname, 'src', 'public');
const dest = path.join(__dirname, 'dist', 'public');

if (!fs.existsSync(src)) {
  console.log('No hay carpeta public en src.');
  process.exit(0);
}

if (process.platform === 'win32') {
  execSync(`xcopy "${src}" "${dest}" /E /I /Y`, { stdio: 'inherit' });
} else {
  execSync(`cp -r "${src}" "${dest}"`, { stdio: 'inherit' });
}

console.log('Carpeta public copiada exitosamente.');