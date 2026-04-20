import type {
  ActivityEvent,
  AppShellUser,
  AutomationBlueprint,
  ClientPortalProject,
  MigrationCheckpoint,
  WorkspaceBoard,
} from './types';

export const studioUser: AppShellUser = {
  name: 'Cake Douglas',
  email: 'contact@cakemarketingllc.com',
  role: 'owner',
  organization: 'Cake Marketing Collective',
};

export const portalUser: AppShellUser = {
  name: 'Invited Client',
  email: 'client@example.com',
  role: 'client',
  organization: 'Cake Marketing Collective',
};

export const workspaceBoards: WorkspaceBoard[] = [
  {
    id: 'sales-pipeline',
    workspace: 'sales',
    name: 'Lead Pipeline',
    description: 'Native intake records, discovery routing, and strategy-session conversion state.',
    defaultView: 'kanban',
    columns: [
      { id: 'status', label: 'Stage', type: 'status' },
      { id: 'assignee', label: 'Owner', type: 'person' },
      { id: 'dueDate', label: 'Next action', type: 'date' },
      { id: 'relation', label: 'Client', type: 'relation' },
    ],
    items: [
      {
        id: 'lead-001',
        title: 'The Culturalyst discovery intake',
        status: 'Qualified',
        assignee: 'Cake',
        dueDate: '2026-04-19',
        relation: 'The Culturalyst',
        summary: 'Discovery call approved. Creative planning and research follow-up are in motion.',
        tags: ['brand', 'design-trigger'],
      },
      {
        id: 'lead-002',
        title: 'LinkFest experiential scope',
        status: 'Strategy session',
        assignee: 'Ops',
        dueDate: '2026-04-20',
        relation: 'LinkFest',
        summary: 'Manual deposit required before scheduling.',
        tags: ['experiential', 'manual-billing'],
      },
    ],
  },
  {
    id: 'delivery-milestones',
    workspace: 'delivery',
    name: 'Client Delivery Tracker',
    description: 'Milestones, owner handoffs, and client-visible checkpoints.',
    defaultView: 'timeline',
    columns: [
      { id: 'status', label: 'Status', type: 'status' },
      { id: 'assignee', label: 'Lead', type: 'person' },
      { id: 'timeline', label: 'Timeline', type: 'date' },
      { id: 'relation', label: 'Client', type: 'relation' },
    ],
    items: [
      {
        id: 'delivery-001',
        title: 'Founder-led site refresh',
        status: 'In build',
        assignee: 'Creative',
        relation: 'Cake Marketing',
        timeline: { start: '2026-04-17', end: '2026-05-03' },
        summary: 'Unified public/editorial and CRM brand rollout.',
      },
      {
        id: 'delivery-002',
        title: 'Portal launch assets',
        status: 'In review',
        assignee: 'Client success',
        relation: 'The Culturalyst',
        timeline: { start: '2026-04-24', end: '2026-05-08' },
        summary: 'Client portal branding pack and welcome flow.',
      },
    ],
  },
  {
    id: 'calendar-editorial',
    workspace: 'calendar',
    name: 'Editorial Calendar',
    description: 'Campaign cadence, client approvals, and platform-specific output.',
    defaultView: 'calendar',
    columns: [
      { id: 'status', label: 'Status', type: 'status' },
      { id: 'assignee', label: 'Lead', type: 'person' },
      { id: 'dueDate', label: 'Publish date', type: 'date' },
      { id: 'relation', label: 'Client', type: 'relation' },
    ],
    items: [
      {
        id: 'calendar-001',
        title: 'Knowledge article: Culture-backed strategy',
        status: 'In progress',
        assignee: 'Content',
        dueDate: '2026-04-25',
        relation: 'Cake Marketing',
      },
      {
        id: 'calendar-002',
        title: 'Reel sequence for spring campaign',
        status: 'Awaiting footage',
        assignee: 'Social',
        dueDate: '2026-04-27',
        relation: 'The Culturalyst',
      },
    ],
  },
  {
    id: 'design-stitch',
    workspace: 'design',
    name: 'Stitch Project Queue',
    description: 'Creative project scaffolds spun up from intake and delivery workflows.',
    defaultView: 'table',
    columns: [
      { id: 'status', label: 'Status', type: 'status' },
      { id: 'assignee', label: 'Lead', type: 'person' },
      { id: 'relation', label: 'Client', type: 'relation' },
      { id: 'metric', label: 'Template', type: 'text' },
    ],
    items: [
      {
        id: 'design-001',
        title: 'Culturalyst brand system sprint',
        status: 'Creative kickoff',
        assignee: 'Design',
        relation: 'The Culturalyst',
        metric: 'Founder-led editorial system',
      },
      {
        id: 'design-002',
        title: 'LinkFest visual concept deck',
        status: 'Queued',
        assignee: 'Design',
        relation: 'LinkFest',
        metric: 'Experiential launch pack',
      },
    ],
  },
  {
    id: 'research-loop',
    workspace: 'research',
    name: 'Research and Enrichment Loop',
    description: 'Agent-assisted lead and market research, plus reporting snapshots.',
    defaultView: 'table',
    columns: [
      { id: 'status', label: 'Status', type: 'status' },
      { id: 'assignee', label: 'Lead', type: 'person' },
      { id: 'relation', label: 'Client', type: 'relation' },
      { id: 'metric', label: 'Signal', type: 'number' },
    ],
    items: [
      {
        id: 'research-001',
        title: 'Lead enrichment pass for discovery queue',
        status: 'Active',
        assignee: 'Paperclip',
        relation: 'Pipeline',
        metric: '12 leads enriched',
      },
      {
        id: 'research-002',
        title: 'Competitive language scrape',
        status: 'Needs review',
        assignee: 'Research',
        relation: 'Cake Marketing',
        metric: '6 sources flagged',
      },
    ],
  },
  {
    id: 'finance-billing',
    workspace: 'finance',
    name: 'Contracts and Finance',
    description: 'Manual invoice tracking, contracts, deposits, and Stripe/Twilio readiness.',
    defaultView: 'table',
    columns: [
      { id: 'status', label: 'Status', type: 'status' },
      { id: 'assignee', label: 'Owner', type: 'person' },
      { id: 'relation', label: 'Client', type: 'relation' },
      { id: 'metric', label: 'Value', type: 'text' },
    ],
    items: [
      {
        id: 'finance-001',
        title: 'Strategy session deposit',
        status: 'Awaiting payment',
        assignee: 'Ops',
        relation: 'LinkFest',
        metric: '$50 deposit',
      },
      {
        id: 'finance-002',
        title: 'Master service agreement',
        status: 'Awaiting signature',
        assignee: 'Ops',
        relation: 'The Culturalyst',
        metric: 'Revision 2',
      },
    ],
  },
  {
    id: 'ops-automation',
    workspace: 'ops',
    name: 'Team Ops and Automations',
    description: 'Internal requests, approvals, automation health, and workload visibility.',
    defaultView: 'kanban',
    columns: [
      { id: 'status', label: 'Status', type: 'status' },
      { id: 'assignee', label: 'Owner', type: 'person' },
      { id: 'dueDate', label: 'Due', type: 'date' },
      { id: 'metric', label: 'Lane', type: 'text' },
    ],
    items: [
      {
        id: 'ops-001',
        title: 'Monday migration rehearsal',
        status: 'In progress',
        assignee: 'Ops',
        dueDate: '2026-04-22',
        metric: 'Migration',
      },
      {
        id: 'ops-002',
        title: 'Google allowlist review',
        status: 'Queued',
        assignee: 'Engineering',
        dueDate: '2026-04-24',
        metric: 'Auth',
      },
    ],
  },
];

export const portalProjects: ClientPortalProject[] = [
  {
    id: 'portal-001',
    clientName: 'The Culturalyst',
    projectName: 'Brand System and Client Portal',
    status: 'In progress',
    milestone: 'Approve homepage direction',
    nextReview: '2026-04-24',
    sharedLinks: [
      { label: 'Shared Stitch workspace', href: '/portal' },
      { label: 'Creative assets', href: '/portal' },
    ],
  },
  {
    id: 'portal-002',
    clientName: 'LinkFest',
    projectName: 'Experiential relaunch planning',
    status: 'Scheduling',
    milestone: 'Deposit and schedule',
    nextReview: '2026-04-20',
    sharedLinks: [
      { label: 'Project status', href: '/portal' },
      { label: 'Upload references', href: '/portal' },
    ],
  },
];

export const activityFeed: ActivityEvent[] = [
  {
    id: 'activity-001',
    actor: 'Paperclip',
    action: 'Lead enrichment completed',
    detail: 'Enriched 12 discovery leads with public brand and social signals.',
    timestamp: '2026-04-17T16:40:00Z',
  },
  {
    id: 'activity-002',
    actor: 'System',
    action: 'Creative workspace prepared',
    detail: 'A new design planning space was opened from intake responses.',
    timestamp: '2026-04-17T16:22:00Z',
  },
  {
    id: 'activity-003',
    actor: 'Ops',
    action: 'Manual invoice requested',
    detail: 'Strategy-session lead moved into manual deposit review.',
    timestamp: '2026-04-17T15:58:00Z',
  },
];

export const automationBlueprints: AutomationBlueprint[] = [
  {
    id: 'automation-001',
    name: 'Intake triage and routing',
    summary: 'Validate form branch, classify path, create CRM records, and fire follow-up tasks.',
    status: 'active',
    category: 'intake',
  },
  {
    id: 'automation-002',
    name: 'Research enrichment loop',
    summary: 'Run agent-assisted research on qualified leads and active accounts.',
    status: 'active',
    category: 'research',
  },
  {
    id: 'automation-003',
    name: 'Stitch workspace scaffolding',
    summary: 'Create project-ready design spaces when creative need is detected.',
    status: 'manual-review',
    category: 'design',
  },
  {
    id: 'automation-004',
    name: 'Billing readiness',
    summary: 'Track manual invoice states until Stripe is connected.',
    status: 'planned',
    category: 'billing',
  },
  {
    id: 'automation-005',
    name: 'Monday parity validation',
    summary: 'Compare imported records, attachments, and activity before cutover.',
    status: 'active',
    category: 'migration',
  },
];

export const migrationChecklist: MigrationCheckpoint[] = [
  {
    id: 'migration-001',
    label: 'Initial board import',
    detail: 'Core boards, statuses, assignees, and current items imported into Firestore mirror.',
    status: 'done',
  },
  {
    id: 'migration-002',
    label: 'Attachment parity',
    detail: 'Validate file counts and shared client assets before final freeze.',
    status: 'in_progress',
  },
  {
    id: 'migration-003',
    label: 'Freeze and delta sync',
    detail: 'Short Monday freeze window, final delta import, and operator verification.',
    status: 'queued',
  },
];
