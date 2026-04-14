"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useEvents } from "@/hooks/useEvents";
import { useModules } from "@/hooks/useModules";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/shared/EmptyState";
import { LeaderboardRowSkeleton } from "@/components/ui/Skeleton";
import { mutationFetcher } from "@/lib/fetcher";

export default function AdminResultsPage() {
  const { events } = useEvents();
  const [selectedEventId, setSelectedEventId]   = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [confirmOpen, setConfirmOpen]           = useState(false);
  const [isPublishing, setIsPublishing]         = useState(false);

  const { modules } = useModules(selectedEventId || null);
  const { entries, isLoading } = useLeaderboard(selectedModuleId || null);
  const { getToken } = useAuth();
  const { toast } = useToast();

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const token = await getToken();
      await mutationFetcher(`/modules/${selectedModuleId}/publish-results`, "POST", {}, token);
      toast.success("Results published!", "Leaderboard is now public and participants have been notified.");
      setConfirmOpen(false);
    } catch (err) {
      toast.error("Failed to publish", err instanceof Error ? err.message : "");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Results"
          description="Preview leaderboards and publish results."
          actions={
            selectedModuleId && !selectedModule?.resultsPublished ? (
              <Button variant="primary" size="sm" onClick={() => setConfirmOpen(true)}>
                Publish Results
              </Button>
            ) : selectedModule?.resultsPublished ? (
              <span className="text-xs font-medium text-[var(--status-success)] bg-[var(--status-success-bg)] px-3 py-1.5 rounded-full border border-[color-mix(in_srgb,var(--status-success)_25%,transparent)]">
                ✓ Results Published
              </span>
            ) : undefined
          }
        />

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
          isLoading ? (
            <LeaderboardRowSkeleton count={5} />
          ) : entries.length === 0 ? (
            <EmptyState title="No results yet" description="Evaluate submissions first, then publish results." />
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Leaderboard Preview — {selectedModule?.title}
                </p>
              </div>
              <ul className="divide-y divide-[var(--border-subtle)]">
                {entries.map((e) => (
                  <li key={e.rank} className="flex items-center gap-4 px-4 py-3">
                    <span className={[
                      "w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shrink-0",
                      e.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                      e.rank === 2 ? "bg-gray-100 text-gray-600" :
                      e.rank === 3 ? "bg-orange-100 text-orange-600" :
                      "bg-[var(--bg-muted)] text-[var(--text-muted)]",
                    ].join(" ")}>
                      {e.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{e.team?.name ?? e.user.name}</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--accent-500)]">{e.score.toFixed(1)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        ) : (
          <EmptyState title="Select a module" description="Choose a module to preview its leaderboard." />
        )}
      </div>

      {/* Confirm publish modal */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Publish Results" size="sm">
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          This will lock the leaderboard and send result notifications to all participants. This action cannot be undone.
        </p>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handlePublish} isLoading={isPublishing}>
            Publish Now
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
