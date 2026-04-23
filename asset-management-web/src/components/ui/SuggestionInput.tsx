import * as React from "react";
import { Input } from "./BackgroundColorPlaceholder";

interface SuggestionInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestions: string[];
  onSuggestionSelect?: (value: string) => void;
}

export const SuggestionInput = React.forwardRef<HTMLInputElement, SuggestionInputProps>(
  ({ suggestions, onSuggestionSelect, value, onChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([]);
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);

    // Merge forwarded ref with local ref
    React.useImperativeHandle(ref, () => inputRef.current!);

    React.useEffect(() => {
      const val = typeof value === 'string' ? value : '';
      if (val.length > 0) {
        const filtered = suggestions.filter(s => 
          s.toLowerCase().includes(val.toLowerCase()) && 
          s.toLowerCase() !== val.toLowerCase()
        );
        setFilteredSuggestions(filtered);
        setIsOpen(filtered.length > 0);
      } else {
        // When empty, show all suggestions (or top 10)
        setFilteredSuggestions(suggestions);
        // Don't auto-open here, let onFocus handle it
      }
    }, [value, suggestions]);

    // Handle scrolling active item into view MANUALLY to avoid window jumping
    React.useEffect(() => {
      if (activeIndex >= 0 && listRef.current) {
        const container = listRef.current;
        const activeElement = container.children[0].children[activeIndex] as HTMLElement;
        
        if (activeElement) {
          const containerHeight = container.offsetHeight;
          const containerScrollTop = container.scrollTop;
          const elementOffsetTop = activeElement.offsetTop;
          const elementHeight = activeElement.offsetHeight;

          if (elementOffsetTop < containerScrollTop) {
            container.scrollTop = elementOffsetTop;
          } else if (elementOffsetTop + elementHeight > containerScrollTop + containerHeight) {
            container.scrollTop = elementOffsetTop + elementHeight - containerHeight;
          }
        }
      }
    }, [activeIndex]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || filteredSuggestions.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && activeIndex < filteredSuggestions.length) {
          e.preventDefault();
          selectSuggestion(filteredSuggestions[activeIndex]);
        }
      } else if (e.key === "Escape" || e.key === "Tab") {
        setIsOpen(false);
      }
    };

    const selectSuggestion = (suggestion: string) => {
      if (onSuggestionSelect) {
        onSuggestionSelect(suggestion);
      } else if (onChange) {
        const event = {
          target: { value: suggestion, name: props.name },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
      setIsOpen(false);
      setActiveIndex(-1);
    };

    return (
      <div className="relative w-full" ref={containerRef}>
        <Input
          {...props}
          ref={inputRef}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredSuggestions.length > 0) setIsOpen(true);
          }}
          onBlur={() => {
            // Delay closing to allow onClick on suggestions to fire
            setTimeout(() => setIsOpen(false), 200);
          }}
          autoComplete="off"
        />

        {isOpen && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-[150] p-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg)]/95 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200">
            <div 
              className="max-h-[160px] overflow-y-auto overflow-x-hidden no-scrollbar py-1"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
              ref={listRef}
            >
              <div className="flex flex-col gap-0.5">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`
                      w-full px-3 py-1.5 text-left text-[11px] rounded-lg transition-colors shrink-0
                      ${index === activeIndex ? "bg-[var(--color-growth-green)] text-black font-bold" : "text-[var(--text-main)] hover:bg-[var(--surface-hover)]/70"}
                    `}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

SuggestionInput.displayName = "SuggestionInput";
