import { supabase } from './supabase';

export interface Contact {
  id: number;
  email: string;
  subject: string;
  message: string;
  locale: string;
  created_at: string;
  is_read: boolean;
  response_sent: boolean;
  notes?: string | null;
}

export interface CreateContactData {
  email: string;
  subject: string;
  message: string;
  locale: string;
}

/**
 * Submit a new contact form
 */
export async function submitContact(
  contactData: CreateContactData
): Promise<void> {
  const { error } = await supabase
    .from('contacts')
    .insert([contactData]);

  if (error) {
    console.error('Error submitting contact:', error);
    throw error;
  }
}
