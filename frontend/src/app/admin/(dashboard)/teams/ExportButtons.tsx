"use client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportButtons({ teams }: { teams: any[] }) {
  const handleExportCSV = () => {
    if (!teams || teams.length === 0) return alert("No teams to export");
    const headers = ["Team ID", "Name", "Leader", "Email", "Phone", "College", "Level", "Score", "Status"];
    const csvContent = [
      headers.join(","),
      ...teams.map(t => [
        t.teamId,
        `"${t.teamName.replace(/"/g, '""')}"`,
        `"${t.leaderName.replace(/"/g, '""')}"`,
        t.leaderEmail,
        t.contactNumber,
        `"${t.college.replace(/"/g, '""')}"`,
        t.currentLevel,
        t.score,
        t.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `teams_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (!teams || teams.length === 0) return alert("No teams to export");
    const doc = new jsPDF("landscape");
    
    doc.setFontSize(14);
    doc.text("Cryptic Hunt - Registered Teams", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    const tableColumn = ["Team ID", "Name", "Leader", "Email", "Phone", "College", "Level", "Score", "Status"];
    const tableRows = teams.map(t => [
      t.teamId,
      t.teamName,
      t.leaderName,
      t.leaderEmail,
      t.contactNumber,
      t.college,
      t.currentLevel.toString(),
      t.score.toString(),
      t.status
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [6, 182, 212] },
      styles: { fontSize: 8 }
    });

    doc.save(`teams_export_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={handleExportCSV}
        className="px-4 py-2 bg-gray-900 border border-gray-700 hover:border-cyan-500 hover:bg-cyan-900/20 text-gray-300 hover:text-cyan-400 text-[10px] font-bold tracking-widest uppercase transition-all rounded-sm"
      >
        [ CSV ]
      </button>
      <button 
        onClick={handleExportPDF}
        className="px-4 py-2 bg-gray-900 border border-gray-700 hover:border-cyan-500 hover:bg-cyan-900/20 text-gray-300 hover:text-cyan-400 text-[10px] font-bold tracking-widest uppercase transition-all rounded-sm"
      >
        [ PDF ]
      </button>
    </div>
  );
}
