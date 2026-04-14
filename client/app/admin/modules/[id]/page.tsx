"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useModule } from "@/hooks/useModules";
import { useAllSubmissions, useEvaluate } from "@/hooks/useSubmissions";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { StateBadge } from "@/components/shared/StateBadge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Form } from "@/components/ui/Form";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/shared/EmptyState";
import { SubmissionRowSkeleton } from "@/components/ui/Skeleton";
import { Dropdown } from "@/components/ui/Dropdown";
import { mutationFetcher } from "@/lib/fetcher";
import { MODULE_STATE_TRANSITIONS, getSubmissionUI } from "@/lib/states";
import { evaluateSubmissionSchema } from "@/lib/validations";
import type { EvaluateSubmissionInput } from "@/lib/validations";
import type { ModuleState, Submission } from "@/types";

function EvaluateModal({ submission, onClose, onDone }: { submission: Submission; onClose: () => void; onDone: () => void }) {
  const { evaluate, isLoading } = useEvaluate();
  const { toast } = useToast();

  const handleEvaluate = async (data: EvaluateSubmissionInput) => {
    const ok = await evaluate(submission.id, data);
    if (ok) { toast.success("Evaluated!"); onDone(); onClose(); }
    else toast.error("Evaluation failed");
  };

  return (
    <Modal isOpen onClose={onClose} title="Evaluate Submission" size="md">
      <div className="flex flex-col gap-3 mb-4">
        <p className="text-xs text-[var(--text-muted)]">Submission ID: <code className="text-xs">{submission.id.slice(0, 12)}…</code></p>
        {submission.score !== null && (
          <p className="text-xs text-[var(--status-success)]">Already evaluated — Score: {submission.score}</p>
        )}
      </div>
      <Form schema={evaluateSubmissionSchema} onSubmit={handleEvaluate}>
        <Form.Field name="score" type="number" label="Score (0–100)" placeholder="85" />
        <Form.Field name="feedback" type="textarea" label="Feedback (optional)" placeholder="Great approach, but…" />
        <Modal.Footer>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Form.Submit className="ml-0">Save Evaluation</Form.Submit>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default function AdminModulePage() {
  const params = useParams<{ id: string }>();
  const { module, isLoading: moduleLoading, refetch: refetchModule } = useModule(params.id);
  const { submissions, isLoading: subLoading, refetch: refetchSubs } = useAllSubmissions(params.id);
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [evaluating, setEvaluating] = useState<Submission | null>(null);

  const handleStateChange = async (state: ModuleState) => {
    try {
      const token = await getToken();
      await mutationFetcher(`/modules/${params.id}/state`, "PATCH", { state }, token);
      toast.success("State updated");
      refetchModule();
    } catch (err) {
      toast.error("Failed", err instanceof Error ? err.message : "");
    }
  };

  if (moduleLoading) return <div className="flex justify-center py-12"><Loader size="lg" /></div>;
  if (!module) return <EmptyState title="Module not found" />;

  const nextStates = MODULE_STATE_TRANSITIONS[module.state];

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={module.title}
          description={`${module.type} · ${module.mode}`}
          actions={
            <div className="flex items-center gap-2">
              <StateBadge state={module.state} />
              {nextStates.length > 0 && (
                <Dropdown
                  align="right"
                  trigger={<Button variant="secondary" size="sm">Change State ▾</Button>}
                  items={nextStates.map((s) => ({ label: `→ ${s.replace(/_/g, " ")}`, onClick: () => handleStateChange(s) }))}
                />
              )}
            </div>
          }
        />

        {/* Submissions table */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Submissions ({submissions.length})
          </h2>
          {subLoading ? (
            <SubmissionRowSkeleton count={4} />
          ) : submissions.length === 0 ? (
            <EmptyState title="No submissions yet" description="Submissions will appear here once participants submit." />
          ) : (
            <div className="flex flex-col gap-2">
              {submissions.map((s) => {
                const ui = getSubmissionUI(s.status);
                return (
                  <div key={s.id} className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">User: {s.userId.slice(0, 12)}…</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {new Date(s.submittedAt).toLocaleString("en-IN")}
                      </p>
                      {s.score !== null && (
                        <p className="text-xs font-semibold text-[var(--accent-500)]">Score: {s.score}/100</p>
                      )}
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium border shrink-0"
                      style={{ color: ui.colorVar, backgroundColor: `color-mix(in srgb, ${ui.colorVar} 10%, transparent)`, borderColor: `color-mix(in srgb, ${ui.colorVar} 25%, transparent)` }}
                    >
                      {ui.label}
                    </span>
                    <Button variant="secondary" size="sm" onClick={() => setEvaluating(s)}>
                      Evaluate
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {evaluating && (
        <EvaluateModal
          submission={evaluating}
          onClose={() => setEvaluating(null)}
          onDone={refetchSubs}
        />
      )}
    </>
  );
}
