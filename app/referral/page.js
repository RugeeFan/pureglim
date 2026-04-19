import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getReferrerSession } from "../../lib/auth/referrerSession";

export default async function ReferralIndexPage() {
  const cookieStore = await cookies();
  const session = await getReferrerSession(cookieStore);

  if (session.valid) {
    redirect("/referral/dashboard");
  }

  redirect("/referral/login");
}
