export interface Barber {
  id: number;
  name: string;
  bio: string | null;
  image: string | null;
  active: number;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  active: number;
  created_at: string;
}

export interface Booking {
  id: number;
  barber_id: number;
  service_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  date: string;
  time: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface BookingRow extends Booking {
  barber_name: string;
  service_name: string;
  price: number;
}

export interface BusinessHours {
  id: number;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: number;
}

export interface TimeOff {
  id: number;
  barber_id: number;
  date: string;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
}

export interface DbResult {
  changes: number;
  lastInsertRowid: number | null;
}

export interface DbAdapter {
  init(): Promise<void>;
  query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
  get(sql: string, params?: unknown[]): Promise<Record<string, unknown> | null>;
}
