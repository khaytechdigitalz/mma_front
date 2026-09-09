import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
}

export function Tabs({
  tabs,
  defaultTabId,
  tabListClassName,
  className,
}: {
  tabs: TabItem[];
  defaultTabId?: string;
  tabListClassName?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div className={className}>
      <div
        className={cn(
          "border-gray-tertiary/24 mb-6 flex flex-wrap gap-2 border-b",
          tabListClassName,
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={cn(
              "cursor-pointer border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              activeId === tab.id
                ? "border-primary-main text-primary-main"
                : "text-gray-secondary border-transparent hover:text-primary-main",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{active?.content}</div>
    </div>
  );
}
