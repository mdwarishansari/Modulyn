/**
 * server/src/lib/email/templates.ts
 * Clean HTML email templates for transactional messages.
 */

export function resultPublishedEmail(params: {
  userName: string;
  moduleName: string;
  eventName: string;
  score: number | null;
  leaderboardUrl: string;
}): { subject: string; html: string; text: string } {
  const scoreText = params.score !== null ? `Your score: <strong>${params.score.toFixed(1)}%</strong>` : "Results are now available.";

  return {
    subject: `Results Published — ${params.moduleName}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0f0f0f;color:#e5e5e5;border-radius:12px;">
        <h2 style="color:#6d5acd;margin-bottom:8px;">Results are in, ${params.userName}! 🏆</h2>
        <p style="color:#aaa;">The results for <strong style="color:#fff;">${params.moduleName}</strong> from <em>${params.eventName}</em> have been published.</p>
        <p style="font-size:18px;margin:24px 0;">${scoreText}</p>
        <a href="${params.leaderboardUrl}" style="display:inline-block;background:#6d5acd;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Leaderboard →</a>
        <p style="color:#555;font-size:12px;margin-top:32px;">Modulyn — Built for builders.</p>
      </div>
    `,
    text: `Results for ${params.moduleName} are published. ${scoreText.replace(/<[^>]+>/g, "")}. View at: ${params.leaderboardUrl}`,
  };
}

export function moduleGoesLiveEmail(params: {
  userName: string;
  moduleName: string;
  eventName: string;
  moduleUrl: string;
}): { subject: string; html: string; text: string } {
  return {
    subject: `🔴 ${params.moduleName} is LIVE now!`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0f0f0f;color:#e5e5e5;border-radius:12px;">
        <h2 style="color:#ef4444;margin-bottom:8px;">It's GO time, ${params.userName}! 🚀</h2>
        <p style="color:#aaa;"><strong style="color:#fff;">${params.moduleName}</strong> from <em>${params.eventName}</em> has just gone <strong style="color:#ef4444;">LIVE</strong>.</p>
        <p style="color:#aaa;">Head over now to submit your work before the deadline.</p>
        <a href="${params.moduleUrl}" style="display:inline-block;background:#ef4444;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Submit Now →</a>
        <p style="color:#555;font-size:12px;margin-top:32px;">Modulyn — Built for builders.</p>
      </div>
    `,
    text: `${params.moduleName} is LIVE! Submit at: ${params.moduleUrl}`,
  };
}
