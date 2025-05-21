"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Battlers } from "@/types";
import { ATTRIBUTE_CATEGORIES } from "@/config";
import { motion } from "framer-motion";
import { Activity, Mic, PenTool, User } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { AttributeTabsContent } from "@/components/pages/battlers/details/AttributeTabsContent";
import { useBattler } from "@/contexts/battler.context";
import { fadeIn } from "@/lib/static/framer-motion";
import { Button } from "@/components/ui/button";
import AutoComplete from "@/components/auto-complete";
import ComparisonView from "./ComparisonView";

const tabs = [
  {
    value: ATTRIBUTE_CATEGORIES.WRITING,
    title: "Writing",
    description: "Ability to write impactful and complex rhymes",
    gradientFrom: "indigo-500",
    gradientTo: "purple-500",
    colorText: "primary",
  },
  {
    value: ATTRIBUTE_CATEGORIES.PERFORMANCE,
    title: "Performance",
    description: "Delivery, cadence, and stage presence",
    gradientFrom: "blue-500",
    gradientTo: "cyan-500",
    colorText: "success",
  },
  {
    value: ATTRIBUTE_CATEGORIES.PERSONAL,
    title: "Personal",
    description: "Character, reputation, and battle approach",
    gradientFrom: "amber-500",
    gradientTo: "orange-500",
    colorText: "amber-500",
  },
];

export default function AttributesTab() {
  const {
    battlerData,
    battlersData,
    selectedBattler,
    // Actions
    setSearchQuery,
    setSelectedBattler,
  } = useBattler();

  return (
    <div>
      <Tabs defaultValue="writing" className="w-full">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <div className="w-full max-w-[400px] sm:max-w-full overflow-x-auto mb-6">
            <TabsList className="mb-6">
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TabsList>
                  <TabsTrigger value="writing" className="data-[state=active]:text-primary">
                    <PenTool className="h-4 w-4 mr-2" />
                    Writing
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="data-[state=active]:text-success">
                    <Mic className="h-4 w-4 mr-2" />
                    Performance
                  </TabsTrigger>
                  <TabsTrigger value="personal" className="data-[state=active]:text-amber-400">
                    <User className="h-4 w-4 mr-2" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger
                    value="comparison"
                    className="data-[state=active]:text-primary-foreground"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Comparison
                  </TabsTrigger>
                </TabsList>
              </motion.div>
            </TabsList>
          </div>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <AttributeTabsContent
                value={tab.value}
                title={tab.title}
                description={tab.description}
                gradientFrom={tab.gradientFrom}
                gradientTo={tab.gradientTo}
                colorText={tab.colorText}
              />
            </TabsContent>
          ))}

          <TabsContent value="comparison">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary-foreground">Comparison</h2>
                  <p className="text-muted-foreground">Compare with other battlers</p>
                </div>

                <div className="w-full md:w-auto flex flex-col sm:flex-row sm:items-center gap-2 text-muted text-nowrap">
                  <span className="text-muted-foreground">Compare with:</span>
                  <div className="w-full md:w-auto">
                    <AutoComplete
                      placeholderText={selectedBattler?.name || "Select battler..."}
                      options={battlersData}
                      setSearchQuery={setSearchQuery}
                      selectedOption={selectedBattler as Battlers}
                      setSelectedOption={(value) => setSelectedBattler(value as Battlers)}
                    />
                  </div>
                </div>
              </div>
              {selectedBattler ? (
                <ComparisonView />
              ) : (
                <div className="bg-muted border border-border rounded-lg p-8 text-center">
                  <div className="text-muted-foreground mb-4">
                    {`Select a battler to compare with ${battlerData?.name}`}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {battlersData.slice(0, 5).map((battler) => (
                      <Button
                        key={battler.name}
                        variant="outline"
                        className="border-muted-foreground text-accent-foreground hover:bg-accent"
                        onClick={() => {
                          setSelectedBattler(battler);
                        }}
                      >
                        {battler.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </motion.div>
      </Tabs>{" "}
    </div>
  );
}
