"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { setRedisKey } from "@/app/actions";

const PromptSchema = z.object({
  message: z.string().min(10, "Prompt must be at least 10 characters"),
});

type PromptFormData = z.infer<typeof PromptSchema>;

const NewsTools = ({ prompts }: { prompts: Record<string, string> }) => {
  const promptEntries = Object.entries(prompts);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeKey = promptEntries[activeIndex]?.[0];
  const activeTemplate = promptEntries[activeIndex]?.[1] ?? "";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PromptFormData>({
    resolver: zodResolver(PromptSchema),
    defaultValues: {
      message: activeTemplate,
    },
  });

  useEffect(() => {
    setValue("message", activeTemplate);
  }, [activeIndex, setValue, activeTemplate]);

  const onSubmit = async (data: PromptFormData) => {
    try {
      const name = activeKey;
      const content = data.message;
      const response = await setRedisKey(name, content);
      if (response.success) {
        toast.success("Your changes have been saved.");
      } else {
        toast.error("Failed to save prompt. Please try again.");
      }
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error("Failed to save prompt. Please try again.");
    }
  };

  const handleReset = async () => {
    try {
      const name = activeKey;
      const content = activeTemplate;
      const prompt = await setRedisKey(name, content);
      if (prompt.success) {
        toast.success("Your changes have been reset.");
      } else {
        toast.error("Failed to reset prompt. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting prompt:", error);
      toast.error("Failed to reset prompt. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
        <h1 className="text-xl sm:text-3xl font-bold text-nowrap">News Tools</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="border border-gray-800 text-accent-foreground hover:bg-muted px-4 py-2 mt-1 sm:mt-0 rounded-md text-sm"
          >
            Back to Admin
          </Link>
        </div>
      </div>

      <div className="mt-6 mb-4">
        <Tabs defaultValue="news-prompt">
          <TabsList className="mb-6">
            <TabsTrigger value="news-prompt">News Prompt</TabsTrigger>
          </TabsList>

          <TabsContent value="news-prompt">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-3 bg-accent rounded-md shadow-sm p-5">
                <h4 className="text-base font-semibold">Prompts</h4>

                <div className="my-5">
                  <ul className="flex flex-col gap-2 max-h-[500px] overflow-auto">
                    {promptEntries.map(([key], index) => (
                      <li key={key} className="w-full">
                        <Button
                          variant="default"
                          onClick={() => setActiveIndex(index)}
                          className={`hover:bg-amber-400 text-accent-foreground w-full text-sm flex items-center justify-start truncate ${
                            activeIndex === index
                              ? "bg-amber-400 hover:bg-amber-400/80 text-accent-foreground"
                              : "bg-accent"
                          }`}
                        >
                          <span className="block truncate">
                            {key
                              ?.replace("news:", "")
                              .toLowerCase()
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-span-12 md:col-span-9 bg-accent rounded-md shadow-sm p-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h2 className="text-3xl font-medium">
                    {" "}
                    {activeKey
                      ?.replace("news:", "")
                      .toLowerCase()
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </h2>
                  <div>
                    <h3 className="text-sm font-semibold mt-4 my-2">
                      Template Reference (Read-only):
                    </h3>
                    <p className="bg-background text-muted-foreground rounded-md p-3 h-[110px] overflow-auto text-sm leading-[1.7] whitespace-pre-wrap">
                      {activeTemplate}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mt-4 my-2">Edit Template:</h3>
                    <Textarea
                      {...register("message")}
                      className="bg-background text-accent-foreground rounded-md p-3 text-sm"
                      rows={14}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-3">
                      Edit the template in the textarea. All template variables (highlighted in blue
                      in the reference) must be preserved. if editing JSON arrays, ensure each items
                      is properly formatted as a string with quotes.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 my-3">
                    <Button
                      type="button"
                      onClick={handleReset}
                      variant="outline"
                      className="flex items-center bg-accent-foreground text-accent rounded-md px-5 text-sm hover:bg-accent-foreground/80"
                    >
                      Reset
                    </Button>
                    <Button type="submit" variant="default" className="flex items-center gap-1">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NewsTools;
