// packages/types/src/db.ts

export type Client = {
  id: string;
  created_at: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  owner_id: string;
};
