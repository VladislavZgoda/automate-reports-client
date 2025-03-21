import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-10 bg-gray-50">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-9xl font-extrabold text-red-600">404</h1>
        <p className="text-5xl font-bold text-gray-600">Page not found</p>
      </div>

      <Link
        to="/"
        className="text-3xl font-semibold text-blue-600 italic underline"
      >
        На главную страницу
      </Link>
    </div>
  );
}
