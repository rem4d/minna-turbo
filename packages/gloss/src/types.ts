export type DBGloss = {
  id: number;
  kana: string | null;
  comment?: string | null;
  number: number | null;
  is_hidden?: boolean | null;
  tmp: string | null;
};

export type DBGlossCreateInput = Omit<DBGloss, "id">;
export type DBGlossUpdateInput = { id: number; tmp: string | null };

export type AIGloss = {
  gloss: string;
  comment: string;
};

export type Relation = {
  sentenceId: number;
  glossId: number | null;
  glossKana?: string;
  glossComment?: string;
  glossNumber?: number | null;
};
