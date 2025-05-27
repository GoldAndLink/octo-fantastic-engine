"use client";

/**
 * @fileoverview Credentials Manager Component
 * This component provides a UI for managing third-party service integrations
 * including Slack, GitHub, Jira, Salesforce, and AWS. It allows users to
 * configure and store credentials for each service.
 */

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Github, Slack } from "lucide-react";
import { useState } from "react";

/**
 * Represents a third-party service that can be integrated
 */
interface Service {
  /** Unique identifier for the service */
  id: string;
  /** Display name of the service */
  name: string;
  /** Icon component to display for the service */
  icon: React.ReactNode;
  /** Whether the service is currently connected */
  connected: boolean;
  /** Configuration fields required for the service */
  fields: Field[];
}

/**
 * Represents a configuration field for a service
 */
interface Field {
  /** Unique identifier for the field */
  id: string;
  /** Display label for the field */
  label: string;
  /** Input type (text, password, email) */
  type: string;
  /** Placeholder text to show when empty */
  placeholder: string;
  /** Current value of the field */
  value: string;
}

/**
 * CredentialsManager Component
 * Provides a UI for managing third-party service integrations.
 * Users can configure and connect to various services like Slack, GitHub, Jira, etc.
 */
export function CredentialsManager() {
  // State for all available services and their configurations
  const [services, setServices] = useState<Service[]>([
    {
      id: "slack",
      name: "Slack",
      icon: <Slack className="h-5 w-5" />,
      connected: true,
      fields: [
        {
          id: "workspace_url",
          label: "Workspace URL",
          type: "text",
          placeholder: "your-workspace.slack.com",
          value: "acme-corp.slack.com",
        },
        {
          id: "oauth_token",
          label: "Bot User OAuth Token",
          type: "password",
          placeholder: "xoxb-...",
          value: "xoxb-************",
        },
        {
          id: "signing_secret",
          label: "Signing Secret",
          type: "password",
          placeholder: "********",
          value: "********",
        },
      ],
    },
    {
      id: "github",
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      connected: false,
      fields: [
        {
          id: "api_url",
          label: "API URL",
          type: "text",
          placeholder: "https://api.github.com",
          value: "",
        },
        {
          id: "access_token",
          label: "Personal Access Token",
          type: "password",
          placeholder: "ghp_...",
          value: "",
        },
      ],
    },
    {
      id: "jira",
      name: "Jira",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.517a1.005 1.005 0 0 0-1.005-1.004Z"
            fill="#2684FF"
          />
          <path
            d="M17.723 5.261h-2.129V3.205A5.216 5.216 0 0 0 10.366 0v11.484a1.005 1.005 0 0 0 1.005 1.004h11.57A5.217 5.217 0 0 0 17.723 5.261Z"
            fill="#2684FF"
          />
          <path
            d="M10.366 11.484V0a5.216 5.216 0 0 0-5.228 5.216v2.056H3.01A5.215 5.215 0 0 0 0 12.488h11.371a1.005 1.005 0 0 1-1.005-1.004Z"
            fill="url(#a)"
            fillOpacity=".8"
          />
        </svg>
      ),
      connected: false,
      fields: [
        {
          id: "domain",
          label: "Jira Domain",
          type: "text",
          placeholder: "your-domain.atlassian.net",
          value: "",
        },
        {
          id: "email",
          label: "Email",
          type: "email",
          placeholder: "your-email@example.com",
          value: "",
        },
        {
          id: "api_token",
          label: "API Token",
          type: "password",
          placeholder: "********",
          value: "",
        },
      ],
    },
    {
      id: "salesforce",
      name: "Salesforce",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.816 5.976c.888-.6 1.968-.888 3.048-.888 1.776 0 3.408.888 4.392 2.304.84 1.176 1.176 2.616 1.032 4.056 1.032.6 1.728 1.728 1.728 3 0 1.92-1.56 3.48-3.48 3.48-.12 0-.24 0-.36-.024-.72 1.368-2.16 2.304-3.792 2.304-1.2 0-2.304-.48-3.096-1.32-.792.84-1.896 1.32-3.096 1.32-1.632 0-3.072-.936-3.792-2.304-.12.024-.24.024-.36.024-1.92 0-3.48-1.56-3.48-3.48 0-1.272.696-2.4 1.728-3-.144-1.44.192-2.88 1.032-4.056.984-1.416 2.616-2.304 4.392-2.304 1.08 0 2.16.288 3.048.888h.048Z"
            fill="#00A1E0"
          />
          <path
            d="M6.768 10.032c0-.12.096-.216.216-.216h1.608c.12 0 .216.096.216.216v4.176c0 .12-.096.216-.216.216H6.984c-.12 0-.216-.096-.216-.216v-4.176Zm4.608-2.304c0-.12.096-.216.216-.216h1.608c.12 0 .216.096.216.216v6.48c0 .12-.096.216-.216.216h-1.608c-.12 0-.216-.096-.216-.216v-6.48Zm4.608 1.152c0-.12.096-.216.216-.216h1.608c.12 0 .216.096.216.216v5.328c0 .12-.096.216-.216.216h-1.608c-.12 0-.216-.096-.216-.216V8.88Z"
            fill="#fff"
          />
        </svg>
      ),
      connected: false,
      fields: [
        {
          id: "instance_url",
          label: "Instance URL",
          type: "text",
          placeholder: "https://your-instance.salesforce.com",
          value: "",
        },
        {
          id: "client_id",
          label: "Client ID",
          type: "text",
          placeholder: "Client ID",
          value: "",
        },
        {
          id: "client_secret",
          label: "Client Secret",
          type: "password",
          placeholder: "********",
          value: "",
        },
        {
          id: "username",
          label: "Username",
          type: "text",
          placeholder: "your-username@example.com",
          value: "",
        },
        {
          id: "password",
          label: "Password",
          type: "password",
          placeholder: "********",
          value: "",
        },
      ],
    },
    {
      id: "aws",
      name: "AWS",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.373 13.114c0 .31.026.56.085.747.065.187.143.392.247.615a.275.275 0 0 1 .039.13.24.24 0 0 1-.117.195l-.39.26a.292.292 0 0 1-.156.052c-.065 0-.13-.026-.195-.078a2.214 2.214 0 0 1-.234-.243 4.026 4.026 0 0 1-.208-.313c-.52.624-.182 1.066-.39 1.326-.208.26-.494.39-.858.39-.247 0-.468-.078-.65-.234a1.61 1.61 0 0 1-.429-.65c-.104-.273-.156-.59-.156-.95 0-.52.13-.94.39-1.26.26-.325.624-.487 1.092-.487.156 0 .313.02.482.052.169.033.338.085.507.143v-.325c0-.338-.07-.573-.208-.708-.143-.143-.377-.208-.708-.208-.156 0-.312.02-.468.052a3.307 3.307 0 0 0-.468.13c-.13.052-.234.078-.312.078a.246.246 0 0 1-.247-.247v-.39c0-.078.013-.143.04-.182.025-.052.078-.091.155-.13.195-.1.429-.182.702-.247.273-.065.56-.104.86-.104.65 0 1.131.15 1.43.442.3.295.45.747.45 1.353v1.782h-.004Zm-1.972.845c.15 0 .307-.026.468-.085.169-.052.312-.156.429-.3.078-.104.13-.221.169-.364.039-.143.052-.312.052-.507v-.247a3.274 3.274 0 0 0-.429-.104 2.743 2.743 0 0 0-.429-.039c-.3 0-.52.065-.677.195-.156.13-.234.313-.234.56 0 .234.06.41.182.533.117.13.286.19.469.19v.168Zm3.627.767c-.104 0-.182-.02-.234-.065-.052-.039-.091-.13-.13-.234l-.728-2.398c-.039-.117-.052-.195-.052-.247 0-.104.052-.156.156-.156h.637c.13 0 .208.02.26.065.052.039.091.13.13.234l.52 2.047.481-2.047c.026-.117.065-.195.117-.234.052-.039.143-.065.26-.065h.52c.13 0 .208.02.26.065.052.039.091.13.117.234l.487 2.073.533-2.073c.04-.117.078-.195.13-.234.052-.039.143-.065.26-.065h.607c.104 0 .156.052.156.156 0 .026-.013.065-.013.104-.13.052-.26.104-.039.156l-.747 2.398c-.039.117-.078.195-.13.234-.052.039-.13.065-.234.065h-.56c-.13 0-.208-.02-.26-.065-.052-.039-.091-.13-.117-.234l-.481-2.008-.481 2.002c-.026.117-.065.195-.117.234-.052.039-.143.065-.26.065h-.559Zm5.599.195c-.234 0-.468-.026-.69-.078a2.565 2.565 0 0 1-.533-.169c-.104-.052-.169-.104-.195-.156a.397.397 0 0 1-.039-.156v-.403c0-.156.065-.234.182-.234.052 0 .104.013.156.026.052.013.13.039.208.065.156.065.325.117.494.143.169.026.338.04.507.04.27 0 .481-.047.624-.143a.47.47 0 0 0 .221-.416.423.423 0 0 0-.117-.3c-.078-.091-.221-.169-.429-.247l-.611-.195c-.312-.104-.546-.26-.702-.468a1.076 1.076 0 0 1-.234-.677c0-.195.04-.37.13-.52.091-.156.208-.286.351-.39.143-.104.312-.182.507-.234.195-.052.403-.078.611-.078.104 0 .221.007.325.02.117.013.221.033.325.052.104.026.195.052.286.078.091.026.156.065.208.091.091.052.156.104.195.156.039.052.052.13.052.208v.377c0 .156-.065.243-.182.243-.065 0-.169-.026-.286-.078a2.322 2.322 0 0 0-.884-.182c-.247 0-.442.04-.573.117a.394.394 0 0 0-.195.364c0 .13.047.234.143.312.095.078.247.156.455.234l.598.195c.312.104.533.247.676.429.143.182.208.39.208.624 0 .208-.04.39-.13.56-.091.169-.208.312-.364.429-.156.117-.338.208-.546.273a2.349 2.349 0 0 1-.677.091l.004-.007Z"
            fill="#252F3E"
          />
          <path
            d="M15.262 17.476c-1.847 1.365-4.531 2.086-6.839 2.086-3.231 0-6.137-1.196-8.34-3.185-.169-.156-.02-.372.195-.247 2.424 1.412 5.422 2.255 8.522 2.255 2.086 0 4.38-.429 6.488-1.326.325-.143.59.208.273.416h-.299Z"
            fill="#FF9900"
          />
          <path
            d="M16.042 16.573c-.234-.3-1.56-.143-2.151-.078-.182.026-.208-.13-.052-.247 1.053-.741 2.776-.52 2.971-.273.195.247-.052 1.976-1.04 2.802-.156.13-.3.065-.234-.104.234-.572.753-1.86.507-2.1Z"
            fill="#FF9900"
          />
        </svg>
      ),
      connected: false,
      fields: [
        {
          id: "access_key",
          label: "Access Key ID",
          type: "text",
          placeholder: "AKIA...",
          value: "",
        },
        {
          id: "secret_key",
          label: "Secret Access Key",
          type: "password",
          placeholder: "********",
          value: "",
        },
        {
          id: "region",
          label: "Region",
          type: "text",
          placeholder: "us-east-1",
          value: "",
        },
      ],
    },
  ]);

  // Currently selected service for configuration
  const [selectedService, setSelectedService] = useState<Service>(services[0]);

  /**
   * Updates the value of a specific field for the selected service
   * @param fieldId - ID of the field to update
   * @param value - New value for the field
   */
  const handleFieldChange = (fieldId: string, value: string) => {
    setSelectedService((prev) => {
      const updatedFields = prev.fields.map((field) =>
        field.id === fieldId ? { ...field, value } : field
      );
      return { ...prev, fields: updatedFields };
    });
  };

  /**
   * Saves the current configuration and marks the service as connected
   * Updates both the selected service and the services list
   */
  const handleSaveChanges = () => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === selectedService.id
          ? { ...service, connected: true, fields: selectedService.fields }
          : service
      )
    );

    setSelectedService((prev) => ({ ...prev, connected: true }));
  };

  return (
    <div className="flex gap-6">
      {/* Services list sidebar */}
      <div className="w-96 rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Third Party Services</h2>
        <div className="space-y-2">
          {services.map((service) => (
            <button
              key={service.id}
              className={`flex w-full items-center justify-between rounded-md px-4 py-3 text-left transition-colors ${
                selectedService.id === service.id
                  ? "bg-[#f7fcec]"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedService(service)}
            >
              <div className="flex items-center gap-3">
                {service.icon}
                <span>{service.name}</span>
              </div>
              {service.connected && (
                <CheckCircle className="h-5 w-5 text-[#447513]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Service configuration form */}
      <div className="flex-1 rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedService.icon}
            <h2 className="text-xl font-medium">
              {selectedService.name} Credentials
            </h2>
          </div>
          {/* Connection status indicator */}
          <div className="flex items-center gap-2">
            {selectedService.connected ? (
              <>
                <CheckCircle className="h-5 w-5 text-[#447513]" />
                <span className="text-[#447513]">Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span className="text-orange-500">Not Connected</span>
              </>
            )}
          </div>
        </div>

        {/* Service configuration fields */}
        <div className="space-y-4">
          {selectedService.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label htmlFor={field.id} className="block text-sm font-medium">
                {field.label}
              </label>
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className="w-full"
              />
            </div>
          ))}
        </div>

        {/* Save changes button */}
        <div className="mt-6">
          <Button
            onClick={handleSaveChanges}
            className="bg-black text-white hover:bg-gray-800"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
