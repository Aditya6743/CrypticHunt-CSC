const fs = require('fs');

let content = fs.readFileSync('src/app/(auth)/register/page.tsx', 'utf8');

// Update the success message block
const oldSuccess = '{success && <div className="mb-6 p-3 bg-green-900/30 border border-green-500 text-green-400 text-sm text-center text-xl font-bold selectable">{success}</div>}';
const newSuccess = `{success && (
          <div className="mb-6 p-6 bg-green-950/40 border border-green-500/50 text-center">
            <h2 className="text-green-400 text-sm tracking-widest uppercase mb-4 font-bold">Registration Successful</h2>
            <p className="text-gray-300 text-xs mb-2">Save your Team ID below. You will need it to log in.</p>
            <div className="text-3xl font-bold text-white tracking-widest bg-black/50 py-4 border border-green-500/30 selectable animate-pulse mb-6">
              {success.replace('TEAM REGISTERED. ID: ', '')}
            </div>
            <button 
              type="button"
              onClick={() => router.push('/login')}
              className="px-8 py-3 bg-green-600 hover:bg-green-500 text-black font-bold tracking-widest uppercase transition-colors text-xs"
            >
              PROCEED TO TERMINAL
            </button>
          </div>
        )}`;

content = content.replace(oldSuccess, newSuccess);

// Ensure the form is hidden when success is true so they focus on the ID
content = content.replace(
  '<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">',
  '{!success && (<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">'
);

content = content.replace(
  '</form>\n        \n        <div className="mt-8 text-center text-sm text-gray-500">',
  '</form>)}\n        \n        <div className="mt-8 text-center text-sm text-gray-500">'
);

fs.writeFileSync('src/app/(auth)/register/page.tsx', content);
console.log("Success state fixed");
