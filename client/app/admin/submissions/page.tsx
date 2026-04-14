"use client";

import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useModules } from "@/hooks/useModules";
import { useAllSubmissions, useEvaluate } from "@/hooks/useSubmissions";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { SubmissionRowSkeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { Form } from "@/components/ui/Form";
import { getSubmissionUI } from "@/lib/states";
import { evaluateSubmissionSchema } from "@/lib/validations";
import type { EvaluateSubmissionInput } from "@/lib/validations";
import type { Submission } from "@/types";

function SubmissionsTable({ moduleId }: { moduleId: string }) {
  const { submissions, isLoading, refetch } = useAllSubmissions(moduleId);
  const { evaluate, isLoading: isEvaluating } = useEvaluate();
  const { toast } = useToast();
  const [target, setTarget] = useState<Submission | null>(null);

  const handleEvaluate = async (data: EvaluateSubmissionInput) => {
    if (!target) return;
    const ok = await evaluate(target.id, data);
    if (ok) { toast.success("Evaluated!"); refetch(); setTarget(null); }
    else toast.error("Evaluation failed");
  };

  if (isLoading) return <SubmissionRowSkeleton count={5} />;
  if (submissions.length === 0) return <EmptyState title="No submissions" description="No one has submitted yet." />;

  return (
    <>
      <div className="flex flex-col gap-2">
        {submissions.map((s) => {
          const ui = getSubmissionUI(s.status);
          return (
            <div key={s.id} className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {s.teamId ? `Team: ${s.teamId.slice(0, 12)}…` : `User: ${s.userId.slice(0, 12)}…`}
                </p>
                <p className="text-xs text-[var(--text-muted)]">{new Date(s.submittedAt).toLocaleString("en-IN")}</p>
                {s.score !== null && <p className="text-xs font-semibold text-[var(--accent-500)]">Score: {s.score}</p>}
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium border shrink-0"
                style={{ color: ui.colorVar, backgroundColor: `color-mix(in srgb, ${ui.colorVar} 10%, transparent)`, borderColor: `color-mix(in srgb, ${ui.colorVar} 25%, transparent)` }}>
                {ui.label}
              </span>
              <Button size="sm" variant="secondary" onClick={() => setTarget(s)}>Evaluate</Button>
            </div>
          );
        })}
      </div>

      {target && (
        <Modal isOpen onClose={() => setTarget(null)} title="Evaluate Submission" size="md">
          <Form schema={evaluateSubmissionSchema} onSubmit={handleEvaluate}>
            <Form.Field name="score" type="number" label="Score (0–100)" placeholder="85" />
            <Form.Field name="feedback" type="textarea" label="Feedback" placeholder="Feedback for the team/participant" />
            <Modal.Footer>
              <Button variant="ghost" onClick={() => setTarget(null)}>Cancel</Button>
              <Form.Submit>Save</Form.Submit>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
}

export default function AdminSubmissionsPage() {
  const { events } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const { modules } = useModules(selectedEventId || null);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Submissions" description="View and evaluate all submissions across modules." />

      <div className="flex flex-wrap gap-3">
        <Select
          label="Event"
          options={events.map((e) => ({ value: e.id, label: e.title }))}
          placeholder="Select an event…"
          value={selectedEventId}
          onChange={(e) => { setSelectedEventId(e.target.value); setSelectedModuleId(""); }}
          className="w-56"
        />
        {selectedEventId && (
          <Select
            label="Module"
            options={modules.map((m) => ({ value: m.id, label: m.title }))}
            placeholder="Select a module…"
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="w-56"
          />
        )}
      </div>

      {selectedModuleId ? (
        <SubmissionsTable moduleId={selectedModuleId} />
      ) : (
        <EmptyState title="Select a module" description="Choose an event and module to view submissions." />
      )}
    </div>
  );
}
