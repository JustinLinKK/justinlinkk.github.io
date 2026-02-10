"use client";

import { Button } from "@heroui/react";

export default function HeroActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        as="a"
        href="/projects"
        color="primary"
        radius="full"
        className="bg-accent text-white"
      >
        View projects
      </Button>
      <Button
        as="a"
        href="/experience"
        variant="bordered"
        radius="full"
        className="border-ink/30"
      >
        Experience
      </Button>
    </div>
  );
}
