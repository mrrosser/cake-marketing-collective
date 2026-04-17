import { getPlatformRuntimeConfig } from '../env';

const MONDAY_API_URL = 'https://api.monday.com/v2';

interface MondayGraphQlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface MondayBoardCollection {
  boards: MondayBoardNode[];
}

interface MondayNextItemsCollection {
  next_items_page: {
    cursor: string | null;
    items: MondayItemNode[];
  };
}

interface MondayItemDetailCollection {
  items: MondayItemDetailNode[];
}

interface MondayBoardNode {
  id: string;
  name: string;
  description?: string | null;
  state?: string | null;
  board_kind?: string | null;
  columns?: MondayColumnNode[];
  items_page?: {
    cursor: string | null;
    items: MondayItemNode[];
  };
}

interface MondayColumnNode {
  id: string;
  title: string;
  type: string;
}

interface MondayItemNode {
  id: string;
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
  group?: {
    id: string;
    title: string;
  } | null;
  column_values?: Array<{
    id: string;
    type: string;
    text?: string | null;
    value?: string | null;
  }>;
}

interface MondayItemDetailNode {
  id: string;
  assets?: Array<{
    id: string;
    name?: string | null;
    url?: string | null;
    public_url?: string | null;
  }>;
  updates?: Array<{
    id: string;
    body?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  }>;
}

export interface MondayImportItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  group: string;
  columnValues: Array<{
    id: string;
    type: string;
    text: string;
    value: string;
  }>;
  assets: Array<{
    id: string;
    name: string;
    url: string;
  }>;
  updates: Array<{
    id: string;
    body: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface MondayImportBoard {
  id: string;
  name: string;
  description: string;
  state: string;
  boardKind: string;
  columns: Array<{
    id: string;
    title: string;
    type: string;
  }>;
  items: MondayImportItem[];
}

export interface MondayImportSnapshot {
  boards: MondayImportBoard[];
  counts: {
    boards: number;
    items: number;
    updates: number;
    assets: number;
  };
}

export function hasMondayConfig(env: ImportMetaEnv = import.meta.env): boolean {
  return Boolean(env.MONDAY_API_TOKEN);
}

export async function importMondaySnapshot(): Promise<MondayImportSnapshot> {
  const config = getPlatformRuntimeConfig();
  const boards = await fetchBoards(config.mondayBoardIds);
  const itemDetails = await fetchItemDetails(boards.flatMap((board) => board.items_page?.items ?? []));

  const normalizedBoards = boards.map((board) => ({
    id: String(board.id),
    name: String(board.name),
    description: String(board.description ?? ''),
    state: String(board.state ?? ''),
    boardKind: String(board.board_kind ?? ''),
    columns: (board.columns ?? []).map((column) => ({
      id: String(column.id),
      title: String(column.title),
      type: String(column.type),
    })),
    items: (board.items_page?.items ?? []).map((item) => {
      const detail = itemDetails.get(String(item.id));

      return {
        id: String(item.id),
        title: String(item.name),
        createdAt: String(item.created_at ?? ''),
        updatedAt: String(item.updated_at ?? ''),
        group: String(item.group?.title ?? ''),
        columnValues: (item.column_values ?? []).map((column) => ({
          id: String(column.id),
          type: String(column.type),
          text: String(column.text ?? ''),
          value: String(column.value ?? ''),
        })),
        assets: detail?.assets ?? [],
        updates: detail?.updates ?? [],
      };
    }),
  }));

  return {
    boards: normalizedBoards,
    counts: {
      boards: normalizedBoards.length,
      items: normalizedBoards.reduce((sum, board) => sum + board.items.length, 0),
      updates: normalizedBoards.reduce(
        (sum, board) => sum + board.items.reduce((itemSum, item) => itemSum + item.updates.length, 0),
        0,
      ),
      assets: normalizedBoards.reduce(
        (sum, board) => sum + board.items.reduce((itemSum, item) => itemSum + item.assets.length, 0),
        0,
      ),
    },
  };
}

async function fetchBoards(boardIds: string[]): Promise<MondayBoardNode[]> {
  if (boardIds.length > 0) {
    const response = await mondayGraphQl<MondayBoardCollection>(
      `
        query ImportBoards($boardIds: [ID!]) {
          boards(ids: $boardIds) {
            id
            name
            description
            state
            board_kind
            columns {
              id
              title
              type
            }
            items_page(limit: 500) {
              cursor
              items {
                id
                name
                created_at
                updated_at
                group {
                  id
                  title
                }
                column_values {
                  id
                  type
                  text
                  value
                }
              }
            }
          }
        }
      `,
      { boardIds },
    );

    return await hydratePaginatedBoards(response.boards);
  }

  const response = await mondayGraphQl<MondayBoardCollection>(
    `
      query ImportBoards {
        boards(limit: 25) {
          id
          name
          description
          state
          board_kind
          columns {
            id
            title
            type
          }
          items_page(limit: 500) {
            cursor
            items {
              id
              name
              created_at
              updated_at
              group {
                id
                title
              }
              column_values {
                id
                type
                text
                value
              }
            }
          }
        }
      }
    `,
  );

  return await hydratePaginatedBoards(response.boards);
}

async function hydratePaginatedBoards(boards: MondayBoardNode[]): Promise<MondayBoardNode[]> {
  const hydratedBoards: MondayBoardNode[] = [];

  for (const board of boards) {
    let cursor = board.items_page?.cursor ?? null;
    const items = [...(board.items_page?.items ?? [])];

    while (cursor) {
      const nextPage = await mondayGraphQl<MondayNextItemsCollection>(
        `
          query NextItems($cursor: String!) {
            next_items_page(cursor: $cursor, limit: 500) {
              cursor
              items {
                id
                name
                created_at
                updated_at
                group {
                  id
                  title
                }
                column_values {
                  id
                  type
                  text
                  value
                }
              }
            }
          }
        `,
        { cursor },
      );

      items.push(...nextPage.next_items_page.items);
      cursor = nextPage.next_items_page.cursor;
    }

    hydratedBoards.push({
      ...board,
      items_page: {
        cursor: null,
        items,
      },
    });
  }

  return hydratedBoards;
}

async function fetchItemDetails(items: MondayItemNode[]): Promise<Map<string, MondayImportItem>> {
  const details = new Map<string, MondayImportItem>();
  const itemIds = items.map((item) => String(item.id));

  for (let index = 0; index < itemIds.length; index += 25) {
    const ids = itemIds.slice(index, index + 25);
    const response = await mondayGraphQl<MondayItemDetailCollection>(
      `
        query ImportItemDetails($itemIds: [ID!]) {
          items(ids: $itemIds) {
            id
            assets {
              id
              name
              url
              public_url
            }
            updates {
              id
              body
              created_at
              updated_at
            }
          }
        }
      `,
      { itemIds: ids },
    );

    for (const item of response.items) {
      details.set(String(item.id), {
        id: String(item.id),
        title: '',
        createdAt: '',
        updatedAt: '',
        group: '',
        columnValues: [],
        assets: (item.assets ?? []).map((asset) => ({
          id: String(asset.id),
          name: String(asset.name ?? ''),
          url: String(asset.public_url ?? asset.url ?? ''),
        })),
        updates: (item.updates ?? []).map((update) => ({
          id: String(update.id),
          body: String(update.body ?? ''),
          createdAt: String(update.created_at ?? ''),
          updatedAt: String(update.updated_at ?? ''),
        })),
      });
    }
  }

  return details;
}

async function mondayGraphQl<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const token = import.meta.env.MONDAY_API_TOKEN;
  const config = getPlatformRuntimeConfig();

  if (!token) {
    throw new Error('Monday token is missing. Set MONDAY_API_TOKEN before running migration jobs.');
  }

  const response = await fetch(MONDAY_API_URL, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
      'API-Version': config.mondayApiVersion,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const payload = (await response.json()) as MondayGraphQlResponse<T>;

  if (!response.ok || payload.errors?.length) {
    const message = payload.errors?.map((error) => error.message).join('; ') ?? response.statusText;
    throw new Error(`Monday API request failed: ${message}`);
  }

  if (!payload.data) {
    throw new Error('Monday API returned an empty response payload.');
  }

  return payload.data;
}
