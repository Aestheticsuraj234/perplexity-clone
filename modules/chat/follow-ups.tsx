import { Button } from "@/components/ui/button";

export function FollowUps({
  parts,
  onPick,
  busy,
}: {
  parts: any[];
  onPick: (text: string) => void;
  busy: boolean;
}) {
  let questions: string[] = [];
  for (const part of parts) {
    if (part.type === "data-follow-ups") questions = part.data.questions;
  }

  if (questions.length === 0) return null;

  return (
    <div className="mt-4 flex flex-col gap-2">
      {questions.map((question) => (
        <Button
          key={question}
          variant="outline"
          disabled={busy}
          onClick={() => onPick(question)}
          className="h-auto justify-start whitespace-normal py-3 text-left font-normal normal-case tracking-normal"
        >
          {question}
        </Button>
      ))}
    </div>
  );
}
