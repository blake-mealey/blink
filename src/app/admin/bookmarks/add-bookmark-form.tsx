import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addBookmarkAction } from './bookmarks-actions';
import { Button } from '@/components/ui/button';

export function AddBookmarkForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add new bookmark</CardTitle>
        <CardDescription>
          Add a new bookmark to your collection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={addBookmarkAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                required
                placeholder="https://example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="My Bookmark"
              />
            </div>

            <Button>Add</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
