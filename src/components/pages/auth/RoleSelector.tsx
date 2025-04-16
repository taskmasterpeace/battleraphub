"use client";

import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mic, Video, Users, Award, Info, Badge } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ROLE, ROLES_NAME } from "@/config";

interface RoleSelectorProps {
  role: number;
  onChange: (role: number) => void;
}

export default function RoleSelector({ role, onChange }: RoleSelectorProps) {
  const handleRoleChange = (value: string) => {
    onChange(parseInt(value));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400 mb-4">
        Choose your role. You can update this later in your profile.
      </p>

      <RadioGroup
        value={role.toString()}
        onValueChange={handleRoleChange}
        className="grid grid-cols-1 gap-4"
      >
        <RoleCard
          title={ROLES_NAME[ROLE.FAN]}
          description="Battle rap enthusiast and viewer"
          icon={<Users className="h-5 w-5 text-blue-400" />}
          value={ROLE.FAN}
          color="blue"
          isDefault
          badge={false}
        />

        <RoleCard
          title={ROLES_NAME[ROLE.MEDIA]}
          description="Journalist, blogger, or content creator"
          icon={<Video className="h-5 w-5 text-purple-400" />}
          value={ROLE.MEDIA}
          color="purple"
          requiresVerification
          badge={true}
        />

        <RoleCard
          title={ROLES_NAME[ROLE.BATTLE]}
          description="Active battle rapper"
          icon={<Mic className="h-5 w-5 text-green-400" />}
          value={ROLE.BATTLE}
          color="green"
          requiresVerification
          badge={true}
        />

        <RoleCard
          title={ROLES_NAME[ROLE.LEAGUE_OWNER_INVESTOR]}
          description="Owner or operator of a battle rap league"
          icon={<Award className="h-5 w-5 text-red-400" />}
          value={ROLE.LEAGUE_OWNER_INVESTOR}
          color="red"
          requiresVerification
          badge={true}
        />
      </RadioGroup>
    </div>
  );
}

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: number;
  color: string;
  isDefault?: boolean;
  requiresVerification?: boolean;
  badge?: boolean;
}

function RoleCard({
  title,
  description,
  icon,
  value,
  color,
  isDefault,
  requiresVerification,
  badge,
}: RoleCardProps) {
  return (
    <Card
      className={`border border-gray-800 hover:border-${color}-500/70 transition-colors cursor-pointer`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <RadioGroupItem
            value={value.toString()}
            id={`role-${title.toLowerCase()}`}
            className={`mt-1 data-[state=checked]:bg-${color}-500 data-[state=checked]:border-${color}-500`}
          />
          <div className="flex-1">
            <div className="flex items-center">
              <Label
                htmlFor={`role-${title.toLowerCase()}`}
                className="text-base font-medium cursor-pointer flex items-center flex-wrap gap-y-1"
              >
                {icon}
                <span className="ml-2">{title}</span>
                {isDefault && (
                  <span className="ml-2 text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
                {badge && (
                  <span className="ml-2 text-xs bg-yellow-900/50 text-yellow-300 px-2 py-0.5 rounded-full flex items-center">
                    <Badge className="h-3 w-3 mr-1" />
                    Badge
                  </span>
                )}
                {requiresVerification && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-2 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Requires verification by admins</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </Label>
            </div>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
