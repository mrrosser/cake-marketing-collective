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

  return (
    <div className="platform-page">
      <section className="platform-hero platform-hero--portal">
        <div>
          <p className="app-eyebrow">Client Portal</p>
          <h1>One place for status, files, design, and next steps.</h1>
          <p className="platform-hero__copy">
            Clients do not get the full CRM. They get the visibility they need: project status,
            design spaces, approvals, files, and billing context in one brand-matched surface.
          </p>
          <div className="app-tag-row">
            <span className="app-tag">Portal role: {viewer?.role ?? portalUser.role}</span>
            <span className="app-tag">Invite-only access</span>
            <span className="app-tag">Google sign-in</span>
          </div>
        </div>
        <article className="app-card portal-card">
          <p className="app-eyebrow">What clients see</p>
          <h3>Approvals, files, status, design, and booking guidance.</h3>
          <p>
            Sensitive CRM data stays internal. The portal is intentionally smaller, cleaner, and
            client-safe.
          </p>
        </article>
      </section>

      <section className="app-section">
        <div className="section-heading">
          <div>
            <p className="app-eyebrow">Active Projects</p>
            <h2>Portal-ready client spaces</h2>
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
                <span className="app-tag">{project.status}</span>
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
            <p className="app-eyebrow">Visible Workspaces</p>
            <h2>Clients only see the slices relevant to delivery.</h2>
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
