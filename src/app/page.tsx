import { Content } from '@/components/layout/content';
import { FlexBox } from '@/components/layout/flex-box';
import { ThemeToggle } from '@/components/theme-toggle';
import { Caption1 } from '@/components/typography/caption1';
import { Subtitle3 } from '@/components/typography/subtitle3';
import { Title } from '@/components/typography/title';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function Home() {
  return (
    <Content className="flex flex-col gap-6">
      <FlexBox align="center" justify="between">
        <FlexBox direction="col" gap="xs">
          <Title>Nexty Hub</Title>
          <Caption1>UI kit preview (shadcn + theme tokens)</Caption1>
        </FlexBox>
        <ThemeToggle />
      </FlexBox>

      <Card>
        <CardHeader>
          <CardTitle>Quick add</CardTitle>
          <CardDescription>Example form fields using the shared theme.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Title" />
          <Input placeholder="Image URL (optional)" />
          <Textarea placeholder="Description (optional)" />
          <FlexBox gap="sm">
            <Button>Add item</Button>
            <Button variant="secondary">Pick next</Button>
            <Button variant="outline">Cancel</Button>
          </FlexBox>
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
              <FlexBox direction="col" gap="xs">
                <Subtitle3>Movies</Subtitle3>
                <Caption1>12 items</Caption1>
              </FlexBox>
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
    </Content>
  );
}
