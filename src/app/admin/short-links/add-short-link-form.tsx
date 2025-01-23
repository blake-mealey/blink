'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { addShortLinkAction } from './short-links-actions';

export function AddShortLinkForm() {
  const [nameType, setNameType] = useState('random');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add new short link</CardTitle>
        <CardDescription>
          Add a new short link with either a random name or a chosen one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={addShortLinkAction}>
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
              <Label>Name</Label>
              <RadioGroup
                name="name-type"
                className="border border-border rounded-md gap-0"
                value={nameType}
                onValueChange={(value) => setNameType(value)}
              >
                <Label className="p-4">
                  <div className="flex items-center gap-x-2">
                    <RadioGroupItem value="random" />
                    Random
                  </div>
                </Label>
                <Separator />
                <Label className="p-4 grid gap-4">
                  <div className="flex items-center gap-x-2">
                    <RadioGroupItem value="chosen" />
                    Chosen
                  </div>
                  <div className="grid gap-2">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      disabled={nameType !== 'chosen'}
                      placeholder="my-link"
                    />
                  </div>
                </Label>
              </RadioGroup>
            </div>

            <Button>Add</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
