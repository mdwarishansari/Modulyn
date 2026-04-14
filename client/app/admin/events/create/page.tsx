"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { z } from "zod";
import { useToast } from "@/components/ui/Toast";
import { Form } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { Loader } from "@/components/ui/Loader";
import { mutationFetcher } from "@/lib/fetcher";
import { createEventSchema, createModuleSchema } from "@/lib/validations";
import type { CreateEventInput, CreateModuleInput } from "@/lib/validations";
import type { Event, Module } from "@/types";

const STEPS = ["Event Details", "Add Modules", "Review & Publish"] as const;
type Step = 0 | 1 | 2;

const MODULE_TYPE_OPTIONS = [
  { value: "HACKATHON",    label: "Hackathon"    },
  { value: "QUIZ",         label: "Quiz"         },
  { value: "CODING",       label: "Coding"       },
  { value: "POSTER",       label: "Poster"       },
  { value: "UIUX",         label: "UI/UX"        },
  { value: "PRESENTATION", label: "Presentation" },
  { value: "VOTING",       label: "Voting"       },
  { value: "CUSTOM",       label: "Custom"       },
];

export default function CreateEventPage() {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [step, setStep]           = useState<Step>(0);
  const [createdEvent, setCreatedEvent]   = useState<Event | null>(null);
  const [createdModules, setCreatedModules] = useState<Module[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // Step 1: Create event
  const handleEventSubmit = async (data: CreateEventInput) => {
    try {
      const token = await getToken();
      const event = await mutationFetcher<Event>("/events", "POST", data, token);
      setCreatedEvent(event);
      toast.success("Event created!", "Now add modules.");
      setStep(1);
    } catch (err) {
      toast.error("Failed to create event", err instanceof Error ? err.message : "");
    }
  };

  // Step 2: Add a module
  const handleAddModule = async (data: CreateModuleInput) => {
    if (!createdEvent) return;
    try {
      const token = await getToken();
      const module = await mutationFetcher<Module>("/modules", "POST", { ...data, eventId: createdEvent.id }, token);
      setCreatedModules((prev) => [...prev, module]);
      toast.success("Module added!", module.title);
    } catch (err) {
      toast.error("Failed to add module", err instanceof Error ? err.message : "");
    }
  };

  // Step 3: Publish
  const handlePublish = async () => {
    if (!createdEvent) return;
    setIsPublishing(true);
    try {
      const token = await getToken();
      await mutationFetcher(`/events/${createdEvent.id}/state`, "PATCH", { state: "PUBLISHED" }, token);
      toast.success("Event published!", "Your event is now live.");
      router.push(`/admin/events/${createdEvent.id}`);
    } catch (err) {
      toast.error("Failed to publish", err instanceof Error ? err.message : "");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <PageHeader title="Create Event" description="Set up a new event with modules." />

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-0 flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={[
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                i < step ? "bg-[var(--status-success)] text-white"
                  : i === step ? "bg-[var(--accent-500)] text-white"
                  : "bg-[var(--bg-muted)] text-[var(--text-muted)]",
              ].join(" ")}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className="text-xs text-[var(--text-muted)] whitespace-nowrap hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={["flex-1 h-0.5 mx-2 transition-colors", i < step ? "bg-[var(--status-success)]" : "bg-[var(--border-default)]"].join(" ")} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Event details */}
      {step === 0 && (
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">Event Details</h2>
          <Form schema={createEventSchema} onSubmit={handleEventSubmit}>
            <Form.Field name="title" label="Event Title" placeholder="Spring Hackathon 2025" />
            <Form.Field name="slug" label="URL Slug" placeholder="spring-hackathon-2025" helperText="Used in the event URL: /e/org/slug" />
            <Form.Field name="organizationId" label="Organization ID" placeholder="org_…" helperText="The ID of your organization from the backend" />
            <Form.Field name="description" type="textarea" label="Description" placeholder="Tell participants about this event…" />
            <Form.Field name="visibility" type="select" label="Visibility" options={[
              { value: "PUBLIC", label: "Public" },
              { value: "PRIVATE", label: "Private" },
              { value: "INVITE_ONLY", label: "Invite Only" },
            ]} />
            <Form.Field name="startsAt" type="date" label="Start Date (optional)" />
            <Form.Field name="endsAt" type="date" label="End Date (optional)" />
            <Form.Submit>Create Event →</Form.Submit>
          </Form>
        </div>
      )}

      {/* Step 1: Add modules */}
      {step === 1 && createdEvent && (
        <div className="flex flex-col gap-4">
          {createdModules.length > 0 && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] divide-y divide-[var(--border-subtle)] overflow-hidden">
              {createdModules.map((m) => (
                <div key={m.id} className="px-4 py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{m.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{m.type} · {m.mode}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[color-mix(in_srgb,var(--status-success)_25%,transparent)]">Added</span>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">Add a Module</h2>
            <Form schema={createModuleSchema.omit({ eventId: true })} onSubmit={(d) => handleAddModule({ ...d, eventId: createdEvent.id })}>
              <Form.Field name="title" label="Module Title" placeholder="Main Hackathon" />
              <Form.Field name="type" type="select" label="Module Type" options={MODULE_TYPE_OPTIONS} />
              <Form.Field name="mode" type="select" label="Mode" options={[{ value: "INDIVIDUAL", label: "Individual" }, { value: "TEAM", label: "Team" }]} />
              <Form.Field name="maxTeamSize" type="number" label="Max Team Size (if team)" placeholder="4" />
              <Form.Field name="description" type="textarea" label="Description (optional)" />
              <Form.Field name="rules" type="textarea" label="Rules (optional)" />
              <div className="flex gap-3">
                <Form.Submit className="flex-1">+ Add Module</Form.Submit>
                {createdModules.length > 0 && (
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                    Next: Review →
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </div>
      )}

      {/* Step 2: Review & publish */}
      {step === 2 && createdEvent && (
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-card)] p-6 flex flex-col gap-5">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Review & Publish</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span className="text-[var(--text-muted)]">Title</span><span className="font-medium">{createdEvent.title}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-muted)]">Slug</span><code className="text-xs">{createdEvent.slug}</code></div>
            <div className="flex justify-between"><span className="text-[var(--text-muted)]">Modules</span><span className="font-medium">{createdModules.length}</span></div>
          </div>
          <div className="flex gap-3 mt-2">
            <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
            <Button variant="primary" onClick={handlePublish} isLoading={isPublishing} className="flex-1">
              Publish Event
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
