"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { forgotPasswordAction } from "@/app/actions";
import { toast } from "sonner";
import { useFormSubmit } from "@/hooks/useFormSubmit";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const { onSubmit: onForgetPassword, processing } = useFormSubmit(
    async (data: { email: string }) => {
      const formData = new FormData();
      try {
        formData.append("email", data.email);
        const response = await forgotPasswordAction(formData);
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(`Forgot password failed: ${error}`);
      }
    },
  );

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Please enter your verified email here
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onForgetPassword({ email });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                placeholder="your.email@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <SubmitButton disabled={processing} pendingText="Sending...">
                Send link
              </SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
