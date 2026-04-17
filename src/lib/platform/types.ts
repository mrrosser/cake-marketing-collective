export type PlatformRole = 'owner' | 'admin' | 'team_member' | 'client';

export type WorkspaceKey =
  | 'sales'
  | 'delivery'
  | 'calendar'
  | 'design'
  | 'research'
  | 'finance'
  | 'ops';

export type BoardViewType = 'table' | 'kanban' | 'calendar' | 'timeline';

export type ColumnType = 'status' | 'text' | 'person' | 'date' | 'relation' | 'number' | 'tag';

export interface WorkspaceDefinition {
  key: WorkspaceKey;
  label: string;
  shortLabel: string;
  description: string;
  accent: string;
  views: BoardViewType[];
  portalVisible: boolean;
}

export interface BoardColumn {
  id: string;
  label: string;
  type: ColumnType;
}

export interface TimelineRange {
  start: string;
  end: string;
}

export interface BoardRecord {
  id: string;
  title: string;
  status: string;
  assignee: string;
  dueDate?: string;
  relation?: string;
  metric?: string;
  summary?: string;
  tags?: string[];
  timeline?: TimelineRange;
}

export interface WorkspaceBoard {
  id: string;
  workspace: WorkspaceKey;
  name: string;
  description: string;
  defaultView: BoardViewType;
  columns: BoardColumn[];
  items: BoardRecord[];
}

export interface AppShellUser {
  name: string;
  email: string;
  role: PlatformRole;
  organization: string;
}

export interface ClientPortalProject {
  id: string;
  clientName: string;
  projectName: string;
  status: string;
  milestone: string;
  nextReview: string;
  sharedLinks: { label: string; href: string }[];
}

export interface ActivityEvent {
  id: string;
  actor: string;
  action: string;
  detail: string;
  timestamp: string;
}

export interface AutomationBlueprint {
  id: string;
  name: string;
  summary: string;
  status: 'active' | 'manual-review' | 'planned';
  category: 'intake' | 'research' | 'design' | 'billing' | 'migration';
}

export interface MigrationCheckpoint {
  id: string;
  label: string;
  detail: string;
  status: 'done' | 'in_progress' | 'queued';
}

export interface PlatformUserProfile {
  uid: string;
  email: string;
  name: string;
  role: PlatformRole;
  organizationIds: string[];
}

export interface PlatformSession {
  uid: string;
  email: string;
  name: string;
  role: PlatformRole;
  organizationId: string;
  organizationIds: string[];
}

export interface StudioSnapshot {
  viewer: PlatformSession;
  workspaceDefinitions: WorkspaceDefinition[];
  boards: WorkspaceBoard[];
  activityFeed: ActivityEvent[];
  automationBlueprints: AutomationBlueprint[];
  migrationChecklist: MigrationCheckpoint[];
}

export interface PortalSnapshot {
  viewer: PlatformSession;
  projects: ClientPortalProject[];
  boards: WorkspaceBoard[];
}

export interface ProviderJobRecord {
  id: string;
  organizationId: string;
  provider: 'stitch' | 'stripe' | 'twilio';
  status: 'queued' | 'running' | 'completed' | 'manual_review' | 'failed';
  type: string;
  correlationId: string;
  createdAt: string;
  updatedAt: string;
  summary: string;
  result?: Record<string, unknown>;
}

export interface MigrationRunRecord {
  id: string;
  organizationId: string;
  stage: 'initial' | 'delta' | 'parity' | 'cutover';
  status: 'queued' | 'running' | 'completed' | 'failed';
  correlationId: string;
  createdAt: string;
  updatedAt: string;
  summary: string;
  counts?: Record<string, number>;
  mismatches?: string[];
}
