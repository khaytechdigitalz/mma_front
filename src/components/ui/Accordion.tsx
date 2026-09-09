import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemData {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export function Accordion({
  items,
  defaultOpenId,
  className,
  itemClassName,
}: {
  items: AccordionItemData[];
  defaultOpenId?: string;
  className?: string;
  itemClassName?: string;
}) {
  const [openId, setOpenId] = useState<string | undefined>(defaultOpenId);

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={cn(
              "rounded-xl border border-gray-300 bg-white",
              itemClassName,
            )}
          >
            <button
              onClick={() => setOpenId(isOpen ? undefined : item.id)}
              className="text-gray-primary flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium"
            >
              {item.title}
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen && (
              <div className="text-gray-secondary border-t border-gray-200 px-5 py-4 text-sm leading-relaxed">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
