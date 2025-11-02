export interface Env {
  DB: D1Database;
  EMAIL: any;
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: number;
}

export interface Domain {
  id: string;
  user_id: string;
  domain: string;
  verified: number;
  dns_records: string;
  created_at: number;
}

export interface TempEmail {
  id: string;
  user_id: string;
  domain_id: string;
  email_address: string;
  expires_at: number | null;
  created_at: number;
}

export interface Note {
  id: string;
  user_id: string;
  from_email: string;
  to_email: string;
  subject: string;
  content: string;
  is_read: number;
  read_at: number | null;
  expires_after_read: number;
  password_protected: number;
  created_at: number;
}

export interface Message {
  id: string;
  temp_email_id: string;
  from_address: string;
  to_address: string;
  subject: string;
  body_text: string;
  body_html: string;
  headers: string;
  received_at: number;
  is_read: number;
}
