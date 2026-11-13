import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page">
      <p className="eyebrow">Missing page</p>
      <h1>That chapter is not in the handbook.</h1>
      <p>
        <Link href="/">Back to the start</Link>
      </p>
    </div>
  );
}
