import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { parseAppError } from "@/lib/errorHandler";

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email?: string;
  };
}

export async function signInAdmin(email: string, password: string): Promise<AuthResponse> {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[HappyWalls Dev Notice] Administrator authentication service is unconfigured. Define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable Supabase Auth."
      );
    }
    return {
      success: false,
      error: "Authentication service is currently unavailable. Please contact the administrator or try again later.",
    };
  }

  try {
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      return {
        success: false,
        error: parseAppError(authError, "Invalid email address or password. Please verify your credentials."),
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Authentication failed. No user record returned.",
      };
    }

    // Verify authenticated user with Supabase Auth
    const {
      data: { user: verifiedUser },
      error: verifyError,
    } = await supabase.auth.getUser();

    const userToVerify = verifiedUser || authData.user;
    if (verifyError && !authData.user) {
      return {
        success: false,
        error: "Unable to verify authenticated user session.",
      };
    }

    // --- Multi-tier Administrator Authorization Verification ---
    // Tier 1: Query admin_users table for exact UUID and role
    const { data: adminRecord, error: adminCheckError } = await supabase
      .from("admin_users")
      .select("id, role")
      .eq("id", userToVerify.id)
      .maybeSingle();

    // Tier 2: Check security-definer function is_admin()
    let isRpcAdmin = false;
    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc("is_admin");
      if (!rpcError && rpcResult === true) {
        isRpcAdmin = true;
      }
    } catch {
      // Ignore RPC error; fallback to adminRecord evaluation
    }

    // Case 1: Authorized via admin_users table or is_admin() RPC
    if (adminRecord && adminRecord.role === "admin") {
      return {
        success: true,
        user: {
          id: userToVerify.id,
          email: userToVerify.email,
        },
      };
    }

    if (isRpcAdmin) {
      // Verified via SECURITY DEFINER function in PostgreSQL
      return {
        success: true,
        user: {
          id: userToVerify.id,
          email: userToVerify.email,
        },
      };
    }

    // Case 2: Record found but role is not admin
    if (adminRecord && adminRecord.role !== "admin") {
      await supabase.auth.signOut();
      return {
        success: false,
        error: `Access denied. Role "${adminRecord.role}" is not authorized as an administrator.`,
      };
    }

    // Case 3: Database / RLS / Permission error (e.g. 42501)
    if (adminCheckError) {
      if (process.env.NODE_ENV === "development") {
        console.error("Admin authorization lookup error:", adminCheckError);
      }
      return {
        success: false,
        error: parseAppError(
          adminCheckError,
          "Unable to verify administrator permissions. Please contact your system administrator."
        ),
      };
    }

    // Case 4: Query executed cleanly with 0 rows found -> Genuinely unauthorized
    await supabase.auth.signOut();
    return {
      success: false,
      error: "Access denied. Your account is not authorized as an administrator.",
    };
  } catch (err: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Authentication exception:", err);
    }
    return {
      success: false,
      error: parseAppError(err, "An unexpected authentication error occurred. Please try again."),
    };
  }
}

export async function signOutAdmin(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: parseAppError(error, "Failed to sign out. Please try again.") };
    }
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: parseAppError(err, "Sign out error. Please try again.") };
  }
}

export async function getAdminSession() {
  if (!isSupabaseConfigured()) {
    return { user: null, isAdmin: false };
  }

  try {
    const supabase = createClient();
    // Validate JWT against Supabase Auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { user: null, isAdmin: false };
    }

    let isAdmin = false;

    // Check 1: admin_users table
    const { data: adminRecord } = await supabase
      .from("admin_users")
      .select("id, role")
      .eq("id", user.id)
      .maybeSingle();

    if (adminRecord && adminRecord.role === "admin") {
      isAdmin = true;
    } else {
      // Check 2: is_admin() RPC
      const { data: rpcResult, error: rpcError } = await supabase.rpc("is_admin");
      if (!rpcError && rpcResult === true) {
        isAdmin = true;
      }
    }

    return {
      user,
      isAdmin,
    };
  } catch {
    return { user: null, isAdmin: false };
  }
}
