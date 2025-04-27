"use client";
import React from "react";

function MainComponent() {
  const { data: user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Security Dashboard Documentation
        </h1>

        <div className="space-y-12">
          <section className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
              Project Overview
            </h2>
            <p className="text-gray-600">
              A comprehensive security dashboard that helps users monitor and
              manage their security settings, alerts, and tasks. The dashboard
              provides real-time security scoring, threat monitoring, and
              interactive assistance through an AI-powered chat interface.
            </p>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
              Live Demo
            </h2>
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="inline-flex items-center rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
              >
                <i className="fas fa-external-link-alt mr-2"></i>
                View Dashboard
              </a>
              {!user && (
                <a
                  href="/account/signin"
                  className="inline-flex items-center rounded-lg border border-[#357AFF] px-4 py-2 text-[#357AFF] hover:bg-blue-50"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Sign In
                </a>
              )}
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
              Screenshots
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <img
                  src="/screenshots/security-score.png"
                  alt="Security score dashboard showing overall security rating and key metrics"
                  className="h-[200px] w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-gray-700">Security Score</h3>
                  <p className="text-sm text-gray-500">
                    Real-time security metrics and scoring
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <img
                  src="/screenshots/alerts.png"
                  alt="Security alerts panel displaying active threats and notifications"
                  className="h-[200px] w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-gray-700">Security Alerts</h3>
                  <p className="text-sm text-gray-500">
                    Active threat monitoring and alerts
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <img
                  src="/screenshots/tasks.png"
                  alt="Security tasks interface showing pending and completed security actions"
                  className="h-[200px] w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-gray-700">Security Tasks</h3>
                  <p className="text-sm text-gray-500">
                    Task management and tracking
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
              Architecture
            </h2>
            <div className="overflow-hidden rounded-lg border border-gray-200 p-4">
              <img
                src="/diagrams/architecture.png"
                alt="System architecture diagram showing the relationship between frontend, backend, and security services"
                className="w-full"
              />
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
              Key Features
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 text-xl text-[#357AFF]">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="mb-2 font-medium text-gray-700">
                  Authentication
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check text-green-500"></i>
                    Email and password authentication
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check text-green-500"></i>
                    Two-factor authentication support
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check text-green-500"></i>
                    Session management
                  </li>
                </ul>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 text-xl text-[#357AFF]">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3 className="mb-2 font-medium text-gray-700">
                  Security Monitoring
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check text-green-500"></i>
                    Real-time security scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check text-green-500"></i>
                    Threat detection and alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check text-green-500"></i>
                    Security task management
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;