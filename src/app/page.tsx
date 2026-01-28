import { Content } from '@/components/layout/content';
import { Stack } from '@/components/layout/stack';
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
    <Content>
      <Stack space={24}>
        <Stack align="center" direction="row" justify="between" space={16}>
          <Stack space={4}>
            <Title>Nexty Hub</Title>
            <Caption1>UI kit preview (shadcn + theme tokens)</Caption1>
          </Stack>
          <ThemeToggle />
        </Stack>

        <Card>
          <CardHeader>
            <CardTitle>Quick add</CardTitle>
            <CardDescription>Example form fields using the shared theme.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Title" />
            <Input placeholder="Image URL (optional)" />
            <Textarea placeholder="Description (optional)" />
            <Stack direction="row" space={8}>
              <Button>Add item</Button>
              <Button variant="secondary">Pick next</Button>
              <Button variant="outline">Cancel</Button>
            </Stack>
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
                <Stack space={4}>
                  <Subtitle3>Movies</Subtitle3>
                  <Caption1>12 items</Caption1>
                </Stack>
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
      </Stack>
    </Content>
  );
}
