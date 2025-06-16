import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="text-center space-y-2">
      <p className="font-light">
        We opened all our drawers, but could not find this record.
      </p>
      <Link to="/">Go Home</Link>
    </div>
  );
}
