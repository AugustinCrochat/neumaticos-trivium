/**
 * Respaldo del cron de GitHub Actions que redeploya neumaticos-trivium (ver
 * .github/workflows/deploy.yml y wrangler.jsonc en este mismo directorio
 * para el porqué). Este worker no hace nada más que llamarle a la API de
 * GitHub para disparar el mismo workflow — el build/deploy real sigue
 * corriendo en GitHub Actions, esto solo garantiza que se dispare aunque el
 * scheduler de GitHub falle en silencio.
 */

export interface Env {
  GITHUB_PAT: string;
}

const REPO = "AugustinCrochat/neumaticos-trivium";
const WORKFLOW_FILE = "deploy.yml";

export default {
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(triggerDeploy(env));
  },
} satisfies ExportedHandler<Env>;

async function triggerDeploy(env: Env): Promise<void> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_PAT}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "neumaticos-trivium-cron-redeploy-trigger",
      },
      body: JSON.stringify({ ref: "main" }),
    }
  );

  if (!res.ok) {
    console.error(`[cron-redeploy-trigger] GitHub respondió ${res.status}: ${await res.text()}`);
  }
}
