"use client";
import { signInWithKeycloak } from "@/modules/auth/actions";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SigninForm = () => {
  const [loading, setLoading] = useState(false);

  return (
    <form
      action={async (...args) => {
        setLoading(true);
        // @ts-expect-error: signInWithKeycloak có thể không đúng kiểu cho action form
        await signInWithKeycloak(...args);
        setLoading(false);
      }}
      className="w-full"
    >
      <Button
        type="submit"
        className="w-full flex items-center justify-center gap-2"
        disabled={loading}
      >
        <svg
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="inline-block"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18c-4.411 0-8-3.589-8-8 0-1.657.504-3.197 1.364-4.472l11.108 11.108A7.963 7.963 0 0 1 12 20zm6.636-3.528L7.528 5.364A7.963 7.963 0 0 1 12 4c4.411 0 8 3.589 8 8 0 1.657-.504 3.197-1.364 4.472z" />
        </svg>
        {loading ? "Đang đăng nhập..." : "Đăng nhập với Keycloak"}
      </Button>
    </form>
  );
};

export default SigninForm;
