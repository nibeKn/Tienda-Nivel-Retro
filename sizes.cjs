const fs = require('fs');

function getPngSize(filePath) {
    const buffer = Buffer.alloc(24);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 24, 0);
    fs.closeSync(fd);
    
    if (buffer.toString('ascii', 1, 4) === 'PNG') {
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        return { width, height };
    }
    return null;
}

const dir = 'src/assets/imagenes-tienda/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
for (const file of files) {
    const size = getPngSize(dir + file);
    if (size) console.log(`${file}: ${size.width}x${size.height}`);
}
