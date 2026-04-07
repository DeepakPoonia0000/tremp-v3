"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (typeof window !== "undefined") {
    console.error(error);
  }

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4 text-neutral-50">
        <h1 className="text-xl font-semibold">Tremp — unexpected error</h1>
        <p className="mt-2 max-w-md text-center text-sm text-neutral-400">
          {error.message}
          {error.digest ? (
            <span className="mt-2 block text-xs">Ref: {error.digest}</span>
          ) : null}
        </p>
        <button
          type="button"
          className="mt-6 rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-950"
          onClick={() => reset()}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
