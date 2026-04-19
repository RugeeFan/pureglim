import ReferrerVerifyForm from "../ReferrerVerifyForm";

export default async function ReferralVerifyPage({ searchParams }) {
  const params = await searchParams;
  return <ReferrerVerifyForm phone={params?.phone || "your mobile"} />;
}
