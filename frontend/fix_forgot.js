const fs = require('fs');

// 1. Update API route
let apiContent = fs.readFileSync('src/app/api/forgot-password/route.ts', 'utf8');
apiContent = apiContent.replace(
  '// Return fake pending to prevent brute forcing emails\n      return NextResponse.json({ status: "pending" });',
  'return NextResponse.json({ error: "Team ID or Email not found in the system." }, { status: 404 });'
);
fs.writeFileSync('src/app/api/forgot-password/route.ts', apiContent);
console.log("API updated");

// 2. Update UI
let uiContent = fs.readFileSync('src/app/(auth)/forgot-password/page.tsx', 'utf8');

// Update handleSubmit
const oldHandleSubmit = `  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier })
      });
      const data = await res.json();
      
      if (data.status === "resolved") {
        setNewPassword(data.newPassword);
        setStatus("resolved");
      } else if (data.status === "pending") {
        setStatus("pending");
      } else {
        setStatus("requested");
      }
    } catch {
      setStatus("error");
    }
  };`;

const newHandleSubmit = `  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMessage(data.error || "An error occurred");
        setStatus("idle");
        return;
      }
      
      if (data.status === "resolved") {
        setNewPassword(data.newPassword);
        setStatus("resolved");
      } else if (data.status === "pending") {
        setStatus("pending");
      } else {
        setStatus("requested");
      }
    } catch {
      setErrorMessage("Network error occurred");
      setStatus("idle");
    }
  };`;
uiContent = uiContent.replace(oldHandleSubmit, newHandleSubmit);

// Update error rendering
const oldFormTop = `<p className="text-center text-gray-500 mb-8 text-xs leading-relaxed">
              Submit your Team ID or Email to flag your account for reset, or to check the status of an existing request.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">`;
            
const newFormTop = `<p className="text-center text-gray-500 mb-6 text-xs leading-relaxed">
              Submit your Team ID or Email to flag your account for reset, or to check the status of an existing request.
            </p>
            {errorMessage && <div className="mb-6 p-3 bg-red-900/30 border border-red-500 text-red-400 text-sm text-center animate-pulse">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">`;
uiContent = uiContent.replace(oldFormTop, newFormTop);

fs.writeFileSync('src/app/(auth)/forgot-password/page.tsx', uiContent);
console.log("UI updated");
