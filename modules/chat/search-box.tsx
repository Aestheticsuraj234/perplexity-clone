"use client";

import { useState } from "react";
import {
  ArrowUpIcon,
  BubbleChatIcon,
  ImageIcon,
  PaperclipIcon,
  SearchIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CHAT_MODELS, type ChatMode, type ChatModelId } from "@/lib/models";

export function SearchBox({
  mode,
  setMode,
  model,
  setModel,
  onSubmit,
  busy,
}: {
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  model: ChatModelId;
  setModel: (model: ChatModelId) => void;
  onSubmit: (text: string) => void;
  busy: boolean;
}) {
  const [text, setText] = useState("");

  function submit() {
    if (!text.trim() || busy) return;
    onSubmit(text.trim());
    setText("");
  }

  const placeholder =
    mode === "image"
      ? "Describe an image..."
      : mode === "search"
        ? "Search the web..."
        : "Ask anything...";

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
        placeholder={placeholder}
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
          {mode !== "image" ? (
            <Select
              value={model}
              onValueChange={(value) => {
                if (value) setModel(value as ChatModelId);
              }}
            >
              <SelectTrigger size="sm" aria-label="Model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {CHAT_MODELS.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          <ToggleGroup
            value={[mode]}
            onValueChange={(value) => {
              if (value[0]) setMode(value[0] as ChatMode);
            }}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="chat">
              <HugeiconsIcon icon={BubbleChatIcon} strokeWidth={2} data-icon="inline-start" />
              Chat
            </ToggleGroupItem>
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
