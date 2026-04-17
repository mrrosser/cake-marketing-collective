import type { WorkspaceBoard } from '../../lib/platform/types';

interface Props {
  board: WorkspaceBoard;
}

export function BoardPreview({ board }: Props) {
  return (
    <article className="app-card board-preview">
      <div className="board-preview__header">
        <div>
          <p className="app-eyebrow">{board.workspace}</p>
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
            <span>{item.status}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
