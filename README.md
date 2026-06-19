# System 1 — App / Tool Build Pipeline

## Install
1. Install Claude Code (needs Node.js 18+): https://docs.claude.com/en/docs/claude-code/overview
2. Copy this folder's contents into your project root (merge the `.claude/` folder).
3. Edit `.claude/settings.json` — set the real format/test commands for your stack.
4. Edit `CLAUDE.md` — confirm the default stack.

## Run
- In the project: `claude`
- Trigger: `New build: <your problem>. Run the build pipeline.`
- For a large multi-file job add: `use a workflow` so Claude orchestrates the sub-agents across stages.

## Flow
intake-scoper -> (you answer 3 questions) -> solution-architect -> (you approve plan)
-> builder -> code-simplifier -> verify-app (loops, max 3) -> shipper -> (you merge PR)
