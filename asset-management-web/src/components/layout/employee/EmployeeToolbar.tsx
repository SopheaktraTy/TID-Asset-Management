import { Search, Plus } from "lucide-react";
import { Button } from "../../ui/Button";
import { ColumnGridDropdown } from "../../ui/ColumnGridDropdown";


interface EmployeeToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  onAddClick: () => void;
  hiddenCols: Set<string>;
  onToggleColumn: (key: string) => void;
  onSetHiddenCols: (keys: Set<string>) => void;
  columnOptions: { key: string; label: string }[];
}

export default function EmployeeToolbar({
  search,
  onSearchChange,
  onAddClick,
  hiddenCols,
  onToggleColumn,
  onSetHiddenCols,
  columnOptions,
}: EmployeeToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[var(--border-color)]">
      <div className="relative flex-1 min-w-[200px] max-w-xs group">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none group-focus-within:text-[var(--color-growth-green)] transition-colors"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search team members"
          className="
            w-full pl-9 pr-4 py-2 text-xs
            bg-[var(--bg)] border border-[var(--border-color)] rounded-lg
            focus:outline-none focus:border-[var(--color-growth-green)]/50
            text-[var(--text-main)] placeholder:text-[var(--text-muted)]
            transition-all
          "
        />
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <ColumnGridDropdown
          columns={columnOptions}
          hiddenColumns={hiddenCols}
          onToggleColumn={onToggleColumn}
          onSetHiddenColumns={onSetHiddenCols}
          panelClassName="bg-[var(--bg)]"
        />
      </div>

      <Button
        onClick={onAddClick}
        variant="primary"
        className="!w-auto h-auto gap-1.5 px-4 py-2 text-xs font-bold"
      >
        <Plus size={15} />
        Add Employee
      </Button>
    </div>
  );
}
