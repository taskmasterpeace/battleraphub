"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoleWeightsContent from "@/components/pages/admin-tools/RoleWeightsContent";

const AdminTools = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Tools</h1>

      <Tabs defaultValue="weights">
        <TabsList className="mb-6 bg-gray-900 border border-gray-800">
          <TabsTrigger value="weights">Role Weights</TabsTrigger>
        </TabsList>

        <TabsContent value="weights">
          <RoleWeightsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTools;
