export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  password: string;
  role: UserRole;
  profileImage: string | null;
  targetAmount: number | null;
  achievedAmount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "SALES_MANAGER" | "SALES_AGENT" | "EMPLOYEE";

export interface Lead {
  id: string;
  name: string;
  phone: string | null;
  alternatePhone: string | null;
  email: string | null;
  companyName: string | null;
  serviceRequired: string | null;
  budget: number | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  leadSource: LeadSource;
  leadStatus: LeadStatus;
  assignedToId: string | null;
  assignedTo?: User;
  createdById: string;
  createdBy?: User;
  tags: string[];
  notes: string | null;
  lastContactDate: string | null;
  nextFollowupDate: string | null;
  isActive: boolean;
  convertedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus =
  | "NEW"
  | "ACTIVE"
  | "CONTACTED"
  | "INTERESTED"
  | "FOLLOW_UP"
  | "QUOTATION_SENT"
  | "NEGOTIATION"
  | "WON"
  | "LOST"
  | "INACTIVE"
  | "CLOSED";

export type LeadSource = "INDIAMART" | "WEBSITE" | "FACEBOOK" | "WHATSAPP" | "REFERRAL" | "MANUAL";

export interface Followup {
  id: string;
  leadId: string;
  lead?: Lead;
  followupDate: string;
  followupType: FollowupType;
  remarks: string | null;
  nextFollowupDate: string | null;
  followupStatus: FollowupStatus;
  createdById: string;
  createdBy?: User;
  createdAt: string;
}

export type FollowupStatus = "PENDING" | "COMPLETED" | "NO_RESPONSE" | "INTERESTED" | "CALLBACK" | "CLOSED";
export type FollowupType = "PHONE_CALL" | "WHATSAPP" | "EMAIL" | "MEETING" | "SITE_VISIT";

export interface Customer {
  id: string;
  leadId: string | null;
  lead?: Lead;
  name: string;
  phone: string | null;
  email: string | null;
  companyName: string | null;
  address: string | null;
  purchasedService: string | null;
  totalDealAmount: number;
  notes: string | null;
  createdAt: string;
}

export interface Deal {
  id: string;
  customerId: string | null;
  customer?: Customer;
  leadId: string | null;
  lead?: Lead;
  title: string;
  amount: number;
  stage: DealStage;
  expectedCloseDate: string | null;
  assignedToId: string | null;
  assignedTo?: User;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type DealStage = "NEW" | "DISCUSSION" | "PROPOSAL_SENT" | "NEGOTIATION" | "WON" | "LOST";

export interface QuotationLineItem {
  id: string;
  quotationId: string;
  productId: string | null;
  product?: ProductService;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxPercent: number;
  total: number;
}

export interface Quotation {
  id: string;
  customerId: string | null;
  customer?: Customer;
  leadId: string | null;
  lead?: Lead;
  quotationNumber: string;
  serviceName: string | null;
  amount: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: QuotationStatus;
  pdfUrl: string | null;
  lineItems: QuotationLineItem[];
  invoices: Invoice[];
  createdAt: string;
  updatedAt: string;
}

export type QuotationStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";

export interface ProductService {
  id: string;
  name: string;
  description: string | null;
  price: number;
  taxPercent: number;
  unit: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string | null;
  transactionId: string | null;
  notes: string | null;
  createdBy?: User;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer?: Customer;
  leadId: string | null;
  lead?: Lead;
  dealId: string | null;
  deal?: Deal;
  quotationId: string | null;
  quotation?: Quotation;
  amount: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: InvoiceStatus;
  dueDate: string | null;
  paidAt: string | null;
  notes: string | null;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus = "DRAFT" | "SENT" | "UNPAID" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "CANCELLED";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  assignedToId: string | null;
  assignedTo?: User;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdById: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface Note {
  id: string;
  leadId: string;
  lead?: Lead;
  userId: string;
  user?: User;
  note: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  user?: User;
  channel: NotificationChannel;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

export type NotificationChannel = "EMAIL" | "WHATSAPP" | "BROWSER";

export interface ActivityLog {
  id: string;
  userId: string | null;
  user?: User;
  action: string;
  entityType: string | null;
  entityId: string | null;
  remarks: string | null;
  metadata: Record<string, any> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  activeLeads: number;
  inactiveLeads: number;
  todayFollowups: number;
  pendingTasks: number;
  wonDeals: number;
  lostDeals: number;
  monthlyRevenue: number;
  conversionRate: number;
  recentActivities: ActivityLog[];
  upcomingFollowups: Followup[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
