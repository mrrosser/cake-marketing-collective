import type { WorkspaceBoard } from '../../lib/platform/types';

interface Props {
  board: WorkspaceBoard;
}

function toTitleCase(value: string): string {
  return value
    .split(/[-_ ]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function toStatusClass(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function BoardPreview({ board }: Props) {
  return (
    <article className="app-card board-preview">
      <div className="board-preview__header">
        <div>
          <p className="app-eyebrow">{toTitleCase(board.workspace)}</p>
          <h3>{board.name}</h3>
        </div>
        <span className="board-preview__pill">{board.defaultView}</span>
      </div>
      <p className="board-preview__description">{board.description}</p>
      <div className="board-preview__rows">
        {board.items.slice(0, 3).map((item) => (
          <div className="board-preview__row" key={item.id}>
            <div>
              <strong>{item.title}</strong>
              {item.summary ? <p>{item.summary}</p> : null}
            </div>
            <span className={`status-pill status-pill--${toStatusClass(item.status)}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
