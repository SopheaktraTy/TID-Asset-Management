import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, children, maxWidth = "max-w-[500px]" }: ModalProps) {
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Track where mousedown started so dragging from inside → backdrop doesn't close the modal
  const mouseDownOnBackdrop = React.useRef(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[4px] transition-all duration-300"
      onMouseDown={(e) => {
        // Only set the flag if mousedown lands directly on the backdrop
        mouseDownOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        // Only close if both mousedown AND mouseup (click) happened on the backdrop
        if (e.target === e.currentTarget && mouseDownOnBackdrop.current) {
          onClose();
        }
        mouseDownOnBackdrop.current = false;
      }}
    >
      <div
        className={`w-full ${maxWidth} bg-[var(--bg)] rounded-3xl shadow-2xl border border-[var(--border-color)] overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95 pointer-events-auto flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content with internal scroll */}
        <div className="flex-1 overflow-y-auto px-7 py-8 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
