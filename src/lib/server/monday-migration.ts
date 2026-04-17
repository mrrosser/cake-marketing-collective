import type { PlatformSession } from '../platform/types';
import { emitStructuredLog } from '../platform/logging';
import { getFirebaseAdminServices } from './firebase-admin';
import { recordMigrationRun } from './platform-store';
import type { MondayImportSnapshot } from './providers/monday';

export async function persistMondayImportSnapshot(input: {
  session: PlatformSession;
  snapshot: MondayImportSnapshot;
  correlationId: string;
  stage: 'initial' | 'delta';
}) {
  const { firestore } = getFirebaseAdminServices();
  const now = new Date().toISOString();
  const writes: Array<Promise<unknown>> = [];

  for (const board of input.snapshot.boards) {
    writes.push(
      firestore.collection('boards').doc(`monday-${board.id}`).set(
        {
          id: `monday-${board.id}`,
          organizationId: input.session.organizationId,
          workspace: 'ops',
          name: board.name,
          description: board.description || `Imported from Monday board ${board.id}`,
          defaultView: 'table',
          columns: board.columns.map((column) => ({
            id: column.id,
            label: column.title,
            type: 'text',
          })),
          clientVisible: false,
          clientEmails: [],
          source: 'monday-import',
          mondayBoardId: board.id,
          mondayState: board.state,
          mondayBoardKind: board.boardKind,
          updatedAt: now,
        },
        { merge: true },
      ),
    );

    for (const item of board.items) {
      writes.push(
        firestore.collection('items').doc(`monday-${board.id}-${item.id}`).set(
          {
            id: item.id,
            boardId: `monday-${board.id}`,
            organizationId: input.session.organizationId,
            workspace: 'ops',
            title: item.title,
            status: item.group || 'Imported',
            assignee: 'Migration',
            relation: board.name,
            summary: item.columnValues
              .map((column) => `${column.id}: ${column.text || column.value}`)
              .slice(0, 4)
              .join(' | '),
            metric: `${item.assets.length} files / ${item.updates.length} updates`,
            clientVisible: false,
            clientEmails: [],
            source: 'monday-import',
            mondayBoardId: board.id,
            mondayItemId: item.id,
            mondayUpdatedAt: item.updatedAt,
            mondayCreatedAt: item.createdAt,
            mondayColumnValues: item.columnValues,
            mondayAssets: item.assets,
            mondayUpdates: item.updates,
            updatedAt: now,
          },
          { merge: true },
        ),
      );
    }
  }

  await Promise.all(writes);

  await firestore.collection('integrationConfigs').doc('monday').set(
    {
      id: 'monday',
      organizationId: input.session.organizationId,
      provider: 'monday',
      status: 'migration_only',
      lastImportAt: now,
      lastImportStage: input.stage,
      lastCounts: input.snapshot.counts,
      clientVisible: false,
      updatedAt: now,
    },
    { merge: true },
  );

  await recordMigrationRun({
    organizationId: input.session.organizationId,
    stage: input.stage,
    status: 'completed',
    summary: `Imported ${input.snapshot.counts.boards} boards and ${input.snapshot.counts.items} items from Monday.`,
    correlationId: input.correlationId,
    counts: input.snapshot.counts,
  });

  emitStructuredLog({
    service: 'cake-monday-migration',
    event: 'monday_import_persisted',
    correlationId: input.correlationId,
    stage: input.stage,
    boardCount: input.snapshot.counts.boards,
    itemCount: input.snapshot.counts.items,
  });
}

export async function compareMondayParity(input: {
  session: PlatformSession;
  snapshot: MondayImportSnapshot;
  correlationId: string;
}) {
  const { firestore } = getFirebaseAdminServices();
  const [boardsSnapshot, itemsSnapshot] = await Promise.all([
    firestore.collection('boards').where('organizationId', '==', input.session.organizationId).get(),
    firestore.collection('items').where('organizationId', '==', input.session.organizationId).get(),
  ]);

  const importedBoards = boardsSnapshot.docs
    .map((doc) => doc.data())
    .filter((entry) => entry.source === 'monday-import');
  const importedItems = itemsSnapshot.docs
    .map((doc) => doc.data())
    .filter((entry) => entry.source === 'monday-import');

  const storedCounts = {
    boards: importedBoards.length,
    items: importedItems.length,
    updates: importedItems.reduce(
      (sum, item) =>
        sum + (Array.isArray(item.mondayUpdates) ? item.mondayUpdates.length : 0),
      0,
    ),
    assets: importedItems.reduce(
      (sum, item) =>
        sum + (Array.isArray(item.mondayAssets) ? item.mondayAssets.length : 0),
      0,
    ),
  };

  const mismatches = Object.entries(input.snapshot.counts)
    .filter(([key, value]) => storedCounts[key as keyof typeof storedCounts] !== value)
    .map(
      ([key, value]) =>
        `${key}: stored ${storedCounts[key as keyof typeof storedCounts]}, monday ${value}`,
    );

  await recordMigrationRun({
    organizationId: input.session.organizationId,
    stage: 'parity',
    status: mismatches.length === 0 ? 'completed' : 'failed',
    summary:
      mismatches.length === 0
        ? 'Parity verification passed against the latest Monday snapshot.'
        : 'Parity verification found mismatches that need operator review.',
    correlationId: input.correlationId,
    counts: {
      ...storedCounts,
      mondayBoards: input.snapshot.counts.boards,
      mondayItems: input.snapshot.counts.items,
    },
    mismatches,
  });

  return {
    counts: {
      stored: storedCounts,
      monday: input.snapshot.counts,
    },
    mismatches,
    ok: mismatches.length === 0,
  };
}

export async function finalizeMondayCutover(input: {
  session: PlatformSession;
  correlationId: string;
  parity: {
    ok: boolean;
    mismatches: string[];
    counts: {
      stored: Record<string, number>;
      monday: Record<string, number>;
    };
  };
}) {
  const { firestore } = getFirebaseAdminServices();
  const now = new Date().toISOString();

  if (!input.parity.ok) {
    throw new Error('Cutover blocked because parity mismatches remain unresolved.');
  }

  await firestore.collection('integrationConfigs').doc('monday').set(
    {
      id: 'monday',
      organizationId: input.session.organizationId,
      provider: 'monday',
      status: 'retired',
      retiredAt: now,
      finalParityCounts: input.parity.counts,
      correlationId: input.correlationId,
      clientVisible: false,
      updatedAt: now,
    },
    { merge: true },
  );

  await recordMigrationRun({
    organizationId: input.session.organizationId,
    stage: 'cutover',
    status: 'completed',
    summary: 'Monday marked retired after a successful parity check.',
    correlationId: input.correlationId,
    counts: input.parity.counts.stored,
  });
}
