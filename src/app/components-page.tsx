import { ContentWrapper } from '@/components/layout/content';
import { ThemeToggle } from '@/components/theme-toggle';
import { Caption1 } from '@/components/typography/caption1';
import { Header2 } from '@/components/typography/header2';
import { Subtitle3 } from '@/components/typography/subtitle3';
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
          <Header2>Nexty Hub</Header2>
          <Caption1>UI kit preview (shadcn + theme tokens)</Caption1>
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
                <Subtitle3>Movies</Subtitle3>
                <Caption1>12 items</Caption1>
              </div>
              <Badge>Shared</Badge>
            </CardHeader>
            <CardContent>
              <Caption1>Empty state goes here later.</Caption1>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="pt-3" value="done">
          <Caption1>No completed items yet.</Caption1>
        </TabsContent>
      </Tabs>
    </ContentWrapper>
  );
}
