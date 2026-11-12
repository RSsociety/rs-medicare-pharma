import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/ui";
import { isAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin/dashboard");
  return (
    <div className="grid min-h-[80vh] place-items-center bg-navy-950 px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-lift">
          <Logo />
          <h1 className="mt-5 text-lg font-bold text-navy-900">Operations dashboard</h1>
          <p className="mt-1 mb-5 text-[11.5px] leading-relaxed text-navy-500">
            Authorised staff only. Manage products, orders, freight, enquiries and payment settings.
          </p>
          <AdminLoginForm />
          <div className="mt-4 rounded-lg bg-navy-50/70 p-3 text-[10px] leading-relaxed text-navy-500">
            Demo credentials are configured through <code className="text-navy-700">ADMIN_EMAIL</code> and{" "}
            <code className="text-navy-700">ADMIN_PASSWORD</code> environment variables. Defaults:
            admin@rsmedicarepharma.com / RSMedicare@2026.
          </div>
        </div>
      </div>
    </div>
  );
}
