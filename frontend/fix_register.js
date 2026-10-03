const fs = require('fs');

let content = fs.readFileSync('src/app/(auth)/register/page.tsx', 'utf8');

// Add states
content = content.replace(
  'const [error, setError] = useState("");',
  'const [error, setError] = useState("");\n  const [showPassword, setShowPassword] = useState(false);\n  const [showConfirmPassword, setShowConfirmPassword] = useState(false);'
);

// Update password input
const oldPass = `          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">PASSWORD</label>
            <input type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
          </div>`;
          
const newPass = `          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">PASSWORD</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500 pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 focus:outline-none transition-colors" tabIndex={-1}>
                {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>}
              </button>
            </div>
          </div>`;

// Update confirm password input
const oldConf = `          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">CONFIRM PASSWORD</label>
            <input type="password" required onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
          </div>`;
          
const newConf = `          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">CONFIRM PASSWORD</label>
            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} required onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500 pr-12" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 focus:outline-none transition-colors" tabIndex={-1}>
                {showConfirmPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>}
              </button>
            </div>
          </div>`;

content = content.replace(oldPass, newPass);
content = content.replace(oldConf, newConf);

fs.writeFileSync('src/app/(auth)/register/page.tsx', content);
console.log("Register updated");
