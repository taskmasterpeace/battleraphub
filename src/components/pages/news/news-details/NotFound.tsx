import { useRouter } from "next/navigation";
import React from "react";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-background rounded-xl p-8 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Analysis Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The analysis you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/news")}
          className="bg-amber-400 hover:bg-amber-500 text-muted font-medium px-6 py-3 rounded-md transition-all duration-300"
        >
          Back to Analysis
        </button>
      </div>
    </div>
  );
};

export default NotFound;
