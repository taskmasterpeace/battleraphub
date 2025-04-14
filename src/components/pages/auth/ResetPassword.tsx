"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";

const ResetPassword = ({ searchParams }: { searchParams: Message }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Reset password</CardTitle>
          <CardDescription className="text-center">
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={resetPasswordAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                placeholder="New password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <SubmitButton pendingText="Resetting...">Reset password</SubmitButton>
            </div>
            <FormMessage message={searchParams} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
