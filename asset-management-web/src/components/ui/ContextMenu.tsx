import React, { useRef, useEffect } from "react";
import { Portal } from "./Portal";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

export interface ContextMenuOption {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface ContextMenuProps {
  x: number;
  y: number;
  options: ContextMenuOption[];
  onClose: () => void;
  className?: string;
}

export function ContextMenu({ x, y, options, onClose, className = "" }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, onClose);

  // Prevent browser context menu within our custom menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Adjust position if menu goes off screen
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      if (x + rect.width > screenWidth) {
        menuRef.current.style.left = `${screenWidth - rect.width - 10}px`;
      } else {
        menuRef.current.style.left = `${x}px`;
      }

      if (y + rect.height > screenHeight) {
        menuRef.current.style.top = `${screenHeight - rect.height - 10}px`;
      } else {
        menuRef.current.style.top = `${y}px`;
      }
    }
  }, [x, y]);

  return (
    <Portal>
      <div
        ref={menuRef}
        onContextMenu={handleContextMenu}
        className={`fixed z-[10000] min-w-[170px] bg-[var(--bg)] border border-[var(--border-color)] rounded-xl shadow-2xl py-1.5 animate-in fade-in zoom-in duration-100 ease-out backdrop-blur-md ${className}`}
        style={{ top: y, left: x }}
      >
        {options.map((option, idx) => (
          <button
            key={`${option.label}-${idx}`}
            onClick={(e) => {
              e.stopPropagation();
              option.onClick();
              onClose();
            }}
            className={`w-[calc(100%-12px)] mx-1.5 flex items-center gap-2.5 px-3 py-2 text-[12px] font-bold rounded-lg transition-all duration-200 group
              ${option.variant === "danger" 
                ? "text-red-500 hover:bg-red-500/10" 
                : "text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
              }
            `}
          >
            <span className="flex-1 text-left tracking-tight">{option.label}</span>
          </button>
        ))}
      </div>
    </Portal>
  );
}
