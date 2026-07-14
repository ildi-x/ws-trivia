import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background p-4">
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-sm border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/api/admin/login" method="post" className="space-y-4">
            <input type="hidden" name="from" value={params.from ?? "/admin"} />
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {params.error && (
              <p className="text-destructive text-sm">Invalid password</p>
            )}
            <Button type="submit" className="h-10 w-full">
              Sign in
            </Button>
          </form>
          <Link
            href="/"
            className="text-muted-foreground mt-4 block text-center text-sm transition-colors hover:text-foreground"
          >
            Back to quiz
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
