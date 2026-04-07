"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HomepageSection, HomepageSectionType } from "@/types/homepage";
import { saveHomepageSections } from "@/app/actions/admin";

function SortableRow({
  section,
  onToggle,
}: {
  section: HomepageSection;
  onToggle: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3"
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground"
        {...attributes}
        {...listeners}
        aria-label="Drag handle"
      >
        ⋮⋮
      </button>
      <span className="text-sm font-medium capitalize">{section.type}</span>
      <span className="text-xs text-muted-foreground">order {section.order}</span>
      <label className="ml-auto flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={section.isVisible}
          onChange={() => onToggle(section.id)}
        />
        Visible
      </label>
    </div>
  );
}

export function HomepageSectionManager() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    void fetch("/api/homepage")
      .then((r) => r.json() as Promise<{ sections?: HomepageSection[] }>)
      .then((d) => setSections(d.sections ?? []));
  }, []);

  const onDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSections((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const next = arrayMove(items, oldIndex, newIndex).map((s, idx) => ({
        ...s,
        order: idx,
      }));
      return next;
    });
  }, []);

  const onToggle = useCallback((id: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      )
    );
  }, []);

  async function handleSave() {
    setStatus(null);
    try {
      await saveHomepageSections(sections);
      setStatus("Saved.");
    } catch {
      setStatus("Failed to save.");
    }
  }

  function addSection(type: HomepageSectionType) {
    const id = crypto.randomUUID();
    setSections((prev) => [
      ...prev,
      {
        id,
        type,
        order: prev.length,
        isVisible: true,
        data: {},
      },
    ]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => addSection("hero")}>
          + Hero
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => addSection("featured-collections")}
        >
          + Featured collections
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => addSection("featured-products")}
        >
          + Featured products
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => addSection("banner")}>
          + Banner
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => addSection("newsletter")}
        >
          + Newsletter
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sections.map((s) => (
              <SortableRow key={s.id} section={s} onToggle={onToggle} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <HeroEditor sections={sections} setSections={setSections} />
      <Button type="button" onClick={() => void handleSave()}>
        Save homepage
      </Button>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </div>
  );
}

function HeroEditor({
  sections,
  setSections,
}: {
  sections: HomepageSection[];
  setSections: React.Dispatch<React.SetStateAction<HomepageSection[]>>;
}) {
  const hero = sections.find((s) => s.type === "hero");
  if (!hero) return null;
  const heroId = hero.id;
  const data = (hero.data ?? {}) as Record<string, string>;

  function update(field: string, value: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === heroId
          ? { ...s, data: { ...((s.data ?? {}) as object), [field]: value } }
          : s
      )
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="font-medium">Hero content</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label htmlFor="headline">Headline</Label>
          <Input
            id="headline"
            value={data.headline ?? ""}
            onChange={(e) => update("headline", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="subheadline">Subheadline</Label>
          <Input
            id="subheadline"
            value={data.subheadline ?? ""}
            onChange={(e) => update("subheadline", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ctaText">CTA text</Label>
          <Input
            id="ctaText"
            value={data.ctaText ?? ""}
            onChange={(e) => update("ctaText", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ctaHref">CTA link</Label>
          <Input
            id="ctaHref"
            value={data.ctaHref ?? ""}
            onChange={(e) => update("ctaHref", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="bgImage">Background image URL</Label>
          <Input
            id="bgImage"
            value={data.bgImage ?? ""}
            onChange={(e) => update("bgImage", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
