"use client";
import React from "react";

function MainComponent() {
  const { data: user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Security Dashboard
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Monitor and manage your security settings, alerts, and tasks in
            real-time.
          </p>
          <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <a
                href={user ? "/dashboard" : "/account/signin"}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#357AFF] px-8 py-3 text-base font-medium text-white hover:bg-[#2E69DE] md:px-10 md:py-4 md:text-lg"
              >
                {user ? "Go to Dashboard" : "Sign In"}
              </a>
            </div>
            <div className="mt-3 rounded-md shadow sm:ml-3 sm:mt-0">
              <a
                href="/readme"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-[#357AFF] hover:bg-gray-50 md:px-10 md:py-4 md:text-lg"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;