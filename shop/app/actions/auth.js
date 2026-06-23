//server components-> that access the database, 
"use server";

// importing cookies from next headers thats creates, read, and delete cookies
// A cookie is a small piece of data that a website stores in the browser.
import { cookies } from "next/headers";
//it allows server side navigation( make the browser automatically moves)
import { redirect } from "next/navigation";
//bcrypt-> for password hashing
import bcrypt from "bcrypt";
//for generating the token that proves who is logging in
import jwt from "jsonwebtoken";
//allows to talk to postgress SQL
import { query } from "@/lib/db";

//exporting the loginAction function
export async function loginAction(prevState, formData) {

  //formData.get("email")->returns the value user typed in the email field
  // toString()-> ? -> only calls toString if value exists
  // toLowerCase-> converts everything to Lowercase
  const email = formData.get("email")?.toString().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password required" };
  }

  const { rows } = await query(
    "SELECT id, email, role, password_hash FROM users WHERE email = $1",
    [email]
  );
  const user = rows[0];
  if (!user) return { error: "Invalid credentials" };

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return { error: "Invalid credentials" };

  if (user.role !== "admin") return { error: "Not an admin" };

  //verifyinh while signing in
  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  //creating the cookies
  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    //reduces a taxx 
    sameSite: "lax",
    //cookie availanle everywhere
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect("/admin/orders");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/admin/login");
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");
  try {
    //
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") redirect("/admin/login");
    return payload;
    //admt login
  } catch {
    redirect("/admin/login");
  }
}

