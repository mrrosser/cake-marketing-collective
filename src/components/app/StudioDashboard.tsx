import { AuthStatusCard } from './AuthStatusCard';
import { BoardPreview } from './BoardPreview';
import { workspaceDefinitions as defaultWorkspaceDefinitions } from '../../lib/platform/workspaces';
import {
  activityFeed as defaultActivityFeed,
  automationBlueprints as defaultAutomationBlueprints,
  migrationChecklist as defaultMigrationChecklist,
  studioUser,
  workspaceBoards as defaultWorkspaceBoards,
} from '../../lib/platform/mockData';
import type { StudioSnapshot } from '../../lib/platform/types';

interface Props {
  snapshot?: StudioSnapshot;
}

export function StudioDashboard({ snapshot }: Props) {
  const viewer = snapshot?.viewer;
  const workspaceDefinitions = snapshot?.workspaceDefinitions ?? defaultWorkspaceDefinitions;
  const boards = snapshot?.boards ?? defaultWorkspaceBoards;
  const activityFeed = snapshot?.activityFeed ?? defaultActivityFeed;
  const automationBlueprints = snapshot?.automationBlueprints ?? defaultAutomationBlueprints;
  const migrationChecklist = snapshot?.migrationChecklist ?? defaultMigrationChecklist;

  return (
    <div className="platform-page">
      <section className="platform-hero platform-hero--studio">
        <div>
          <p className="app-eyebrow">Studio</p>
          <h1>{viewer?.organizationId ? studioUser.organization : studioUser.organization}</h1>
          <p className="platform-hero__copy">
            A single branded operating system for intake, CRM, delivery, design, research, billing,
            and team ops. Monday becomes migration-only. Cake becomes the source of truth.
          </p>
          <div className="app-tag-row">
            <span className="app-tag">Owner: {viewer?.name ?? studioUser.name}</span>
            <span className="app-tag">Role: {viewer?.role ?? studioUser.role}</span>
            <span className="app-tag">Cutover mode: freeze + delta import</span>
          </div>
        </div>
        <AuthStatusCard viewer={viewer ?? null} />
      </section>

      <section className="app-section">
        <div className="section-heading">
          <div>
            <p className="app-eyebrow">Workspace Stack</p>
            <h2>Every launch workspace is mapped and branded.</h2>
          </div>
        </div>
        <div className="workspace-grid">
          {workspaceDefinitions.map((workspace) => (
            <article className="app-card workspace-card" key={workspace.key}>
              <div className="workspace-card__accent" style={{ backgroundColor: workspace.accent }} />
              <p className="app-eyebrow">{workspace.shortLabel}</p>
              <h3>{workspace.label}</h3>
              <p>{workspace.description}</p>
              <div className="app-tag-row">
                {workspace.views.map((view) => (
                  <span className="app-tag" key={view}>
                    {view}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="app-section">
        <div className="section-heading">
          <div>
            <p className="app-eyebrow">Boards</p>
            <h2>The CRM ships with working board primitives instead of placeholder SaaS chrome.</h2>
          </div>
        </div>
        <div className="workspace-grid">
          {boards.map((board) => (
            <BoardPreview board={board} key={board.id} />
          ))}
        </div>
      </section>

      <section className="app-section app-section--split">
        <article className="app-card">
          <p className="app-eyebrow">Automation Layer</p>
          <h3>Required launch automations</h3>
          <div className="stack-list">
            {automationBlueprints.map((automation) => (
              <div className="stack-list__item" key={automation.id}>
                <div>
                  <strong>{automation.name}</strong>
                  <p>{automation.summary}</p>
                </div>
                <span className={`status-pill status-pill--${automation.status.replace(/ /g, '-')}`}>
                  {automation.status}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="app-card">
          <p className="app-eyebrow">Cutover</p>
          <h3>Monday migration checkpoints</h3>
          <div className="stack-list">
            {migrationChecklist.map((checkpoint) => (
              <div className="stack-list__item" key={checkpoint.id}>
                <div>
                  <strong>{checkpoint.label}</strong>
                  <p>{checkpoint.detail}</p>
                </div>
                <span className={`status-pill status-pill--${checkpoint.status}`}>
                  {checkpoint.status}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="app-section">
        <article className="app-card">
          <p className="app-eyebrow">Live Activity</p>
          <h3>Supervised automation, no silent failures.</h3>
          <div className="activity-list">
            {activityFeed.map((entry) => (
              <div className="activity-list__item" key={entry.id}>
                <div>
                  <strong>{entry.action}</strong>
                  <p>{entry.detail}</p>
                </div>
                <span>{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
