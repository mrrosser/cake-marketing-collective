import {
  activityFeed,
  automationBlueprints,
  migrationChecklist,
  portalProjects,
  workspaceBoards,
} from '../platform/mockData';
import { createCorrelationId, emitStructuredLog } from '../platform/logging';
import type {
  ActivityEvent,
  AutomationBlueprint,
  ClientPortalProject,
  MigrationCheckpoint,
  MigrationRunRecord,
  PlatformSession,
  PortalSnapshot,
  ProviderJobRecord,
  StudioSnapshot,
  WorkspaceBoard,
} from '../platform/types';
import { workspaceDefinitions } from '../platform/workspaces';
import type { IntakeSubmission } from '../intake/forms';
import type { IntakeSubmissionResult } from '../intake/submission';
import { getFirebaseAdminServices } from './firebase-admin';
import { getPlatformRuntimeConfig } from './env';
import { canAccessStudio } from './platform-auth';

export async function ensurePlatformSeed(session?: PlatformSession): Promise<void> {
  const runtime = getPlatformRuntimeConfig();
  const { firestore } = getFirebaseAdminServices();
  const organizationId = session?.organizationId ?? runtime.organizationId;
  const organizationName = runtime.organizationName;

  await firestore.collection('organizations').doc(organizationId).set(
    {
      organizationId,
      name: organizationName,
      clientVisible: false,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );

  const batch = firestore.batch();

  for (const workspace of workspaceDefinitions) {
    const ref = firestore.collection('workspaces').doc(`${organizationId}-${workspace.key}`);
    batch.set(
      ref,
      {
        ...workspace,
        id: `${organizationId}-${workspace.key}`,
        organizationId,
        clientVisible: false,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  }

  for (const board of workspaceBoards) {
    const ref = firestore.collection('boards').doc(board.id);
    batch.set(
      ref,
      {
        id: board.id,
        organizationId,
        workspace: board.workspace,
        name: board.name,
        description: board.description,
        defaultView: board.defaultView,
        columns: board.columns,
        clientVisible: ['delivery', 'calendar', 'design', 'finance'].includes(board.workspace),
        clientEmails: [],
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    for (const item of board.items) {
      const itemRef = firestore.collection('items').doc(`${board.id}-${item.id}`);
      batch.set(
        itemRef,
        {
          ...item,
          boardId: board.id,
          organizationId,
          workspace: board.workspace,
          clientVisible: ['delivery', 'calendar', 'design', 'finance'].includes(board.workspace),
          clientEmails: [],
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
    }
  }

  for (const automation of automationBlueprints) {
    const ref = firestore.collection('automations').doc(automation.id);
    batch.set(
      ref,
      {
        ...automation,
        organizationId,
        clientVisible: false,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  }

  for (const activity of activityFeed) {
    const ref = firestore.collection('activityLogs').doc(activity.id);
    batch.set(
      ref,
      {
        ...activity,
        organizationId,
        clientVisible: false,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  }

  for (const project of portalProjects) {
    const ref = firestore.collection('clients').doc(project.id);
    batch.set(
      ref,
      {
        ...project,
        organizationId,
        clientVisible: true,
        clientEmails: [],
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  }

  for (const checkpoint of migrationChecklist) {
    const ref = firestore.collection('migrationRuns').doc(checkpoint.id);
    batch.set(
      ref,
      {
        id: checkpoint.id,
        organizationId,
        stage: mapCheckpointStage(checkpoint.id),
        status: mapCheckpointStatus(checkpoint.status),
        correlationId: checkpoint.id,
        summary: checkpoint.detail,
        label: checkpoint.label,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  }

  await batch.commit();
}

export async function getStudioSnapshot(session: PlatformSession): Promise<StudioSnapshot> {
  await ensurePlatformSeed(session);
  const { firestore } = getFirebaseAdminServices();
  const organizationId = session.organizationId;

  const [boardsSnapshot, itemsSnapshot, activitySnapshot, automationSnapshot, migrationSnapshot] =
    await Promise.all([
      firestore.collection('boards').where('organizationId', '==', organizationId).get(),
      firestore.collection('items').where('organizationId', '==', organizationId).get(),
      firestore.collection('activityLogs').where('organizationId', '==', organizationId).get(),
      firestore.collection('automations').where('organizationId', '==', organizationId).get(),
      firestore.collection('migrationRuns').where('organizationId', '==', organizationId).get(),
    ]);

  const boards = hydrateBoards(boardsSnapshot.docs.map((doc) => doc.data()), itemsSnapshot.docs.map((doc) => doc.data()));
  const activity = activitySnapshot.docs
    .map((doc) => doc.data())
    .sort((left, right) => String(right.timestamp).localeCompare(String(left.timestamp)))
    .slice(0, 8)
    .map(mapActivity);
  const automations = automationSnapshot.docs
    .map((doc) => doc.data())
    .map(mapAutomation);
  const checkpoints = migrationSnapshot.docs
    .map((doc) => doc.data())
    .sort((left, right) => String(left.createdAt).localeCompare(String(right.createdAt)))
    .map(mapCheckpoint);

  return {
    viewer: session,
    workspaceDefinitions,
    boards,
    activityFeed: activity,
    automationBlueprints: automations,
    migrationChecklist: checkpoints,
  };
}

export async function getPortalSnapshot(session: PlatformSession): Promise<PortalSnapshot> {
  await ensurePlatformSeed(session);
  const { firestore } = getFirebaseAdminServices();
  const organizationId = session.organizationId;

  const [boardSnapshot, itemSnapshot, clientSnapshot] = await Promise.all([
    firestore.collection('boards').where('organizationId', '==', organizationId).get(),
    firestore.collection('items').where('organizationId', '==', organizationId).get(),
    firestore.collection('clients').where('organizationId', '==', organizationId).get(),
  ]);

  const rawBoards = boardSnapshot.docs.map((doc) => doc.data());
  const rawItems = itemSnapshot.docs.map((doc) => doc.data());
  const visibleBoardIds = rawBoards
    .filter((board) => canViewClientDocument(board, session))
    .map((board) => String(board.id));
  const portalBoards = hydrateBoards(
    rawBoards.filter((board) => visibleBoardIds.includes(String(board.id))),
    rawItems.filter((item) => visibleBoardIds.includes(String(item.boardId))),
  ).filter((board) => ['delivery', 'calendar', 'design', 'finance'].includes(board.workspace));

  const projects = clientSnapshot.docs
    .map((doc) => doc.data())
    .filter((project) => canViewClientDocument(project, session))
    .map(mapPortalProject);

  return {
    viewer: session,
    boards: portalBoards,
    projects,
  };
}

export async function persistIntakeSubmission(
  submission: IntakeSubmission,
  result: IntakeSubmissionResult,
): Promise<'firestore'> {
  const runtime = getPlatformRuntimeConfig();
  const { firestore } = getFirebaseAdminServices();
  const organizationId = runtime.organizationId;
  const now = new Date().toISOString();
  const clientId = slugify(`${submission.basicInfo.businessName}-${submission.basicInfo.emailAddress}`);
  const leadBoardId = 'sales-pipeline';
  const leadItemId = `${leadBoardId}-${result.correlationId}`;
  const followupTaskId = `task-${result.correlationId}`;

  await ensurePlatformSeed();

  const batch = firestore.batch();

  batch.set(
    firestore.collection('intakes').doc(result.correlationId),
    {
      organizationId,
      correlationId: result.correlationId,
      service: submission.service,
      branchKey: submission.branchKey,
      routing: result.routing,
      designSignal: result.designSignal,
      basicInfo: submission.basicInfo,
      answers: submission.answers,
      finalNote: submission.finalNote,
      clientVisible: false,
      createdAt: now,
      updatedAt: now,
    },
    { merge: true },
  );

  batch.set(
    firestore.collection('clients').doc(clientId),
    {
      id: clientId,
      organizationId,
      clientName: submission.basicInfo.businessName,
      projectName: `${submission.service} engagement`,
      status: result.routing.path === 'discovery' ? 'Discovery pending' : 'Strategy review',
      milestone: result.routing.nextStepHeading,
      nextReview: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().slice(0, 10),
      sharedLinks: [
        { label: 'Client portal', href: '/portal' },
        { label: 'Book a Call', href: result.routing.path === 'discovery' ? '/contact' : '/contact' },
      ],
      clientVisible: false,
      clientEmails: [submission.basicInfo.emailAddress.toLowerCase()],
      updatedAt: now,
    },
    { merge: true },
  );

  batch.set(
    firestore.collection('items').doc(leadItemId),
    {
      id: result.correlationId,
      boardId: leadBoardId,
      organizationId,
      workspace: 'sales',
      title: `${submission.basicInfo.businessName} ${submission.service}`,
      status: result.routing.path === 'discovery' ? 'Discovery call' : 'Strategy session',
      assignee: 'Ops',
      relation: submission.basicInfo.businessName,
      summary: submission.finalNote || result.routing.nextStepBody,
      tags: [submission.branchKey, result.routing.path],
      clientVisible: false,
      clientEmails: [],
      updatedAt: now,
    },
    { merge: true },
  );

  batch.set(
    firestore.collection('tasks').doc(followupTaskId),
    {
      id: followupTaskId,
      organizationId,
      clientVisible: false,
      title:
        result.routing.path === 'discovery'
          ? `Send discovery booking handoff to ${submission.basicInfo.fullName}`
          : `Send strategy billing instructions to ${submission.basicInfo.fullName}`,
      status: 'queued',
      assignee: 'Ops',
      relation: submission.basicInfo.businessName,
      correlationId: result.correlationId,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 10),
      updatedAt: now,
    },
    { merge: true },
  );

  if (result.routing.path === 'strategy') {
    batch.set(
      firestore.collection('invoices').doc(`invoice-${result.correlationId}`),
      {
        id: `invoice-${result.correlationId}`,
        organizationId,
        clientVisible: false,
        relation: submission.basicInfo.businessName,
        status: 'manual_review',
        amount: 50,
        summary: 'Manual strategy-session deposit placeholder',
        correlationId: result.correlationId,
        updatedAt: now,
      },
      { merge: true },
    );
  }

  if (result.designSignal.shouldCreateStitchProject) {
    batch.set(
      firestore.collection('stitchProjects').doc(`stitch-${result.correlationId}`),
      {
        id: `stitch-${result.correlationId}`,
        organizationId,
        clientVisible: false,
        relation: submission.basicInfo.businessName,
        status: 'draft',
        summary: `Draft Stitch workspace for ${submission.service}`,
        correlationId: result.correlationId,
        updatedAt: now,
      },
      { merge: true },
    );
  }

  batch.set(
    firestore.collection('activityLogs').doc(`intake-${result.correlationId}`),
    {
      id: `intake-${result.correlationId}`,
      organizationId,
      actor: 'System',
      action: 'Intake persisted',
      detail: `${submission.service} intake stored and routed to ${result.routing.path}.`,
      timestamp: now,
      clientVisible: false,
      updatedAt: now,
    },
    { merge: true },
  );

  await batch.commit();

  emitStructuredLog({
    service: 'cake-intake-store',
    event: 'intake_persisted',
    correlationId: result.correlationId,
    organizationId,
    clientId,
    route: result.routing.path,
  });

  return 'firestore';
}

export async function recordProviderJob(input: {
  organizationId: string;
  provider: ProviderJobRecord['provider'];
  type: string;
  status: ProviderJobRecord['status'];
  summary: string;
  correlationId: string;
  dedupeKey?: string;
  result?: Record<string, unknown>;
}): Promise<ProviderJobRecord> {
  const { firestore } = getFirebaseAdminServices();
  const now = new Date().toISOString();
  const id = input.dedupeKey ?? createCorrelationId(`${input.provider}-job`);
  const record: ProviderJobRecord = {
    id,
    organizationId: input.organizationId,
    provider: input.provider,
    status: input.status,
    type: input.type,
    summary: input.summary,
    correlationId: input.correlationId,
    createdAt: now,
    updatedAt: now,
    result: input.result,
  };

  await firestore.collection('providerJobs').doc(id).set(record, { merge: true });

  emitStructuredLog({
    service: `cake-${input.provider}-job`,
    event: 'provider_job_recorded',
    correlationId: input.correlationId,
    providerJobId: id,
    status: input.status,
    type: input.type,
  });

  return record;
}

export async function recordMigrationRun(input: {
  organizationId: string;
  stage: MigrationRunRecord['stage'];
  status: MigrationRunRecord['status'];
  summary: string;
  correlationId: string;
  counts?: Record<string, number>;
  mismatches?: string[];
}): Promise<MigrationRunRecord> {
  const { firestore } = getFirebaseAdminServices();
  const now = new Date().toISOString();
  const id = createCorrelationId(`migration-${input.stage}`);
  const record: MigrationRunRecord = {
    id,
    organizationId: input.organizationId,
    stage: input.stage,
    status: input.status,
    summary: input.summary,
    correlationId: input.correlationId,
    counts: input.counts,
    mismatches: input.mismatches,
    createdAt: now,
    updatedAt: now,
  };

  await firestore.collection('migrationRuns').doc(id).set(record, { merge: true });

  emitStructuredLog({
    service: 'cake-migration',
    event: 'migration_run_recorded',
    correlationId: input.correlationId,
    stage: input.stage,
    status: input.status,
  });

  return record;
}

export async function getMigrationSummary(organizationId: string) {
  const { firestore } = getFirebaseAdminServices();
  const snapshot = await firestore
    .collection('migrationRuns')
    .where('organizationId', '==', organizationId)
    .get();

  const runs = snapshot.docs
    .map((doc) => doc.data())
    .sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)))
    .map((entry) => ({
      id: String(entry.id),
      stage: String(entry.stage),
      status: String(entry.status),
      summary: String(entry.summary),
      counts: isRecord(entry.counts) ? entry.counts : {},
      mismatches: Array.isArray(entry.mismatches)
        ? entry.mismatches.map((value: unknown) => String(value))
        : [],
      updatedAt: String(entry.updatedAt ?? entry.createdAt ?? ''),
    }));

  return {
    runs,
    latest: runs[0] ?? null,
  };
}

function hydrateBoards(
  rawBoards: Array<Record<string, unknown>>,
  rawItems: Array<Record<string, unknown>>,
): WorkspaceBoard[] {
  return rawBoards
    .map((board) => {
      const boardId = String(board.id);
      const items = rawItems
        .filter((item) => String(item.boardId) === boardId)
        .sort((left, right) => String(left.id).localeCompare(String(right.id)))
        .map((item) => ({
          id: String(item.id),
          title: String(item.title),
          status: String(item.status),
          assignee: String(item.assignee ?? ''),
          dueDate: item.dueDate ? String(item.dueDate) : undefined,
          relation: item.relation ? String(item.relation) : undefined,
          metric: item.metric ? String(item.metric) : undefined,
          summary: item.summary ? String(item.summary) : undefined,
          tags: Array.isArray(item.tags) ? item.tags.map((value: unknown) => String(value)) : undefined,
          timeline: isRecord(item.timeline)
            ? {
                start: String(item.timeline.start ?? ''),
                end: String(item.timeline.end ?? ''),
              }
            : undefined,
        }));

      return {
        id: boardId,
        workspace: board.workspace as WorkspaceBoard['workspace'],
        name: String(board.name),
        description: String(board.description),
        defaultView: board.defaultView as WorkspaceBoard['defaultView'],
        columns: Array.isArray(board.columns)
          ? board.columns.map((column: unknown) => ({
              id: String((column as Record<string, unknown>).id),
              label: String((column as Record<string, unknown>).label),
              type: (column as Record<string, unknown>).type as WorkspaceBoard['columns'][number]['type'],
            }))
          : [],
        items,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
}

function mapActivity(data: Record<string, unknown>): ActivityEvent {
  return {
    id: String(data.id),
    actor: String(data.actor),
    action: String(data.action),
    detail: String(data.detail),
    timestamp: String(data.timestamp),
  };
}

function mapAutomation(data: Record<string, unknown>): AutomationBlueprint {
  return {
    id: String(data.id),
    name: String(data.name),
    summary: String(data.summary),
    status: data.status as AutomationBlueprint['status'],
    category: data.category as AutomationBlueprint['category'],
  };
}

function mapCheckpoint(data: Record<string, unknown>): MigrationCheckpoint {
  return {
    id: String(data.id),
    label: String(data.label ?? data.stage),
    detail: String(data.summary ?? ''),
    status:
      data.status === 'completed'
        ? 'done'
        : data.status === 'running'
          ? 'in_progress'
          : 'queued',
  };
}

function mapPortalProject(data: Record<string, unknown>): ClientPortalProject {
  return {
    id: String(data.id),
    clientName: String(data.clientName),
    projectName: String(data.projectName),
    status: String(data.status),
    milestone: String(data.milestone),
    nextReview: String(data.nextReview),
    sharedLinks: Array.isArray(data.sharedLinks)
      ? data.sharedLinks.map((entry: unknown) => ({
          label: String((entry as Record<string, unknown>).label),
          href: String((entry as Record<string, unknown>).href),
        }))
      : [],
  };
}

function canViewClientDocument(data: Record<string, unknown>, session: PlatformSession): boolean {
  if (canAccessStudio(session.role)) {
    return true;
  }

  const clientEmails = Array.isArray(data.clientEmails)
    ? data.clientEmails.map((value: unknown) => String(value).toLowerCase())
    : [];

  return Boolean(data.clientVisible) && clientEmails.includes(session.email.toLowerCase());
}

function mapCheckpointStage(id: string): MigrationRunRecord['stage'] {
  if (id.includes('001')) {
    return 'initial';
  }

  if (id.includes('002')) {
    return 'parity';
  }

  return 'delta';
}

function mapCheckpointStatus(
  status: MigrationCheckpoint['status'],
): MigrationRunRecord['status'] {
  if (status === 'done') {
    return 'completed';
  }

  if (status === 'in_progress') {
    return 'running';
  }

  return 'queued';
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

function isRecord(value: unknown): value is Record<string, number> {
  return typeof value === 'object' && value !== null;
}
