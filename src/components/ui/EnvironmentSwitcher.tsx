"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services/auth";
import { Environment } from "@/types/auth";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

interface EnvironmentSwitcherProps {
  onEnvironmentChange?: (environment: Environment) => void;
}

export function EnvironmentSwitcher({
  onEnvironmentChange,
}: EnvironmentSwitcherProps) {
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment>(
    Environment.DEV
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load current environment on mount
  useEffect(() => {
    loadCurrentEnvironment();
  }, []);

  const loadCurrentEnvironment = async () => {
    try {
      const { environment } = await authService.getCurrentEnvironment();
      setCurrentEnvironment(environment);
    } catch (err) {
      console.error("Failed to load environment:", err);
    }
  };

  const handleSwitch = async (checked: boolean) => {
    const newEnvironment = checked ? Environment.PROD : Environment.DEV;
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.switchEnvironment(newEnvironment);
      setCurrentEnvironment(result.environment);

      if (onEnvironmentChange) {
        onEnvironmentChange(result.environment);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to switch environment"
      );
      // Revert to previous state
      setCurrentEnvironment(currentEnvironment);
    } finally {
      setIsLoading(false);
    }
  };

  const isProd = currentEnvironment === Environment.PROD;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isProd ? "bg-green-500 animate-pulse" : "bg-yellow-500"
            }`}
          />
          <div>
            <Label className="text-sm font-medium">
              {isProd ? "Production" : "Test"} Environment
            </Label>
            <p className="text-xs text-muted-foreground">
              {isProd
                ? "Live invoices - real ARCA submissions"
                : "Safe testing - no real ARCA submissions"}
            </p>
          </div>
        </div>
        <Switch
          checked={isProd}
          onCheckedChange={handleSwitch}
          disabled={isLoading}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      {!isProd && (
        <Alert>
          <p className="text-sm">
            🧪 You&apos;re in TEST mode. Invoices won&apos;t be submitted to ARCA.
          </p>
        </Alert>
      )}

      {isProd && (
        <Alert>
          <p className="text-sm">
            ⚠️ Production mode active. All invoices will be submitted to ARCA.
          </p>
        </Alert>
      )}
    </div>
  );
}
