"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import { fetcher, mutationFetcher } from "@/lib/fetcher";
import { PageHeader } from "@/components/shared/PageHeader";
import { FetchError } from "@/components/ui/FetchError";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { useToast } from "@/components/ui/Toast";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { getSubmissionUI } from "@/lib/states";
import type { Submission, SubmissionStatus } from "@/types";

function ScoreModal({
  submission,
  isOpen,
  onClose,
  onSuccess
}: {
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [score, setScore] = useState(submission?.score?.toString() || "");
  const [feedback, setFeedback] = useState(submission?.feedback || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!submission) return;
    setIsSubmitting(true);
    try {
      const token = await getToken();
      await mutationFetcher(`/submissions/${submission.id}/evaluate`, "POST", { 
        score: parseFloat(score), 
        feedback 
      }, token);
      toast.success("Submission evaluated");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to evaluate", err instanceof Error ? err.message : "");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Evaluate Submission">
      <div className="flex flex-col gap-4">
        <Input 
          type="number"
          label="Score (0-100)" 
          value={score} 
          onChange={(e) => setScore(e.target.value)} 
          min={0} max={100} 
        />
        <Textarea 
          label="Feedback (Optional)" 
          value={feedback} 
          onChange={(e) => setFeedback(e.target.value)} 
          rows={3} 
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting} disabled={!score}>Submit Evaluation</Button>
        </div>
      </div>
    </Modal>
  );
}

function AdminSubmissionRow({ 
  submission, 
  onEvaluate,
  onDisqualify 
}: { 
  submission: Submission; 
  onEvaluate: (s: Submission) => void;
  onDisqualify: (s: Submission) => void;
}) {
  const ui = getSubmissionUI(submission.status);
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-subtle)] transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
             {submission.team ? submission.team.name : submission.user?.name ?? "Anonymous"}
          </p>
          <span 
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border shrink-0" 
            style={{ 
              color: ui.colorVar, 
              backgroundColor: `color-mix(in srgb, ${ui.colorVar} 10%, transparent)`,
              borderColor: `color-mix(in srgb, ${ui.colorVar} 30%, transparent)`
            }}
          >
            {ui.label}
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] truncate">
          {submission.module?.title} ({submission.module?.event?.title})
        </p>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
        {submission.score !== null ? (
           <p className="text-sm font-bold text-[var(--text-primary)]">{submission.score.toFixed(1)} / 100</p>
        ) : (
           <p className="text-xs italic text-[var(--text-muted)]">Needs score</p>
        )}
        <div className="flex items-center gap-2">
           <Dropdown
              align="right"
              trigger={<Button variant="ghost" size="sm">Action ▾</Button>}
              items={[
                { label: "Evaluate", onClick: () => onEvaluate(submission) },
                { label: "Disqualify", onClick: () => onDisqualify(submission) },
              ]}
            />
        </div>
      </div>
    </div>
  );
}

export default function AdminSubmissionsPage() {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [evaluatingSub, setEvaluatingSub] = useState<Submission | null>(null);
  
  const { data: submissions, error, isLoading, mutate } = useSWR<Submission[]>(
    "/submissions/admin",
    async (endpoint: string) => {
      const token = await getToken();
      return fetcher<Submission[]>(endpoint, token);
    },
    { revalidateOnFocus: false }
  );

  const handleDisqualify = async (sub: Submission) => {
    if (!confirm(`Are you sure you want to disqualify ${sub.team?.name || sub.user?.name}?`)) return;
    try {
      const token = await getToken();
      await mutationFetcher(`/submissions/${sub.id}/status`, "PATCH", { status: "DISQUALIFIED" }, token);
      toast.success("Submission disqualified");
      mutate();
    } catch (err) {
      toast.error("Failed to update status", err instanceof Error ? err.message : "");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Submissions" 
        description="Review and evaluate participant submissions across events."
      />

      {error ? (
        <FetchError onRetry={() => mutate()} />
      ) : isLoading ? (
        <div className="flex justify-center py-12"><Loader size="lg" /></div>
      ) : !submissions || submissions.length === 0 ? (
        <EmptyState
          title="No submissions found"
          description="Incoming submissions will appear here once participants start submitting."
        />
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden flex flex-col">
          {submissions.map(s => (
            <AdminSubmissionRow 
               key={s.id} 
               submission={s} 
               onEvaluate={setEvaluatingSub}
               onDisqualify={handleDisqualify}
            />
          ))}
        </div>
      )}

      {/* Evaluate Modal */}
      <ScoreModal 
         submission={evaluatingSub} 
         isOpen={!!evaluatingSub} 
         onClose={() => setEvaluatingSub(null)}
         onSuccess={mutate}
      />
    </div>
  );
}
