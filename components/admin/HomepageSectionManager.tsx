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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProductSelector } from "@/components/admin/ProductSelector";
import { CollectionSelector } from "@/components/admin/CollectionSelector";
import { BlogSelector } from "@/components/admin/BlogSelector";
import type { HomepageSection, HomepageSectionType } from "@/types/homepage";
import { saveHomepageSections } from "@/app/actions/admin";

function SortableRow({
  section,
  onToggle,
  onEdit,
  onDelete,
  isEditing,
}: {
  section: HomepageSection;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
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
      className={`flex flex-wrap items-center gap-3 rounded-lg border p-3 ${
        isEditing ? 'border-primary bg-primary/5' : 'border-border bg-card'
      }`}
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
      <div className="ml-auto flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={isEditing ? "default" : "outline"}
          onClick={() => onEdit(section.id)}
        >
          {isEditing ? "Editing" : "Edit"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={() => onDelete(section.id)}
        >
          Delete
        </Button>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={section.isVisible}
            onChange={() => onToggle(section.id)}
          />
          Visible
        </label>
      </div>
    </div>
  );
}

export function HomepageSectionManager() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
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

  const onEdit = useCallback((id: string) => {
    setEditingSectionId(editingSectionId === id ? null : id);
  }, [editingSectionId]);

  const onDelete = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    if (editingSectionId === id) {
      setEditingSectionId(null);
    }
  }, [editingSectionId]);

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
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => addSection("testimonials")}
        >
          + Testimonials
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => addSection("categories")}
        >
          + Categories
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => addSection("stats")}
        >
          + Stats
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => addSection("cta")}
        >
          + CTA
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => addSection("blog-posts")}
        >
          + Blog Posts
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
              <SortableRow 
                key={s.id} 
                section={s} 
                onToggle={onToggle} 
                onEdit={onEdit}
                onDelete={onDelete}
                isEditing={editingSectionId === s.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {/* Inline editor for the currently editing section */}
      {editingSectionId && (
        <div className="space-y-4">
          {sections.find(s => s.id === editingSectionId)?.type === "hero" && (
            <HeroEditor sections={sections} setSections={setSections} sectionId={editingSectionId} />
          )}
          {sections.find(s => s.id === editingSectionId)?.type === "featured-products" && (
            <FeaturedProductsEditor sections={sections} setSections={setSections} sectionId={editingSectionId} />
          )}
          {sections.find(s => s.id === editingSectionId)?.type === "featured-collections" && (
            <FeaturedCollectionsEditor sections={sections} setSections={setSections} sectionId={editingSectionId} />
          )}
          {sections.find(s => s.id === editingSectionId)?.type === "banner" && (
            <BannerEditor sections={sections} setSections={setSections} sectionId={editingSectionId} />
          )}
          {sections.find(s => s.id === editingSectionId)?.type === "newsletter" && (
            <NewsletterEditor sections={sections} setSections={setSections} sectionId={editingSectionId} />
          )}
          {sections.find(s => s.id === editingSectionId)?.type === "testimonials" && (
            <TestimonialsEditor sections={sections} setSections={setSections} sectionId={editingSectionId} />
          )}
          {sections.find(s => s.id === editingSectionId)?.type === "categories" && (
            <CategoriesEditor sections={sections} setSections={setSections} sectionId={editingSectionId} />
          )}
          {sections.find(s => s.id === editingSectionId)?.type === "stats" && (
            <StatsEditor sections={sections} setSections={setSections} sectionId={editingSectionId} />
          )}
          {sections.find(s => s.id === editingSectionId)?.type === "cta" && (
            <CTAEditor sections={sections} setSections={setSections} sectionId={editingSectionId} />
          )}
          {sections.find(s => s.id === editingSectionId)?.type === "blog-posts" && (
            <BlogPostsEditor sections={sections} setSections={setSections} sectionId={editingSectionId} />
          )}
        </div>
      )}
      
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
  sectionId,
}: {
  sections: HomepageSection[];
  setSections: React.Dispatch<React.SetStateAction<HomepageSection[]>>;
  sectionId: string;
}) {
  const hero = sections.find((s) => s.id === sectionId);
  if (!hero) return null;
  const data = (hero.data ?? {}) as Record<string, string>;

  function update(field: string, value: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
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

function FeaturedProductsEditor({
  sections,
  setSections,
  sectionId,
}: {
  sections: HomepageSection[];
  setSections: React.Dispatch<React.SetStateAction<HomepageSection[]>>;
  sectionId: string;
}) {
  const featuredProducts = sections.find((s) => s.id === sectionId);
  if (!featuredProducts) return null;
  const data = (featuredProducts.data ?? {}) as Record<string, unknown>;

  function update(field: string, value: unknown) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, data: { ...((s.data ?? {}) as object), [field]: value } }
          : s
      )
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="font-medium">Featured Products Settings</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label htmlFor="limit">Number of products to show</Label>
          <Input
            id="limit"
            type="number"
            value={(data.limit as number) ?? 8}
            onChange={(e) => update("limit", Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="tag">Filter by tag (optional)</Label>
          <Input
            id="tag"
            value={(data.tag as string) ?? ""}
            onChange={(e) => update("tag", e.target.value)}
            placeholder="e.g., new, sale, featured"
          />
        </div>
      </div>
      <div className="mt-4">
        <Label>Product Selection</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Select specific products to feature, or leave empty to show the latest products.
        </p>
        <ProductSelector
          selectedIds={(data.productIds as string[]) ?? []}
          onSelectionChange={(ids) => update("productIds", ids)}
          maxSelections={(data.limit as number) ?? 8}
        />
      </div>
    </div>
  );
}

function FeaturedCollectionsEditor({
  sections,
  setSections,
  sectionId,
}: {
  sections: HomepageSection[];
  setSections: React.Dispatch<React.SetStateAction<HomepageSection[]>>;
  sectionId: string;
}) {
  const featuredCollections = sections.find((s) => s.id === sectionId);
  if (!featuredCollections) return null;
  const data = (featuredCollections.data ?? {}) as Record<string, unknown>;

  function update(field: string, value: unknown) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, data: { ...((s.data ?? {}) as object), [field]: value } }
          : s
      )
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="font-medium">Featured Collections Settings</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label htmlFor="collectionLimit">Number of collections to show</Label>
          <Input
            id="collectionLimit"
            type="number"
            value={(data.limit as number) ?? 6}
            onChange={(e) => update("limit", Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="collectionTitle">Section Title</Label>
          <Input
            id="collectionTitle"
            value={(data.title as string) ?? "Featured Collections"}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4">
        <Label>Collection Selection</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Select specific collections to feature, or leave empty to show the latest collections.
        </p>
        <CollectionSelector
          selectedIds={(data.collectionIds as string[]) ?? []}
          onSelectionChange={(ids) => update("collectionIds", ids)}
          maxSelections={(data.limit as number) ?? 6}
        />
      </div>
    </div>
  );
}

function BannerEditor({
  sections,
  setSections,
  sectionId,
}: {
  sections: HomepageSection[];
  setSections: React.Dispatch<React.SetStateAction<HomepageSection[]>>;
  sectionId: string;
}) {
  const banner = sections.find((s) => s.id === sectionId);
  if (!banner) return null;
  const data = (banner.data ?? {}) as Record<string, string>;

  function update(field: string, value: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, data: { ...((s.data ?? {}) as object), [field]: value } }
          : s
      )
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="font-medium">Banner Settings</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="bannerTitle">Banner Title</Label>
          <Input
            id="bannerTitle"
            value={data.title ?? ""}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="bannerText">Banner Text</Label>
          <Input
            id="bannerText"
            value={data.text ?? ""}
            onChange={(e) => update("text", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bannerCta">CTA Button Text</Label>
          <Input
            id="bannerCta"
            value={data.ctaText ?? ""}
            onChange={(e) => update("ctaText", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bannerLink">CTA Link</Label>
          <Input
            id="bannerLink"
            value={data.ctaLink ?? ""}
            onChange={(e) => update("ctaLink", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="bannerImage">Background Image URL</Label>
          <Input
            id="bannerImage"
            value={data.bgImage ?? ""}
            onChange={(e) => update("bgImage", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function NewsletterEditor({
  sections,
  setSections,
  sectionId,
}: {
  sections: HomepageSection[];
  setSections: React.Dispatch<React.SetStateAction<HomepageSection[]>>;
  sectionId: string;
}) {
  const newsletter = sections.find((s) => s.id === sectionId);
  if (!newsletter) return null;
  const data = (newsletter.data ?? {}) as Record<string, string>;

  function update(field: string, value: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, data: { ...((s.data ?? {}) as object), [field]: value } }
          : s
      )
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="font-medium">Newsletter Settings</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="newsletterTitle">Section Title</Label>
          <Input
            id="newsletterTitle"
            value={data.title ?? "Subscribe to Our Newsletter"}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="newsletterDescription">Description</Label>
          <Input
            id="newsletterDescription"
            value={data.description ?? "Get the latest updates and offers"}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="newsletterPlaceholder">Placeholder Text</Label>
          <Input
            id="newsletterPlaceholder"
            value={data.placeholder ?? "Enter your email"}
            onChange={(e) => update("placeholder", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="newsletterButton">Button Text</Label>
          <Input
            id="newsletterButton"
            value={data.buttonText ?? "Subscribe"}
            onChange={(e) => update("buttonText", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function TestimonialsEditor({
  sections,
  setSections,
  sectionId,
}: {
  sections: HomepageSection[];
  setSections: React.Dispatch<React.SetStateAction<HomepageSection[]>>;
  sectionId: string;
}) {
  const testimonials = sections.find((s) => s.id === sectionId);
  if (!testimonials) return null;
  const data = (testimonials.data ?? {}) as Record<string, string>;

  function update(field: string, value: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, data: { ...((s.data ?? {}) as object), [field]: value } }
          : s
      )
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="font-medium">Testimonials Settings</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="testimonialsTitle">Section Title</Label>
          <Input
            id="testimonialsTitle"
            value={data.title ?? "What Our Customers Say"}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="testimonialsLimit">Number of testimonials to show</Label>
          <Input
            id="testimonialsLimit"
            type="number"
            value={(data.limit as string) ?? "3"}
            onChange={(e) => update("limit", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="testimonialsLayout">Layout Style</Label>
          <Input
            id="testimonialsLayout"
            value={data.layout ?? "grid"}
            onChange={(e) => update("layout", e.target.value)}
            placeholder="grid, carousel, etc."
          />
        </div>
      </div>
    </div>
  );
}

function CategoriesEditor({
  sections,
  setSections,
  sectionId,
}: {
  sections: HomepageSection[];
  setSections: React.Dispatch<React.SetStateAction<HomepageSection[]>>;
  sectionId: string;
}) {
  const categories = sections.find((s) => s.id === sectionId);
  if (!categories) return null;
  const data = (categories.data ?? {}) as Record<string, string>;

  function update(field: string, value: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, data: { ...((s.data ?? {}) as object), [field]: value } }
          : s
      )
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="font-medium">Categories Settings</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="categoriesTitle">Section Title</Label>
          <Input
            id="categoriesTitle"
            value={data.title ?? "Shop by Category"}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="categoriesLimit">Number of categories to show</Label>
          <Input
            id="categoriesLimit"
            type="number"
            value={(data.limit as string) ?? "8"}
            onChange={(e) => update("limit", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="categoriesLayout">Layout Style</Label>
          <Input
            id="categoriesLayout"
            value={data.layout ?? "grid"}
            onChange={(e) => update("layout", e.target.value)}
            placeholder="grid, list, etc."
          />
        </div>
      </div>
    </div>
  );
}

function StatsEditor({
  sections,
  setSections,
  sectionId,
}: {
  sections: HomepageSection[];
  setSections: React.Dispatch<React.SetStateAction<HomepageSection[]>>;
  sectionId: string;
}) {
  const stats = sections.find((s) => s.id === sectionId);
  if (!stats) return null;
  const data = (stats.data ?? {}) as Record<string, string>;

  function update(field: string, value: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, data: { ...((s.data ?? {}) as object), [field]: value } }
          : s
      )
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="font-medium">Stats Settings</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="statsTitle">Section Title</Label>
          <Input
            id="statsTitle"
            value={data.title ?? "Our Achievements"}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="stat1Number">Stat 1 Number</Label>
          <Input
            id="stat1Number"
            value={data.stat1Number ?? "1000+"}
            onChange={(e) => update("stat1Number", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="stat1Label">Stat 1 Label</Label>
          <Input
            id="stat1Label"
            value={data.stat1Label ?? "Happy Customers"}
            onChange={(e) => update("stat1Label", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="stat2Number">Stat 2 Number</Label>
          <Input
            id="stat2Number"
            value={data.stat2Number ?? "50+"}
            onChange={(e) => update("stat2Number", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="stat2Label">Stat 2 Label</Label>
          <Input
            id="stat2Label"
            value={data.stat2Label ?? "Products"}
            onChange={(e) => update("stat2Label", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function CTAEditor({
  sections,
  setSections,
  sectionId,
}: {
  sections: HomepageSection[];
  setSections: React.Dispatch<React.SetStateAction<HomepageSection[]>>;
  sectionId: string;
}) {
  const cta = sections.find((s) => s.id === sectionId);
  if (!cta) return null;
  const data = (cta.data ?? {}) as Record<string, string>;

  function update(field: string, value: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, data: { ...((s.data ?? {}) as object), [field]: value } }
          : s
      )
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="font-medium">CTA Section Settings</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="ctaHeadline">Headline</Label>
          <Input
            id="ctaHeadline"
            value={data.headline ?? "Ready to Get Started?"}
            onChange={(e) => update("headline", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="ctaDescription">Description</Label>
          <Input
            id="ctaDescription"
            value={data.description ?? "Join thousands of satisfied customers today"}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ctaButtonText">Button Text</Label>
          <Input
            id="ctaButtonText"
            value={data.buttonText ?? "Get Started"}
            onChange={(e) => update("buttonText", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ctaButtonLink">Button Link</Label>
          <Input
            id="ctaButtonLink"
            value={data.buttonLink ?? "/products"}
            onChange={(e) => update("buttonLink", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="ctaBackground">Background Color</Label>
          <Input
            id="ctaBackground"
            value={data.backgroundColor ?? "#f8f9fa"}
            onChange={(e) => update("backgroundColor", e.target.value)}
            placeholder="#f8f9fa"
          />
        </div>
      </div>
    </div>
  );
}

function BlogPostsEditor({
  sections,
  setSections,
  sectionId,
}: {
  sections: HomepageSection[];
  setSections: React.Dispatch<React.SetStateAction<HomepageSection[]>>;
  sectionId: string;
}) {
  const blogPosts = sections.find((s) => s.id === sectionId);
  if (!blogPosts) return null;
  const data = (blogPosts.data ?? {}) as Record<string, unknown>;

  function update(field: string, value: string | unknown) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, data: { ...((s.data ?? {}) as object), [field]: value } }
          : s
      )
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="font-medium">Blog Posts Settings</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="blogTitle">Section Title</Label>
          <Input
            id="blogTitle"
            value={(data.title as string) ?? "Latest from Our Blog"}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="blogLimit">Number of posts to show</Label>
          <Input
            id="blogLimit"
            type="number"
            value={String(data.limit ?? "3")}
            onChange={(e) => update("limit", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="blogCategory">Filter by category (optional)</Label>
          <Input
            id="blogCategory"
            value={(data.category as string) ?? ""}
            onChange={(e) => update("category", e.target.value)}
            placeholder="Leave empty for all posts"
          />
        </div>
      </div>
      <div className="mt-4">
        <Label>Blog Selection</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Select specific blog posts to feature, or leave empty to show the latest posts.
        </p>
        <BlogSelector
          selectedIds={(data.blogIds as string[] | undefined) ?? []}
          onSelectionChange={(ids) => update("blogIds", ids)}
          maxSelections={Number(data.limit) ?? 3}
          showPublishedOnly={true}
        />
      </div>
    </div>
  );
}
