import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Textarea } from "@/ui/textarea";

type CorrectedTextPanelProps = {
  value: string;
};

export function CorrectedTextPanel({ value }: CorrectedTextPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Corrected text</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea readOnly value={value} className="min-h-80 resize-none" />
      </CardContent>
    </Card>
  );
}
