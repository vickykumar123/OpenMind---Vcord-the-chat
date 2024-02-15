import React from "react";

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <h1 className="text-xl font-bold mb-4">
        Welcome to <span className="italic text-indigo-700">Vcord</span>
      </h1>
      <div>{children}</div>
    </div>
  );
}
