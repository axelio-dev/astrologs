import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center mt-[25px]">
      <h1 className="font-bold text-red-600 text-lg">Welcome in Astrologs !</h1>
      <p>
        <Link href="/dashboard" className="text-blue-500 underline">
          Dashboard
        </Link>
      </p>
      <p>
        <Link href="/auth/login" className="text-blue-500 underline">
          Login
        </Link>
      </p>
      <p>
        <Link href="/auth/register" className="text-blue-500 underline">
          Register
        </Link>
      </p>
      <p className="italic">This page is not currently developed</p>
    </div>
  );
}
