import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Home page</h1>
      <p>
        To log in, click on{" "}
        <Link href="/auth/login" className="text-blue-500 underline">
          the login page
        </Link>
        .
      </p>
      <p>
        To register, click on{" "}
        <Link href="/auth/register" className="text-blue-500 underline">
          the register page
        </Link>
        .
      </p>
    </div>
  );
}
