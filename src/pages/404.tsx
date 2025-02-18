import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col gap-10 items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-9xl text-red-600 font-extrabold">404</h1>
        <p className="text-5xl text-gray-600 font-bold">Page not found</p>
      </div>

      <Link
        to="/"
        className="text-3xl text-blue-600 underline font-semibold italic"
      >
        На главную страницу
      </Link>
    </div>
  );
}
