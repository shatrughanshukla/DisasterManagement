"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function FooterLinks() {
  const { user } = useAuth();

  return (
    <ul className="space-y-2">
      <li>
        <Link
          href="/"
          className="text-gray-400 hover:text-white transition-colors"
        >
          Home
        </Link>
      </li>

      {user ? (
        <>
          {/* Profile */}
          <li>
            <Link
              href="/profile"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Profile
            </Link>
          </li>

          {/* Dashboard */}
          <li>
            <Link
              href={
                user.role === "student"
                  ? "/dashboard/student"
                  : "/dashboard/teacher"
              }
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </li>
        </>
      ) : (
        <>
          {/* Login */}
          <li>
            <Link
              href="/login"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Login
            </Link>
          </li>

          {/* Register */}
          <li>
            <Link
              href="/register"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Register
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}
