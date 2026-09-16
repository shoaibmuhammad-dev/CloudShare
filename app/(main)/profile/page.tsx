import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-sm ring-1 ring-slate-100">
              JD
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">John Doe</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                john.doe@example.com
              </p>
              <div className="mt-3 flex gap-3">
                <Button variant="outline" size="sm">
                  Change avatar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 border-t border-slate-100 pt-8">
            <h3 className="text-lg font-medium text-slate-900">
              Personal Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" type="text" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" type="text" defaultValue="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue="john.doe@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Account Role</Label>
              <Input
                id="role"
                type="text"
                defaultValue="Administrator"
                disabled
                className="bg-slate-50 text-slate-500"
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-6">
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
