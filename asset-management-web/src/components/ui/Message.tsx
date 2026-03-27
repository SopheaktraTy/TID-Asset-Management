import * as React from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

type MessageVariant = "error" | "success" | "info" | "warning";

interface MessageProps {
  variant?: MessageVariant;
  children: React.ReactNode;
  className?: string;
}

const variantConfig: Record<
  MessageVariant,
  {
    icon: React.ElementType;
    bg: string;
    border: string;
    text: string;
    iconColor: string;
  }
> = {
  error: {
    icon: XCircle,
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
    text: "#ef4444",
    iconColor: "#ef4444",
  },
  success: {
    icon: CheckCircle,
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.25)",
    text: "#22c55e",
    iconColor: "#22c55e",
  },
  info: {
    icon: Info,
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.25)",
    text: "#3b82f6",
    iconColor: "#3b82f6",
  },
  warning: {
    icon: AlertCircle,
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
    text: "#f59e0b",
    iconColor: "#f59e0b",
  },
};

/**
 * Reusable Message / Alert component.
 *
 * @example
 * <Message variant="error">Invalid credentials</Message>
 * <Message variant="success">Login successful!</Message>
 */
export const Message: React.FC<MessageProps> = ({
  variant = "info",
  children,
  className = "",
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm ${className}`}
      style={{
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
      }}
    >
      <Icon
        className="w-[18px] h-[18px] shrink-0 mt-[1px]"
        style={{ color: config.iconColor }}
      />
      <span className="leading-snug">{children}</span>
    </div>
  );
};
