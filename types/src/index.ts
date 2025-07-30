// @workspace/types/index.ts

// ---- Shared Enums & Constants ----

export type UserRole = 'ADMIN' | 'USER' | 'RECRUITER' | 'HIRING_MANAGER';

export type ContactStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';
export type JobStatus = 'OPEN' | 'CLOSED' | 'ON_HOLD';

// ---- Supabase Session Types ----

import type { Session } from '@supabase/supabase-js';
export type SupabaseSession = Session;

// ---- Client Entity ----

export type Client = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  owner_id: string;
  created_at: string;
};

// ---- Candidate Entity ----

export type Candidate = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  resume_url?: string;
  notes?: string;
  job_id?: string;
  status: ContactStatus;
  created_at: string;
};

// ---- Job Entity ----

export type Job = {
  id: string;
  title: string;
  description?: string;
  status: JobStatus;
  client_id: string;
  created_at: string;
};

// ---- Standardised API Response ----

export type ApiResponse<T> = {
  data: T | null;
  error?: string;
};
