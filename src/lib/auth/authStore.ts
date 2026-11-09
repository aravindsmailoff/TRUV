/**
 * TRUV Authentication & Whitelisting Store
 * Manages persistent user registrations, admin whitelisting approvals,
 * and indefinte user sessions until explicit logout.
 */

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  companyName: string;
  role: "buyer" | "manufacturer" | "admin";
  country: string;
  iecCode?: string;
  gstin?: string;
  status: "pending" | "whitelisted" | "rejected";
  registeredAt: string;
  whitelistedAt?: string;
  approvalEmailSent?: boolean;
}

const STORAGE_KEY_USERS = "truv_registered_users_v1";
const STORAGE_KEY_SESSION = "truv_current_session_v1";
const STORAGE_KEY_EMAILS = "truv_dispatched_emails_v1";

export interface DispatchedEmail {
  id: string;
  toEmail: string;
  userName: string;
  companyName: string;
  subject: string;
  body: string;
  sentAt: string;
}

const SEED_USERS: RegisteredUser[] = [
  {
    id: "usr_admin_01",
    name: "TRUV Head of Trade Compliance",
    email: "admin@truv.io",
    password: "password123",
    companyName: "TRUV Operations Global",
    role: "admin",
    country: "Global",
    status: "whitelisted",
    registeredAt: "2026-11-01T10:00:00Z",
    whitelistedAt: "2026-11-01T10:00:00Z",
    approvalEmailSent: true,
  },
  {
    id: "usr_buyer_01",
    name: "Marcus Vance",
    email: "m.vance@pacificarchhardware.com",
    password: "password123",
    companyName: "Pacific Architectural Hardware LLC",
    role: "buyer",
    country: "United States",
    status: "whitelisted",
    registeredAt: "2026-11-05T14:30:00Z",
    whitelistedAt: "2026-11-05T15:00:00Z",
    approvalEmailSent: true,
  },
  {
    id: "usr_mfg_01",
    name: "Rajesh Sharma",
    email: "exports@mpfbrassware.com",
    password: "password123",
    companyName: "Moradabad Precision Foundry & Castings LLP",
    role: "manufacturer",
    country: "India",
    iecCode: "0508012491",
    gstin: "09AAHFM9201L1Z4",
    status: "whitelisted",
    registeredAt: "2026-11-06T09:15:00Z",
    whitelistedAt: "2026-11-06T11:45:00Z",
    approvalEmailSent: true,
  },
  {
    id: "usr_buyer_pending_02",
    name: "Karin Lindqvist",
    email: "sourcing@nordicapparel.se",
    password: "password123",
    companyName: "Nordic Organic Apparel AB",
    role: "buyer",
    country: "Sweden",
    status: "pending",
    registeredAt: "2026-11-09T18:20:00Z",
  },
  {
    id: "usr_mfg_pending_03",
    name: "Bhavin Patel",
    email: "commercial@saurashtratech.in",
    password: "password123",
    companyName: "Saurashtra High-Tech Auto Ancillaries LLP",
    role: "manufacturer",
    country: "India",
    iecCode: "2411009184",
    gstin: "24AABCS9184P1Z3",
    status: "pending",
    registeredAt: "2026-11-09T22:45:00Z",
  },
];

export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === "undefined") return SEED_USERS;
  try {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    return JSON.parse(data);
  } catch {
    return SEED_USERS;
  }
}

export function saveRegisteredUsers(users: RegisteredUser[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save users", e);
  }
}

export function getCurrentSessionUser(): RegisteredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setCurrentSessionUser(user: RegisteredUser | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    }
    // Dispatch custom event for cross-component sync
    window.dispatchEvent(new Event("truv-auth-changed"));
  } catch (e) {
    console.error("Failed to set session", e);
  }
}

export function registerNewUser(data: {
  name: string;
  email: string;
  password?: string;
  companyName: string;
  role: "buyer" | "manufacturer";
  country: string;
  iecCode?: string;
  gstin?: string;
}): { success: boolean; user: RegisteredUser } {
  const users = getRegisteredUsers();

  // Check if email already registered
  const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
  if (existing) {
    return { success: false, user: existing };
  }

  const newUser: RegisteredUser = {
    id: `usr_${Date.now()}`,
    name: data.name,
    email: data.email,
    password: data.password || "password123",
    companyName: data.companyName,
    role: data.role,
    country: data.country,
    iecCode: data.iecCode,
    gstin: data.gstin,
    status: "pending", // Strictly pending until admin approval
    registeredAt: new Date().toISOString(),
  };

  const updated = [newUser, ...users];
  saveRegisteredUsers(updated);
  return { success: true, user: newUser };
}

export function loginUserWithCredentials(email: string, password?: string): {
  success: boolean;
  user?: RegisteredUser;
  reason?: "not_found" | "pending" | "rejected" | "password_mismatch";
  message: string;
} {
  const users = getRegisteredUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return {
      success: false,
      reason: "not_found",
      message: "No account found with this email address. Please sign up to request access.",
    };
  }

  if (password && user.password && user.password !== password) {
    return {
      success: false,
      reason: "password_mismatch",
      message: "Invalid password provided. Please check your credentials.",
    };
  }

  // Check whitelist status
  if (user.status === "pending") {
    return {
      success: false,
      reason: "pending",
      user,
      message:
        "Account Pending Whitelisting: Your registration is currently undergoing administrative compliance review. Once approved, you will receive an activation email allowing you to log in.",
    };
  }

  if (user.status === "rejected") {
    return {
      success: false,
      reason: "rejected",
      user,
      message:
        "Account Not Approved: Your application has been declined by the compliance desk. Please contact support@truv.io for clarification.",
    };
  }

  // User is whitelisted -> log in indefinitely until explicit logout
  setCurrentSessionUser(user);
  return {
    success: true,
    user,
    message: "Login successful! Welcome back.",
  };
}

export function whitelistAndSendEmail(userId: string): { success: boolean; user?: RegisteredUser; emailNotice?: DispatchedEmail } {
  const users = getRegisteredUsers();
  const target = users.find((u) => u.id === userId);
  if (!target) return { success: false };

  target.status = "whitelisted";
  target.whitelistedAt = new Date().toISOString();
  target.approvalEmailSent = true;

  saveRegisteredUsers([...users]);

  // Record dispatched approval email
  const newEmail: DispatchedEmail = {
    id: `email_${Date.now()}`,
    toEmail: target.email,
    userName: target.name,
    companyName: target.companyName,
    subject: "Your TRUV Trade Platform Access Has Been Approved and Whitelisted",
    body: `Hello ${target.name},\n\nYour registration for ${target.companyName} on TRUV Global Trade Execution Infrastructure has been reviewed and approved by the compliance administration.\n\nYour account is now whitelisted. You can log in anytime using your credentials:\nEmail: ${target.email}\nPortal URL: http://localhost:3000/signin\n\nWelcome to TRUV.`,
    sentAt: new Date().toISOString(),
  };

  saveDispatchedEmail(newEmail);
  return { success: true, user: target, emailNotice: newEmail };
}

export function rejectRegistration(userId: string): { success: boolean } {
  const users = getRegisteredUsers();
  const target = users.find((u) => u.id === userId);
  if (!target) return { success: false };

  target.status = "rejected";
  saveRegisteredUsers([...users]);
  return { success: true };
}

export function getDispatchedEmails(): DispatchedEmail[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY_EMAILS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDispatchedEmail(email: DispatchedEmail): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getDispatchedEmails();
    localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify([email, ...existing]));
  } catch (e) {
    console.error("Failed to save email", e);
  }
}
