import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="from" value={params.from ?? "/admin"} />
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {params.error && (
              <p className="text-destructive text-sm">Invalid password</p>
            )}
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <Link href="/" className="text-muted-foreground mt-4 block text-center text-sm hover:underline">
            Back to quiz
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
