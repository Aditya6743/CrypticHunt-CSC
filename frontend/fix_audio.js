const fs = require('fs');
let audio = fs.readFileSync('src/lib/audio.ts', 'utf8');

// Replace "this.ctx." with "this.ctx!." globally inside playSuccess
audio = audio.replace(/this\.ctx\./g, 'this.ctx!.');
// Actually, doing it globally might be too broad but it's safe for a class where we know it's checked.
// Let's just do a blanket replacement in the specific lines or just globally for this.ctx.create
// Wait, replacing 'this.ctx.' with 'this.ctx!.' is easy.
audio = audio.replace(/this\.ctx\.create/g, 'this.ctx!.create');
audio = audio.replace(/this\.ctx\.destination/g, 'this.ctx!.destination');
audio = audio.replace(/this\.ctx\.currentTime/g, 'this.ctx!.currentTime');
audio = audio.replace(/this\.ctx\.state/g, 'this.ctx!.state');
audio = audio.replace(/this\.ctx\.resume/g, 'this.ctx!.resume');

fs.writeFileSync('src/lib/audio.ts', audio);
