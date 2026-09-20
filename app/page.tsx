import { redirect } from "next/navigation";

export default function Home() {
  return redirect("/dashboard");
  return (
    <main>
      <h1>Hello World</h1>
    </main>
  );
}
