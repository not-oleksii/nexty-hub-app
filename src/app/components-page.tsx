import { ThemeToggle } from '@/components/common/theme-toggle';
import { ContentWrapper } from '@/components/layout/content';
import { Caption } from '@/components/typography/caption';
import { Header } from '@/components/typography/header';
import { Subtitle } from '@/components/typography/subtitle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function ComponentsPage() {
  return (
    <ContentWrapper className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Header size="lg">Nexty Hub</Header>
          <Caption>UI kit preview (shadcn + theme tokens)</Caption>
        </div>
        <ThemeToggle />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick add</CardTitle>
          <CardDescription>
            Example form fields using the shared theme.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Title" />
          <Input placeholder="Image URL (optional)" />
          <Textarea placeholder="Description (optional)" />
          <div className="flex gap-2">
            <Button>Add item</Button>
            <Button variant="secondary">Pick next</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="todo">
        <TabsList>
          <TabsTrigger value="todo">TODO</TabsTrigger>
          <TabsTrigger value="done">DONE</TabsTrigger>
        </TabsList>

        <TabsContent className="pt-3" value="todo">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div className="flex flex-col gap-1">
                <Subtitle size="sm">Movies</Subtitle>
                <Caption>12 items</Caption>
              </div>
              <Badge>Shared</Badge>
            </CardHeader>
            <CardContent>
              <Caption>Empty state goes here later.</Caption>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="pt-3" value="done">
          <Caption>No completed items yet.</Caption>
        </TabsContent>
      </Tabs>
    </ContentWrapper>
  );
}
