# App / Tool Build Pipeline

## Default stack
- Web UI: React + Vite + Tailwind  |  API/services: Python + FastAPI
- Override only with a stated reason in the plan.

## Operating rules (read once, apply always)
- Flow: intake-scoper -> solution-architect (human approves plan) -> builder ->
  code-simplifier -> verify-app -> shipper (human reviews PR).
- Two human checkpoints: approve the plan, and review/merge the PR.
- Nothing ships until verify-app returns PASS.

## Cost & loop discipline
- Keep this file lean. Delegate only chunky, well-scoped jobs — never trivial steps.
- Verify->fix loops are capped at 3 attempts, then stop and report.
- Read-only agents stay read-only (do not grant write tools).

## Mistakes log (append a line each time you correct the agents)
- (none yet)
