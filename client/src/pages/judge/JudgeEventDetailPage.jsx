import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ExportButton } from "@/components/ui/ExportButton";
import { downloadCsvFile } from "@/lib/reportExport";
import { useGetJudgeEventByIdQuery, useSaveJudgeResultMutation, useSaveJudgeScoreMutation } from "@/store/api";

const DEFAULT_ROUNDS = ["Round 1", "Round 2", "Final"];

async function uploadJudgeFile({ file, eventId, roundLabel }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("eventId", String(eventId));
  formData.append("roundLabel", roundLabel);

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/upload/judge-result`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message || "Unable to upload result file.");
  }

  return payload?.data;
}

export default function JudgeEventDetailPage() {
  const { D } = useOutletContext();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [roundLabel, setRoundLabel] = useState(DEFAULT_ROUNDS[0]);
  const [scores, setScores] = useState({});
  const [scoreMessage, setScoreMessage] = useState("");
  const [fileMessage, setFileMessage] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [fileSummary, setFileSummary] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [saveScore, { isLoading: isSavingScore }] = useSaveJudgeScoreMutation();
  const [saveResult, { isLoading: isSavingResult }] = useSaveJudgeResultMutation();

  const { data, isLoading, isError, error } = useGetJudgeEventByIdQuery(eventId);
  const event = data?.event;
  const participants = useMemo(() => event?.participants ?? [], [event?.participants]);
  const judgeScores = useMemo(() => event?.judgeScores ?? [], [event?.judgeScores]);
  const judgeResults = useMemo(() => event?.judgeResults ?? [], [event?.judgeResults]);

  // Load existing scores into the scores state when judgeScores or roundLabel changes
  useEffect(() => {
    const loadedScores = {};
    judgeScores.forEach((score) => {
      if (score.roundLabel === roundLabel) {
        loadedScores[score.registrationId] = {
          marks: score.marks,
          remarks: score.remarks || "",
        };
      }
    });
    setScores(loadedScores);
  }, [judgeScores, roundLabel]);

  const errorMessage = error?.data?.message || "Unable to load event.";

  function setDraftScore(registrationId, field, value) {
    setScores((current) => ({
      ...current,
      [registrationId]: {
        ...(current[registrationId] || {}),
        [field]: value,
      },
    }));
  }

  async function handleSaveScore(registrationId) {
    const draft = scores[registrationId] || {};

    setScoreMessage("");

    try {
      await saveScore({
        eventId: Number(eventId),
        registrationId,
        roundLabel,
        marks: draft.marks,
        remarks: draft.remarks || "",
      }).unwrap();
      setScoreMessage("Score saved successfully.");
    } catch (saveError) {
      setScoreMessage(saveError?.data?.message || "Unable to save score.");
    }
  }

  async function handleUploadResult() {
    setFileMessage("");

    if (!selectedFile || !fileTitle.trim()) {
      setFileMessage("Select a file and enter a title first.");
      return;
    }

    try {
      const uploadData = await uploadJudgeFile({
        file: selectedFile,
        eventId: Number(eventId),
        roundLabel,
      });

      await saveResult({
        eventId: Number(eventId),
        roundLabel,
        title: fileTitle,
        fileUrl: uploadData.fileUrl,
        fileName: uploadData.fileName,
        fileType: uploadData.fileType,
        summary: fileSummary,
      }).unwrap();

      setFileMessage("Result file uploaded and saved successfully.");
      setSelectedFile(null);
      setFileTitle("");
      setFileSummary("");
    } catch (saveError) {
      setFileMessage(saveError?.data?.message || saveError.message || "Unable to save result file.");
    }
  }

  function handleExportReport() {
    const reportData = participants.map((participant) => ({
      ...participant,
      participantName: participant.user?.name || participant.formResponse?.["Full Name"] || "Unknown",
      participantEmail: participant.user?.email || participant.formResponse?.["Email"] || "No email",
      participantPhone: participant.user?.contactPhone || "No phone",
      department: participant.user?.department?.DepartmentName || "Unknown",
    }));

    const scoresForRound = judgeScores.filter((score) => score.roundLabel === roundLabel);

    downloadCsvFile(
      `${event.eventName.toLowerCase().replace(/\s+/g, "-")}-${roundLabel.toLowerCase().replace(/\s+/g, "-")}-report.csv`,
      reportData,
      [
        { label: "Participant Name", value: (item) => item.participantName },
        { label: "Email", value: (item) => item.participantEmail },
        { label: "Phone", value: (item) => item.participantPhone },
        { label: "Department", value: (item) => item.department },
        { label: "Marks", value: (item) => {
          const score = scoresForRound.find((s) => s.registrationId === item.id);
          return score?.marks ?? "Not scored";
        }},
        { label: "Remarks", value: (item) => {
          const score = scoresForRound.find((s) => s.registrationId === item.id);
          return score?.remarks ?? "";
        }},
        { label: "Registration Status", value: (item) => item.status },
        { label: "Registered At", value: (item) => new Date(item.registeredAt).toLocaleString("en-IN") },
      ],
    );
  }

  if (isLoading) {
    return <div className="p-8 text-slate-500">Loading event...</div>;
  }

  if (isError || !event) {
    return (
      <div className="flex-1 overflow-hidden flex items-center justify-center px-8">
        <div className={cn("rounded-2xl border p-10 text-center max-w-xl w-full", D("bg-[#0D1626] border-white/[0.07] text-rose-400", "bg-white border-slate-200 text-rose-600"))}>
          <p className="font-semibold text-[16px] mb-2">Event not found</p>
          <p className="text-[13px]">{errorMessage}</p>
          <button
            onClick={() => navigate("/dashboard/judge/events")}
            className="mt-5 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white"
            style={{ background: "#8B5CF6" }}
          >
            Back to events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>{event.eventName}</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            Score participants and publish round results for this event.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton onClick={handleExportReport} label="Export report" disabled={participants.length === 0 || isLoading} />
          <button
            onClick={() => navigate("/dashboard/judge/events")}
            className={cn("px-4 py-2.5 rounded-xl text-[13px] font-bold border", D("border-white/[0.08] text-slate-300", "border-slate-200 text-slate-600"))}
          >
            Back to events
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className={cn("lg:col-span-2 rounded-3xl border p-6", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className={cn("text-[16px] font-bold", D("text-slate-100", "text-slate-900"))}>Participants</h2>
                <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>Use the active round label and enter marks for each participant.</p>
              </div>
              <div className="min-w-[180px]">
                <label className={cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"))}>Round label</label>
                <select
                  value={roundLabel}
                  onChange={(event) => setRoundLabel(event.target.value)}
                  className={cn("w-full px-3.5 py-2.5 rounded-xl border text-[13px] outline-none", D("bg-[#111827] border-white/[0.1] text-slate-300", "bg-white border-slate-200 text-slate-700"))}
                >
                  {DEFAULT_ROUNDS.map((round) => (
                    <option key={round} value={round}>{round}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={cn("border-b", D("bg-white/[0.03] border-white/[0.06]", "bg-slate-50 border-slate-200"))}>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Participant</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Email</th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Marks</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Remarks</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => {
                    const draft = scores[participant.id] || {};

                    return (
                      <tr key={participant.id} className={cn("border-b last:border-0", D("border-white/[0.04]", "border-slate-100"))}>
                        <td className={cn("px-4 py-3.5 text-[13px] font-medium", D("text-slate-200", "text-slate-700"))}>
                          {participant.user?.name || participant.formResponse?.["Full Name"] || "Unknown"}
                        </td>
                        <td className={cn("px-4 py-3.5 text-[13px]", D("text-slate-300", "text-slate-600"))}>
                          {participant.user?.email || participant.formResponse?.["Email"] || "Unknown"}
                        </td>
                        <td className="px-4 py-3.5">
                          <input
                            type="number"
                            min="0"
                            value={draft.marks ?? ""}
                            onChange={(event) => setDraftScore(participant.id, "marks", event.target.value)}
                            className={cn("w-24 px-3 py-2 rounded-xl border text-[13px] outline-none", D("bg-[#111827] border-white/[0.1] text-slate-300", "bg-white border-slate-200 text-slate-700"))}
                          />
                        </td>
                        <td className="px-4 py-3.5">
                          <input
                            type="text"
                            value={draft.remarks ?? ""}
                            onChange={(event) => setDraftScore(participant.id, "remarks", event.target.value)}
                            className={cn("w-full px-3 py-2 rounded-xl border text-[13px] outline-none", D("bg-[#111827] border-white/[0.1] text-slate-300 placeholder:text-slate-600", "bg-white border-slate-200 text-slate-700 placeholder:text-slate-400"))}
                            placeholder="Optional remarks"
                          />
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleSaveScore(participant.id)}
                            disabled={isSavingScore}
                            className="px-3.5 py-2 rounded-xl text-[12px] font-bold text-white disabled:opacity-60"
                            style={{ background: "#8B5CF6" }}
                          >
                            Save score
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {participants.length === 0 && (
                    <tr>
                      <td colSpan={5} className={cn("text-center py-14", D("bg-[#0D1626] text-slate-400", "bg-white text-slate-500"))}>
                        No participants registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {scoreMessage && (
              <div className={cn("mt-4 rounded-xl px-3.5 py-2.5 text-[13px] border", scoreMessage.toLowerCase().includes("success") ? D("bg-emerald-500/10 border-emerald-500/20 text-emerald-400", "bg-emerald-50 border-emerald-200 text-emerald-600") : D("bg-rose-500/10 border-rose-500/20 text-rose-400", "bg-rose-50 border-rose-200 text-rose-600"))}>
                {scoreMessage}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className={cn("rounded-3xl border p-6", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
              <h2 className={cn("text-[16px] font-bold mb-4", D("text-slate-100", "text-slate-900"))}>Upload Result File</h2>
              <div className="flex flex-col gap-3">
                <div>
                  <label className={cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"))}>Title</label>
                  <input
                    type="text"
                    value={fileTitle}
                    onChange={(event) => setFileTitle(event.target.value)}
                    placeholder="e.g. Round 1 shortlist"
                    className={cn("w-full px-3.5 py-2.5 rounded-xl border text-[13px] outline-none", D("bg-[#111827] border-white/[0.1] text-slate-300 placeholder:text-slate-600", "bg-white border-slate-200 text-slate-700 placeholder:text-slate-400"))}
                  />
                </div>
                <div>
                  <label className={cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"))}>Summary</label>
                  <textarea
                    rows={4}
                    value={fileSummary}
                    onChange={(event) => setFileSummary(event.target.value)}
                    placeholder="Optional summary of the round result"
                    className={cn("w-full px-3.5 py-2.5 rounded-xl border text-[13px] outline-none resize-none", D("bg-[#111827] border-white/[0.1] text-slate-300 placeholder:text-slate-600", "bg-white border-slate-200 text-slate-700 placeholder:text-slate-400"))}
                  />
                </div>
                <div>
                  <label className={cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"))}>File (Images only)</label>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.gif"
                    onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                    disabled={isSavingResult}
                    className={cn("w-full text-[13px]", D("text-slate-300", "text-slate-700"), isSavingResult && "opacity-50 cursor-not-allowed")}
                  />
                  {selectedFile && (
                    <p className={cn("text-[11px] mt-1.5", D("text-slate-400", "text-slate-500"))}>
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleUploadResult}
                  disabled={isSavingResult}
                  className={cn("px-3.5 py-2.5 rounded-xl text-[13px] font-bold text-white disabled:opacity-60 flex items-center justify-center gap-2", isSavingResult && "cursor-wait")}
                  style={{ background: "#8B5CF6" }}
                >
                  {isSavingResult ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    "Upload result"
                  )}
                </button>
              </div>
              {fileMessage && (
                <div className={cn("mt-4 rounded-xl px-3.5 py-2.5 text-[13px] border", fileMessage.toLowerCase().includes("success") ? D("bg-emerald-500/10 border-emerald-500/20 text-emerald-400", "bg-emerald-50 border-emerald-200 text-emerald-600") : D("bg-rose-500/10 border-rose-500/20 text-rose-400", "bg-rose-50 border-rose-200 text-rose-600"))}>
                  {fileMessage}
                </div>
              )}
            </div>

            <div className={cn("rounded-3xl border p-6", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
              <h2 className={cn("text-[16px] font-bold mb-4", D("text-slate-100", "text-slate-900"))}>Saved Results</h2>
              <div className="flex flex-col gap-3">
                {judgeResults.map((result) => (
                  <a
                    key={result.id}
                    href={result.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn("rounded-2xl border px-4 py-3 transition-colors", D("border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05]", "border-slate-200 bg-slate-50 hover:bg-slate-100"))}
                  >
                    <p className={cn("text-[13px] font-semibold", D("text-slate-100", "text-slate-800"))}>{result.title}</p>
                    <p className={cn("text-[11px] mt-1", D("text-slate-500", "text-slate-400"))}>{result.roundLabel} · {result.fileType}</p>
                  </a>
                ))}
                {judgeResults.length === 0 && (
                  <p className={cn("text-[13px]", D("text-slate-500", "text-slate-500"))}>No result files uploaded yet.</p>
                )}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
