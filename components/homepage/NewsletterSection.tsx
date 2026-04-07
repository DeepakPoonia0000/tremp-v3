import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterSection({
  data,
}: {
  data: {
    headline?: string;
    subtext?: string;
    placeholder?: string;
  };
}) {
  return (
    <section className="rounded-2xl border border-border bg-muted/50 px-6 py-12 text-center sm:px-12">
      <h2 className="text-2xl font-semibold">
        {data.headline ?? "Join the list"}
      </h2>
      <p className="mt-2 text-muted-foreground">
        {data.subtext ?? "Early access to drops and exclusive offers."}
      </p>
      <form className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          name="email"
          placeholder={data.placeholder ?? "Email address"}
          required
          className="flex-1"
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </section>
  );
}
