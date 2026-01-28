import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Nexty Hub</h1>
          <p className="text-sm text-muted-foreground">UI kit preview (shadcn + theme tokens)</p>
        </div>
        <ThemeToggle />
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Quick add</CardTitle>
          <CardDescription>Example form fields using the shared theme.</CardDescription>
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
        <TabsContent value="todo" className="pt-3">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Movies</CardTitle>
                <CardDescription>12 items</CardDescription>
              </div>
              <Badge>Shared</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Empty state goes here later.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="done" className="pt-3">
          <p className="text-sm text-muted-foreground">No completed items yet.</p>
        </TabsContent>
      </Tabs>
    </main>
  );
}
