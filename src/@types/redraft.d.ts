declare module 'redraft' {
  export type RawDraftContentState = {
    readonly blocks: ReadonlyArray<any>;
    readonly entityMap: Record<string, any>;
  };

  type InlineResolver = (
    children: React.ReactNode[],
    params: {
      key: number;
      keys: number[];
      depth: number;
      data: React.ReactNode[];
    },
  ) => React.ReactNode;
  type BlocksResolver = (
    children: React.ReactNode[],
    params: {
      key: number;
      keys: number[];
      depth: number;
      data: React.ReactNode[];
    },
  ) => React.ReactNode;
  type EntitiesResolver = (
    children: React.ReactNode[],
    data: React.ReactNode[],
    params: { key: number; keys: number[]; depth: number },
  ) => React.ReactNode;

  export type Config = {
    inline?: Record<
      'BOLD' | 'CODE' | 'ITALIC' | 'STRIKETHROUGH' | 'UNDERLINE' | string,
      InlineResolver
    >;
    blocks?: Record<string, BlocksResolver>;
    entities?: Record<string, EntitiesResolver>;
  };
  const redraft: (raw: RawDraftContentState, params: Config) => React.ReactNode;

  export default redraft;
}
