"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useModule } from "@/hooks/useModules";
import { useMySubmission, useSubmit } from "@/hooks/useSubmissions";
import { useIsRegistered } from "@/hooks/useRegistrations";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useTeams } from "@/hooks/useTeams";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { FileUpload } from "@/components/ui/FileUpload";
import { Modal } from "@/components/ui/Modal";
import { FetchError } from "@/components/ui/FetchError";
import { StateBadge } from "@/components/shared/StateBadge";
import { LeaderboardRowSkeleton } from "@/components/ui/Skeleton";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/shared/EmptyState";
import { getSubmissionUI } from "@/lib/states";
import { submissionSchemas } from "@/lib/validations";
import Link from "next/link";

// ─── Submission Forms by Module Type ─────────────────────────────────────────

function HackathonForm({ onSubmit, isLoading }: { onSubmit: (data: Record<string, unknown>) => void; isLoading: boolean }) {
  const [githubUrl, setGithubUrl] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const result = submissionSchemas.HACKATHON.safeParse({ githubUrl, description });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit({ githubUrl, description, fileUrl: file ? file.name : undefined });
  };

  return (
    <div className="flex flex-col gap-4">
      <Input label="GitHub Repository URL" placeholder="https://github.com/your/repo" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} errorMessage={errors.githubUrl} />
      <FileUpload label="Project Demo / Presentation (optional)" accept=".pdf,.zip,.mp4,.png,.jpg" maxSizeMb={20} onChange={setFile} value={file} />
      <Textarea label="Project Description" placeholder="Describe your project, tech stack, and approach…" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>Submit Project</Button>
    </div>
  );
}

function CodingForm({ onSubmit, isLoading }: { onSubmit: (data: Record<string, unknown>) => void; isLoading: boolean }) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const result = submissionSchemas.CODING.safeParse({ code, language });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit({ code, language });
  };

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        options={[
          { value: "python",     label: "Python"     },
          { value: "javascript", label: "JavaScript" },
          { value: "typescript", label: "TypeScript" },
          { value: "java",       label: "Java"       },
          { value: "cpp",        label: "C++"        },
          { value: "c",          label: "C"          },
          { value: "go",         label: "Go"         },
          { value: "rust",       label: "Rust"       },
        ]}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">Solution</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="# Write your solution here…"
          rows={16}
          className="w-full font-mono text-sm px-4 py-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] focus:border-[var(--accent-500)] resize-y"
        />
        {errors.code && <p className="text-xs text-[var(--status-error)]">{errors.code}</p>}
      </div>
      <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>Submit Solution</Button>
    </div>
  );
}

function FileForm({ type, onSubmit, isLoading }: { type: string; onSubmit: (data: Record<string, unknown>) => void; isLoading: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [fileError, setFileError] = useState("");

  const handleSubmit = () => {
    if (!file) { setFileError("Please upload a file"); return; }
    setFileError("");
    onSubmit({ fileUrl: file.name, description });
  };

  return (
    <div className="flex flex-col gap-4">
      <FileUpload
        label={`Upload ${type === "POSTER" ? "Poster" : type === "UIUX" ? "UI/UX Design" : "Presentation"}`}
        accept=".pdf,.png,.jpg,.pptx,.fig,.sketch,.zip"
        maxSizeMb={25}
        onChange={setFile}
        value={file}
        errorMessage={fileError}
      />
      <Textarea label="Description (optional)" placeholder="Brief description of your work…" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>Submit</Button>
    </div>
  );
}

// ─── Team Panel ───────────────────────────────────────────────────────────────

function TeamPanel({ moduleId }: { moduleId: string }) {
  const { createTeam, joinTeam, isLoading } = useTeams();
  const { toast } = useToast();
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [tab, setTab] = useState<"create" | "join">("create");
  const [createdTeam, setCreatedTeam] = useState<{ name: string; code: string } | null>(null);

  const handleCreate = async () => {
    const result = await createTeam({ moduleId, name: teamName });
    if (result) {
      setCreatedTeam({ name: result.name, code: result.code });
      toast.success("Team created!", `Share code: ${result.code}`);
    } else {
      toast.error("Failed to create team");
    }
  };

  const handleJoin = async () => {
    const result = await joinTeam({ code: joinCode.toUpperCase() });
    if (result) toast.success("Joined team!", result.name);
    else toast.error("Invalid code or team is full");
  };

  if (createdTeam) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-5 flex flex-col gap-3">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Team: {createdTeam.name}</p>
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--accent-50)] border border-[var(--accent-200)]">
          <p className="text-xs text-[var(--text-muted)]">Share join code:</p>
          <code className="text-base font-bold tracking-widest text-[var(--accent-600)]">{createdTeam.code}</code>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-5 flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">Team Registration</h3>
      <div className="flex rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-default)]">
        {(["create", "join"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={["flex-1 py-2 text-sm font-medium transition-colors", tab === t ? "bg-[var(--accent-500)] text-white" : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"].join(" ")}>
            {t === "create" ? "Create Team" : "Join Team"}
          </button>
        ))}
      </div>
      {tab === "create" ? (
        <div className="flex gap-2">
          <Input placeholder="Team name" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="flex-1" />
          <Button onClick={handleCreate} isLoading={isLoading} disabled={!teamName.trim()}>Create</Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input placeholder="ABCDEF" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} className="flex-1 font-mono tracking-widest uppercase" maxLength={6} />
          <Button onClick={handleJoin} isLoading={isLoading} disabled={joinCode.length !== 6}>Join</Button>
        </div>
      )}
    </div>
  );
}

// ─── Leaderboard Sidebar ──────────────────────────────────────────────────────

function LeaderboardSidebar({ moduleId }: { moduleId: string }) {
  const { entries, isLoading, isConnected } = useLeaderboard(moduleId);

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Leaderboard</h3>
        <span className={["w-2 h-2 rounded-full", isConnected ? "bg-[var(--status-success)]" : "bg-[var(--text-disabled)]"].join(" ")} title={isConnected ? "Live" : "Polling"} />
      </div>
      {isLoading ? (
        <div className="p-4"><LeaderboardRowSkeleton count={5} /></div>
      ) : entries.length === 0 ? (
        <p className="text-xs text-[var(--text-muted)] text-center py-8">No results yet</p>
      ) : (
        <ul className="divide-y divide-[var(--border-subtle)] max-h-80 overflow-y-auto">
          {entries.slice(0, 10).map((e) => (
            <li key={e.rank} className="flex items-center gap-3 px-4 py-2.5">
              <span className="w-5 text-xs font-bold text-[var(--text-muted)] shrink-0 text-center">{e.rank}</span>
              <span className="flex-1 text-sm text-[var(--text-primary)] truncate">{e.team?.name ?? e.user.name}</span>
              <span className="text-sm font-semibold text-[var(--accent-500)]">{e.score.toFixed(1)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ModulePage() {
  const params = useParams<{ org: string; eventSlug: string; moduleId: string }>();
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const { module, isLoading, error: moduleError, refetch } = useModule(params.moduleId);
  const { submission, refetch: refetchSubmission } = useMySubmission(params.moduleId);
  const { isRegistered } = useIsRegistered(params.moduleId);
  const { submit, isLoading: isSubmitting } = useSubmit();

  const handleSubmit = async (payload: Record<string, unknown>) => {
    if (!isSignedIn) { toast.info("Sign in required"); return; }
    const result = await submit(params.moduleId, payload);
    if (result) {
      toast.success("Submitted!", "Your submission has been recorded.");
      refetchSubmission();
    } else {
      toast.error("Submission failed", "Please try again.");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader size="lg" /></div>;
  }

  if (moduleError) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-20">
        <FetchError
          title="Failed to load module"
          message={moduleError.message ?? "Could not load this module. Please try again."}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-20">
        <EmptyState title="Module not found" description="This module doesn't exist or has been removed." />
      </div>
    );
  }

  const canSubmit = isRegistered && module.state === "LIVE" && !submission;

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-[var(--text-muted)] mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[var(--accent-500)]">Home</Link>
        <span>/</span>
        <Link href="/events" className="hover:text-[var(--accent-500)]">Events</Link>
        <span>/</span>
        <Link href={`/e/${params.org}/${params.eventSlug}`} className="hover:text-[var(--accent-500)]">{params.eventSlug}</Link>
        <span>/</span>
        <span className="text-[var(--text-secondary)]">{module.title}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <StateBadge state={module.state} />
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
              {module.type}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
              {module.mode}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{module.title}</h1>
          {module.description && <p className="text-sm text-[var(--text-secondary)] max-w-xl">{module.description}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Submission status */}
          {submission && (
            <div className="rounded-[var(--radius-lg)] border p-4 flex items-center gap-4" style={{ borderColor: `color-mix(in srgb, ${getSubmissionUI(submission.status).colorVar} 30%, transparent)`, backgroundColor: `color-mix(in srgb, ${getSubmissionUI(submission.status).colorVar} 5%, transparent)` }}>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: getSubmissionUI(submission.status).colorVar }}>
                  {getSubmissionUI(submission.status).label}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Submitted {new Date(submission.submittedAt).toLocaleString("en-IN")}
                </p>
                {submission.score !== null && (
                  <p className="text-sm font-bold text-[var(--text-primary)] mt-1">Score: {submission.score}/100</p>
                )}
                {submission.feedback && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{submission.feedback}</p>
                )}
              </div>
            </div>
          )}

          {/* Team Panel */}
          {module.mode === "TEAM" && isRegistered && !submission && (
            <TeamPanel moduleId={module.id} />
          )}

          {/* Submission Form */}
          {canSubmit && (
            <Card>
              <Card.Header>
                <Card.Title>Submit Your Work</Card.Title>
                <Card.Description>This is a {module.type.toLowerCase()} submission. Fill out all required fields.</Card.Description>
              </Card.Header>
              <Card.Body>
                {module.type === "HACKATHON" && <HackathonForm onSubmit={handleSubmit} isLoading={isSubmitting} />}
                {module.type === "CODING" && <CodingForm onSubmit={handleSubmit} isLoading={isSubmitting} />}
                {(module.type === "POSTER" || module.type === "UIUX" || module.type === "PRESENTATION") && (
                  <FileForm type={module.type} onSubmit={handleSubmit} isLoading={isSubmitting} />
                )}
                {(module.type === "QUIZ" || module.type === "VOTING" || module.type === "CUSTOM") && (
                  <EmptyState title="Dynamic form" description="This module type uses a specialized interface." />
                )}
              </Card.Body>
            </Card>
          )}

          {/* Not registered */}
          {!isRegistered && module.state === "LIVE" && (
            <EmptyState
              title="Not registered"
              description="You need to register for this module before submitting."
              action={
                <Link href={`/e/${params.org}/${params.eventSlug}`}>
                  <Button variant="primary" size="sm">Go to Event</Button>
                </Link>
              }
            />
          )}

          {/* Not live */}
          {module.state !== "LIVE" && !submission && (
            <EmptyState
              title={module.state === "FINISHED" ? "Module finished" : "Submissions not open"}
              description={module.state === "FINISHED" ? "Check the leaderboard for results." : "Submissions will open when the module goes live."}
            />
          )}

          {/* Rules */}
          {module.rules && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Rules & Guidelines</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{module.rules}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <LeaderboardSidebar moduleId={module.id} />

          {/* Module details */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Details</h3>
            <dl className="flex flex-col gap-1.5 text-sm">
              {module.registrationDeadline && (
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--text-muted)]">Reg. deadline</dt>
                  <dd className="text-[var(--text-primary)]">{new Date(module.registrationDeadline).toLocaleDateString("en-IN")}</dd>
                </div>
              )}
              {module.submissionDeadline && (
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--text-muted)]">Sub. deadline</dt>
                  <dd className="text-[var(--text-primary)]">{new Date(module.submissionDeadline).toLocaleDateString("en-IN")}</dd>
                </div>
              )}
              {module.mode === "TEAM" && (
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--text-muted)]">Max team size</dt>
                  <dd className="text-[var(--text-primary)]">{module.maxTeamSize ?? "—"}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
