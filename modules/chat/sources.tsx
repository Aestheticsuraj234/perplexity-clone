import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Sources({ parts }: { parts: any[] }) {
  const sources = parts.filter((part) => part.type === "source-url");

  if (sources.length === 0) return null;

  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2">
      {sources.map((part) => (
        <a key={part.sourceId} href={part.url} target="_blank">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-sm normal-case tracking-normal">
                {part.title}
              </CardTitle>
              <CardDescription>
                {part.url ? new URL(part.url).hostname.replace("www.", "") : ""}
              </CardDescription>
            </CardHeader>
          </Card>
        </a>
      ))}
    </div>
  );
}
