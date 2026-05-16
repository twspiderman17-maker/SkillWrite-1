import { useState } from "react";
import type { Track } from "../types";
import { downloadStudyIcs, exportProgressJson, importProgressJson } from "../lib/progress";

type Props = {
  track: Track;
};

export function RevisionIntegrations({ track }: Props) {
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900">Study tools</h3>
      <p className="mt-2 text-sm text-slate-600 max-w-2xl">
        Save your progress, move it to another device, or add a 25-minute revision block to your calendar.
      </p>
      
      <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
        <button
          type="button"
          onClick={() => {
            downloadStudyIcs(track.title);
            setMsg("Downloaded study-block.ics — open it to add to your calendar app.");
          }}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          Download calendar block (.ics)
        </button>
        
        <button
          type="button"
          onClick={() => {
            const blob = new Blob([exportProgressJson()], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "workflow-ai-progress.json";
            a.click();
            URL.revokeObjectURL(url);
            setMsg("Exported progress JSON.");
          }}
          className="rounded-xl bg-white border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
        >
          Export progress JSON
        </button>
        
        <label className="cursor-pointer rounded-xl bg-white border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all text-center">
          Import progress JSON
          <input
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              f.text().then((t) => {
                const ok = importProgressJson(t);
                setMsg(ok ? "Imported progress successfully." : "Invalid JSON — no changes applied.");
                e.target.value = "";
              });
            }}
          />
        </label>
      </div>
      
      {msg && (
        <div className="mt-6 rounded-xl bg-blue-50 p-4 border border-blue-100">
          <p className="text-sm font-medium text-blue-800">{msg}</p>
        </div>
      )}
    </div>
  );
}
