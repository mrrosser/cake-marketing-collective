import type { WorkspaceDefinition, WorkspaceKey } from './types';

export const workspaceDefinitions: WorkspaceDefinition[] = [
  {
    key: 'sales',
    label: 'Sales CRM',
    shortLabel: 'Sales',
    description: 'Intake routing, lead qualification, pipeline movement, and strategy session follow-up.',
    accent: '#ff7657',
    views: ['table', 'kanban', 'calendar'],
    portalVisible: false,
  },
  {
    key: 'delivery',
    label: 'Client Delivery',
    shortLabel: 'Delivery',
    description: 'Scope tracking, milestones, account management, and cross-functional execution.',
    accent: '#f3cc54',
    views: ['table', 'kanban', 'timeline'],
    portalVisible: true,
  },
  {
    key: 'calendar',
    label: 'Content Calendar',
    shortLabel: 'Calendar',
    description: 'Editorial planning, social scheduling, and approval handoffs.',
    accent: '#8be5a4',
    views: ['calendar', 'table', 'kanban'],
    portalVisible: true,
  },
  {
    key: 'design',
    label: 'Design Studio',
    shortLabel: 'Design',
    description: 'Stitch projects, creative requests, brand systems, and asset review.',
    accent: '#9d8cff',
    views: ['kanban', 'table', 'timeline'],
    portalVisible: true,
  },
  {
    key: 'research',
    label: 'Research & Analytics',
    shortLabel: 'Research',
    description: 'Lead enrichment, campaign research, reporting, and agent-assisted insight loops.',
    accent: '#4ed9d9',
    views: ['table', 'timeline'],
    portalVisible: false,
  },
  {
    key: 'finance',
    label: 'Contracts & Finance',
    shortLabel: 'Finance',
    description: 'Manual invoices, deposits, contract state, and Stripe-ready placeholders.',
    accent: '#ff9bcd',
    views: ['table', 'timeline'],
    portalVisible: true,
  },
  {
    key: 'ops',
    label: 'Team Ops',
    shortLabel: 'Ops',
    description: 'Team capacity, internal requests, hiring, approvals, and system automations.',
    accent: '#8c9fb3',
    views: ['table', 'kanban'],
    portalVisible: false,
  },
];

export const workspaceMap = new Map<WorkspaceKey, WorkspaceDefinition>(
  workspaceDefinitions.map((workspace) => [workspace.key, workspace]),
);
