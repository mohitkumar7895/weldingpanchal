import { RowDataPacket } from "mysql2";

export type UserRole = "customer" | "worker" | "contractor" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  avatar_url?: string | null;
  is_active: boolean;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRow extends RowDataPacket, User {
  password_hash: string;
}

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string | null;
}

export interface SessionPayload {
  user: SessionUser;
  sessionId?: number;
  tokenHash?: string;
  expiresAt: number;
}

export interface Category {
  id: number;
  type: "service" | "material";
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow extends RowDataPacket, Category {}

export interface WorkerSkill {
  id: number;
  worker_profile_id: number;
  skill_name: string;
  certification_name?: string | null;
  years_experience: number;
  created_at: string;
}

export interface WorkerSkillRow extends RowDataPacket, WorkerSkill {}

export interface WorkerProfile {
  id: number;
  user_id: number;
  title: string;
  experience_years: number;
  hourly_rate?: number | null;
  daily_rate?: number | null;
  city: string;
  state: string;
  availability_status: "available" | "busy" | "on_leave";
  verification_status: "pending" | "verified" | "rejected";
  rating_avg: number;
  total_reviews: number;
  bio?: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkerProfileRow extends RowDataPacket, WorkerProfile {
  worker_name?: string;
  worker_email?: string;
  worker_phone?: string;
  worker_avatar?: string | null;
}

export interface ContractorProfile {
  id: number;
  user_id: number;
  company_name: string;
  registration_number?: string | null;
  experience_years: number;
  established_year?: number | null;
  team_size: number;
  city: string;
  state: string;
  website?: string | null;
  verification_status: "pending" | "verified" | "rejected";
  rating_avg: number;
  total_reviews: number;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractorProfileRow extends RowDataPacket, ContractorProfile {
  contractor_name?: string;
  contractor_email?: string;
  contractor_phone?: string;
}

export interface ContractorService {
  id: number;
  contractor_profile_id: number;
  service_id: number;
  custom_pricing_notes?: string | null;
  created_at: string;
}

export interface ContractorServiceRow extends RowDataPacket, ContractorService {
  service_title?: string;
  service_slug?: string;
  category_name?: string;
}

export interface Service {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  base_price?: number | null;
  price_unit?: string | null;
  icon: string;
  image_url?: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceRow extends RowDataPacket, Service {
  category_name?: string;
  category_slug?: string;
}

export interface Material {
  id: number;
  category_id: number;
  sku: string;
  name: string;
  slug: string;
  brand?: string | null;
  specifications?: any;
  unit: string;
  price_per_unit: number;
  stock_quantity: number;
  min_order_quantity: number;
  image_url?: string | null;
  is_in_stock: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MaterialRow extends RowDataPacket, Material {
  category_name?: string;
  category_slug?: string;
}

export interface Address {
  id: number;
  user_id: number;
  address_type: "work_site" | "office" | "residence" | "factory";
  contact_person?: string | null;
  contact_phone?: string | null;
  street_line1: string;
  street_line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  landmark?: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressRow extends RowDataPacket, Address {}

export type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Booking {
  id: number;
  booking_number: string;
  customer_id: number;
  service_id?: number | null;
  assigned_worker_id?: number | null;
  assigned_contractor_id?: number | null;
  address_id?: number | null;
  status: BookingStatus;
  scheduled_date?: string | null;
  scheduled_time_slot?: string | null;
  estimated_amount?: number | null;
  final_amount?: number | null;
  notes?: string | null;
  cancellation_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingRow extends RowDataPacket, Booking {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  service_title?: string;
  worker_name?: string;
  contractor_company?: string;
  city?: string;
  street_line1?: string;
}

export interface BookingStatusHistory {
  id: number;
  booking_id: number;
  from_status?: BookingStatus | null;
  to_status: BookingStatus;
  changed_by_user_id?: number | null;
  reason?: string | null;
  created_at: string;
}

export interface BookingStatusHistoryRow extends RowDataPacket, BookingStatusHistory {
  changed_by_name?: string;
}

export interface Review {
  id: number;
  booking_id?: number | null;
  reviewer_id: number;
  worker_profile_id?: number | null;
  contractor_profile_id?: number | null;
  service_id?: number | null;
  rating: number;
  review_text?: string | null;
  is_verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewRow extends RowDataPacket, Review {
  reviewer_name?: string;
  reviewer_avatar?: string | null;
}

export interface PortfolioImage {
  id: number;
  worker_profile_id?: number | null;
  contractor_profile_id?: number | null;
  title: string;
  description?: string | null;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface PortfolioImageRow extends RowDataPacket, PortfolioImage {}

export interface SessionRecord {
  id: number;
  user_id: number;
  token_hash: string;
  ip_address?: string | null;
  user_agent?: string | null;
  expires_at: string;
  created_at: string;
}

export interface SessionRow extends RowDataPacket, SessionRecord {}

export interface ContactEnquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject?: string | null;
  service_id?: number | null;
  material_id?: number | null;
  enquiry_type: "general" | "service_quote" | "material_quote" | "bulk_order" | "emergency";
  city: string;
  quantity?: string | null;
  message: string;
  status: "pending" | "contacted" | "in_progress" | "resolved" | "closed";
  assigned_to_user_id?: number | null;
  resolution_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactEnquiryRow extends RowDataPacket, ContactEnquiry {
  service_title?: string;
  material_name?: string;
}

export interface AdminActivityLog {
  id: number;
  admin_user_id: number;
  action: string;
  target_entity: string;
  target_id?: number | null;
  details?: any;
  ip_address?: string | null;
  created_at: string;
}

export interface AdminActivityLogRow extends RowDataPacket, AdminActivityLog {
  admin_name?: string;
  admin_email?: string;
}

export interface UserFavourite {
  id: number;
  user_id: number;
  worker_profile_id?: number | null;
  contractor_profile_id?: number | null;
  service_id?: number | null;
  material_id?: number | null;
  created_at: string;
}

export interface UserFavouriteRow extends RowDataPacket, UserFavourite {}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
