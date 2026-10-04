const fs = require('fs');

// 1. forgot-password/page.tsx
let fp = fs.readFileSync('src/app/(auth)/forgot-password/page.tsx', 'utf8');
fp = fp.replace(/const handleSubmit = async \(e\) => \{/, 'const handleSubmit = async (e: React.FormEvent) => {');
fs.writeFileSync('src/app/(auth)/forgot-password/page.tsx', fp);

// 2. levels/LevelClient.tsx
let lc = fs.readFileSync('src/app/admin/(dashboard)/levels/LevelClient.tsx', 'utf8');
lc = lc.replace(/export default function LevelClient\(\{ levels \}\) \{/, 'export default function LevelClient({ levels }: { levels: any }) {');
fs.writeFileSync('src/app/admin/(dashboard)/levels/LevelClient.tsx', lc);

// 3. session role errors
function replaceSession(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/session\?\.user\?\.role/g, '(session?.user as any)?.role');
  fs.writeFileSync(file, content);
}
replaceSession('src/app/admin/(dashboard)/levels/page.tsx');
replaceSession('src/app/admin/(dashboard)/page.tsx');
replaceSession('src/app/admin/(dashboard)/teams/page.tsx');
replaceSession('src/app/api/admin/reset-password/route.ts');

// 4. teams/ResetButton.tsx
let rb = fs.readFileSync('src/app/admin/(dashboard)/teams/ResetButton.tsx', 'utf8');
rb = rb.replace(/export default function ResetButton\(\{ teamId, teamName, hasRequest \}\) \{/, 'export default function ResetButton({ teamId, teamName, hasRequest }: { teamId: string, teamName: string, hasRequest: boolean }) {');
rb = rb.replace(/const handleClickOutside = \(event\) => \{/, 'const handleClickOutside = (event: any) => {');
rb = rb.replace(/const handleCustomSubmit = \(e\) => \{/, 'const handleCustomSubmit = (e: any) => {');
rb = rb.replace(/useRef\(null\)/, 'useRef<any>(null)');
fs.writeFileSync('src/app/admin/(dashboard)/teams/ResetButton.tsx', rb);

// 5. src/lib/audio.ts
let audio = fs.readFileSync('src/lib/audio.ts', 'utf8');
audio = audio.replace(/this\.ctx!\.createStereoPanner \?/, "'createStereoPanner' in this.ctx! ?");
fs.writeFileSync('src/lib/audio.ts', audio);
