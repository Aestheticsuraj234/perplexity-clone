"use client";

import { useState } from "react";
import {
  ArrowUpIcon,
  ImageIcon,
  PaperclipIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SearchIcon } from "@hugeicons/core-free-icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SearchBox({
  mode,
  setMode,
  onSubmit,
  busy,
}: {
  mode: string;
  setMode: (mode: string) => void;
  onSubmit: (text: string) => void;
  busy: boolean;
}) {
  const [text, setText] = useState("");

  function submit() {
    if (!text.trim() || busy) return;
    onSubmit(text.trim());
    setText("");
  }

  return (
    <InputGroup>
      <InputGroupTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={
          mode === "image" ? "Describe an image..." : "Ask anything..."
        }
      />
      <InputGroupAddon align="block-end" className="justify-between">
        <Tooltip>
          <TooltipTrigger
            render={
              <InputGroupButton disabled size="icon-xs" aria-label="Attach file" />
            }
          >
            <HugeiconsIcon icon={PaperclipIcon} strokeWidth={2} />
          </TooltipTrigger>
          <TooltipContent>File upload comes later</TooltipContent>
        </Tooltip>
        <div className="flex items-center gap-2">
          <ToggleGroup
            value={[mode]}
            onValueChange={(value) => {
              if (value[0]) setMode(value[0]);
            }}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="search">
              <HugeiconsIcon icon={SearchIcon} strokeWidth={2} data-icon="inline-start" />
              Search
            </ToggleGroupItem>
            <ToggleGroupItem value="image">
              <HugeiconsIcon icon={ImageIcon} strokeWidth={2} data-icon="inline-start" />
              Image
            </ToggleGroupItem>
          </ToggleGroup>
          <InputGroupButton
            variant="default"
            size="icon-xs"
            onClick={submit}
            disabled={!text.trim() || busy}
            aria-label="Submit"
          >
            <HugeiconsIcon icon={ArrowUpIcon} strokeWidth={2} />
          </InputGroupButton>
        </div>
      </InputGroupAddon>
    </InputGroup>
  );
}
