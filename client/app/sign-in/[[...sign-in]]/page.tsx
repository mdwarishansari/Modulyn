import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--bg-base)]">
      <SignIn />
    </main>
  );
}
