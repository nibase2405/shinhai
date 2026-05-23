import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FilterSidebar({
  title,
  groups
}: {
  title: string;
  groups: Array<{ label: string; options: string[] }>;
}) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {groups.map((group) => (
          <div key={group.label} className="space-y-2">
            <p className="text-sm font-medium">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => (
                <Badge key={option} variant="outline">
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
