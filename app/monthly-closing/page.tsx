import { redirect } from "next/navigation";

export default function MonthlyClosingRedirectPage() {
  redirect("/closings");
}
