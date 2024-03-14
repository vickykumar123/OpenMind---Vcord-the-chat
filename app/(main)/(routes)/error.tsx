"use client"; // Error components must be Client Components

import {Button} from "@/components/ui/button";
import {useEffect} from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2 className="text-2xl font-thin text-rose-500">
        Something went wrong!
      </h2>
      <Button
        variant="primary"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => window.location.reload()
        }
      >
        Try again
      </Button>
    </div>
  );
}
