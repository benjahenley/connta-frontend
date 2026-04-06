"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services/auth";
import { UsageStats, SubscriptionTier } from "@/types/auth";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { useUpgrade } from "@/components/providers/UpgradeProvider";

export function UsageIndicator() {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { openUpgradeModal } = useUpgrade();

  useEffect(() => {
    loadUsageStats();
  }, []);

  const loadUsageStats = async () => {
    try {
      const stats = await authService.getUsageStats();
      setUsageStats(stats);
    } catch (err) {
      console.error("Failed to load usage stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !usageStats) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  const { tier, usage, limits } = usageStats;
  const devUsage = usage.dev;
  const prodUsage = usage.prod;

  const getUsagePercentage = (current: number, limit: number | string) => {
    if (limit === "unlimited") return 0;
    if (typeof limit === "number") {
      return Math.round((current / limit) * 100);
    }
    return 0;
  };

  const devPercentage = getUsagePercentage(devUsage.current, devUsage.limit);
  const prodPercentage =
    prodUsage.limit !== "not_allowed"
      ? getUsagePercentage(prodUsage.current, prodUsage.limit)
      : 0;

  const isNearLimit = (percentage: number) => percentage >= 80;

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-1">Monthly Usage</h3>
        <p className="text-xs text-muted-foreground">
          Plan: {tier} {limits.maxInvoicesPerMonth
            ? `(${limits.maxInvoicesPerMonth} invoices/month)`
            : "(Unlimited)"}
        </p>
      </div>

      {/* TEST Environment Usage */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">TEST Environment</span>
          <span className="text-sm text-muted-foreground">
            {devUsage.current} / {devUsage.limit === "unlimited" ? "∞" : devUsage.limit}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isNearLimit(devPercentage)
                ? "bg-orange-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${Math.min(devPercentage, 100)}%` }}
          />
        </div>
        {isNearLimit(devPercentage) && (
          <p className="text-xs text-orange-600 mt-1">
            ⚠️ You&apos;ve used {devPercentage}% of your limit
          </p>
        )}
      </div>

      {/* PROD Environment Usage */}
      {prodUsage.limit !== "not_allowed" ? (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">PRODUCTION Environment</span>
            <span className="text-sm text-muted-foreground">
              {prodUsage.current} /{" "}
              {prodUsage.limit === "unlimited" ? "∞" : prodUsage.limit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isNearLimit(prodPercentage)
                  ? "bg-orange-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(prodPercentage, 100)}%` }}
            />
          </div>
          {isNearLimit(prodPercentage) && (
            <p className="text-xs text-orange-600 mt-1">
              ⚠️ You&apos;ve used {prodPercentage}% of your limit
            </p>
          )}
        </div>
      ) : (
        <Alert>
          <p className="text-xs mb-2">
            🔒 Production access requires STARTER plan or higher
          </p>
          <button
            onClick={() => openUpgradeModal(SubscriptionTier.STARTER)}
            className="text-xs font-semibold underline"
            style={{ color: "#27a0c9" }}>
            Actualizar plan →
          </button>
        </Alert>
      )}

      {(devPercentage >= 100 || prodPercentage >= 100) && (
        <Alert variant="destructive">
          <p className="text-sm font-medium">Limit Reached</p>
          <p className="text-xs mt-1 mb-2">
            You&apos;ve reached your monthly invoice limit. Please upgrade your plan
            or wait until next month.
          </p>
          <button
            onClick={() => openUpgradeModal()}
            className="text-xs font-semibold underline">
            Ver planes →
          </button>
        </Alert>
      )}
    </Card>
  );
}
