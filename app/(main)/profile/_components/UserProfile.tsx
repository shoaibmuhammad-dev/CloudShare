"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/lib/hooks/use-current-user";

const UserProfile = () => {
  const { data: user, isLoading } = useCurrentUser();
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 sm:p-8 space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="h-24 min-w-24 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-sm ring-1 ring-slate-100">
            JD
          </div>
          <div className="w-full">
            <h2 className="text-xl font-semibold text-slate-900">
              {user?.fullName}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
            <div className="mt-3 flex gap-2 w-full">
              <Button variant="outline" size="sm">
                Change avatar
              </Button>
              {user?.image && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 border-t border-slate-100 pt-8">
          <h3 className="text-lg font-medium text-slate-900">
            Personal Information
          </h3>

          <div className="space-y-2">
            <Label htmlFor="firstName">Full Name</Label>
            <Input id="firstName" type="text" defaultValue={user?.fullName} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              defaultValue={user?.email}
              disabled={true}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
