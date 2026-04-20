import { portalProjects as defaultPortalProjects, portalUser, workspaceBoards } from '../../lib/platform/mockData';
import type { PortalSnapshot } from '../../lib/platform/types';

interface Props {
  snapshot?: PortalSnapshot;
}

export function PortalDashboard({ snapshot }: Props) {
  const projects = snapshot?.projects ?? defaultPortalProjects;
  const viewer = snapshot?.viewer;
  const visibleBoards = (snapshot?.boards ?? workspaceBoards).filter((board) =>
    ['delivery', 'calendar', 'design', 'finance'].includes(board.workspace),
  );
  const sharedLinkCount = projects.reduce((count, project) => count + project.sharedLinks.length, 0);

  return (
    <div className="platform-page">
      <section className="platform-hero platform-hero--portal">
        <div>
          <p className="app-eyebrow">Client Portal</p>
          <h1>One place for status, files, design, and approvals.</h1>
          <p className="platform-hero__copy">
            The portal keeps clients close to the work without dragging them through the full
            internal system. Status, design, assets, meetings, and billing context live in one
            clean, branded view.
          </p>
          <div className="app-tag-row">
            <span className="app-tag">Portal role: {viewer?.role ?? portalUser.role}</span>
            <span className="app-tag">Invite-only access</span>
            <span className="app-tag">Google sign-in</span>
          </div>
          <div className="platform-metric-strip">
            <div className="platform-metric">
              <strong>{projects.length}</strong>
              <span>active engagements</span>
            </div>
            <div className="platform-metric">
              <strong>{visibleBoards.length}</strong>
              <span>shared views</span>
            </div>
            <div className="platform-metric">
              <strong>{sharedLinkCount}</strong>
              <span>linked resources</span>
            </div>
          </div>
        </div>
        <article className="app-card portal-card">
          <p className="app-eyebrow">What clients see</p>
          <h3>Approvals, files, status, design, and meeting guidance.</h3>
          <p>
            Sensitive CRM data stays internal. The portal is intentionally tighter, calmer, and
            easier to review than the team workspace.
          </p>
        </article>
      </section>

      <section className="app-section">
        <div className="section-heading">
          <div>
            <p className="app-eyebrow">Active Engagements</p>
            <h2>Client-facing spaces built for review, not clutter.</h2>
          </div>
        </div>
        <div className="workspace-grid">
          {projects.map((project) => (
            <article className="app-card" key={project.id}>
              <p className="app-eyebrow">{project.clientName}</p>
              <h3>{project.projectName}</h3>
              <p>Milestone: {project.milestone}</p>
              <p>Next review: {project.nextReview}</p>
              <div className="app-tag-row">
                <span className={`status-pill status-pill--${project.status.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                  {project.status}
                </span>
              </div>
              <div className="portal-links">
                {project.sharedLinks.map((link) => (
                  <a className="app-link" href={link.href} key={link.label}>
                    {link.label}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="app-section">
        <div className="section-heading">
          <div>
            <p className="app-eyebrow">Shared Views</p>
            <h2>Clients only see the parts of the system tied to delivery.</h2>
          </div>
        </div>
        <div className="workspace-grid">
          {visibleBoards.map((board) => (
            <article className="app-card" key={board.id}>
              <p className="app-eyebrow">{board.workspace}</p>
              <h3>{board.name}</h3>
              <p>{board.description}</p>
              <ul className="portal-summaries">
                {board.items.slice(0, 2).map((item) => (
                  <li key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{item.status}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
