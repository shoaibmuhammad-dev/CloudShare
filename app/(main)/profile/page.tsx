import UserProfile from "./_components/UserProfile";

export const metadata = {
  title: "Profile | CloudShare",
  description: "Manage your account settings.",
};

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Profile Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account details and personal preferences.
        </p>
      </div>

      <UserProfile />
    </div>
  );
}
