import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-muted/30 px-6">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold font-display">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">
          This page could not be found.
        </p>
        <Link
          href="/"
          className="text-primary underline underline-offset-4 hover:text-primary/90"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}
