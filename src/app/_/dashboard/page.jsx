"use client";
import React from "react";

import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [securityData, setSecurityData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSecurityData = useCallback(async () => {
    try {
      const [assessmentRes, alertsRes, tasksRes] = await Promise.all([
        fetch("/api/security-assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method: "GET" }),
        }),
        fetch("/api/security-alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method: "GET", page: 1, perPage: 5 }),
        }),
        fetch("/api/security-tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method: "GET", page: 1, perPage: 5 }),
        }),
      ]);

      if (!assessmentRes.ok || !alertsRes.ok || !tasksRes.ok) {
        throw new Error("Failed to fetch security data");
      }

      const [assessmentData, alertsData, tasksData] = await Promise.all([
        assessmentRes.json(),
        alertsRes.json(),
        tasksRes.json(),
      ]);

      setSecurityData(assessmentData.assessment);
      setAlerts(alertsData.alerts);
      setTasks(tasksData.tasks);
    } catch (err) {
      console.error(err);
      setError("Failed to load security data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchSecurityData();
    }
  }, [user, fetchSecurityData]);

  const handleFinish = useCallback((message) => {
    setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    setStreamingMessage("");
    setChatLoading(false);
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || chatLoading) return;

    const newMessage = { role: "user", content: userInput };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setChatLoading(true);

    const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, newMessage],
        stream: true,
      }),
    });

    handleStreamResponse(response);
  };

  const handleTaskComplete = async (taskId, completed) => {
    try {
      const response = await fetch("/api/security-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "PATCH",
          taskId,
          completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      await fetchSecurityData();
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    }
  };

  const handleAlertResolve = async (alertId) => {
    try {
      const response = await fetch("/api/security-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "PATCH",
          alertId,
          resolved: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to resolve alert");
      }

      await fetchSecurityData();
    } catch (err) {
      console.error(err);
      setError("Failed to resolve alert");
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl font-medium text-gray-600">
            Please sign in to access your dashboard
          </div>
          <a
            href="/account/signin"
            className="text-[#357AFF] hover:text-[#2E69DE]"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl font-medium text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Security Dashboard
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 text-xl font-semibold text-gray-700">
              Security Score
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#357AFF"
                    strokeWidth="3"
                    strokeDasharray={`${securityData?.overall_score || 0}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-700">
                  {securityData?.overall_score || 0}%
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              {securityData?.two_factor_enabled ? (
                <span className="text-green-600">✓ 2FA Enabled</span>
              ) : (
                <span className="text-red-600">✗ 2FA Disabled</span>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 text-xl font-semibold text-gray-700">
              Security Alerts
            </div>
            {alerts.length === 0 ? (
              <div className="text-center text-gray-600">No active alerts</div>
            ) : (
              <ul className="space-y-3">
                {alerts.map((alert) => (
                  <li
                    key={alert.id}
                    className={`flex items-center justify-between gap-3 rounded-lg p-3 ${
                      alert.severity === "critical"
                        ? "bg-red-50 text-red-700"
                        : alert.severity === "high"
                        ? "bg-orange-50 text-orange-700"
                        : alert.severity === "medium"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    <span>{alert.message}</span>
                    {!alert.is_resolved && (
                      <button
                        onClick={() => handleAlertResolve(alert.id)}
                        className="text-sm hover:underline"
                      >
                        Resolve
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 text-xl font-semibold text-gray-700">
              Security Tasks
            </div>
            {tasks.length === 0 ? (
              <div className="text-center text-gray-600">No pending tasks</div>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center gap-3 text-gray-600"
                  >
                    <button
                      onClick={() =>
                        handleTaskComplete(task.id, !task.is_completed)
                      }
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 hover:border-[#357AFF]"
                    >
                      {task.is_completed ? (
                        <i className="fas fa-check text-[#357AFF]"></i>
                      ) : (
                        <i className="far fa-circle"></i>
                      )}
                    </button>
                    <span className={task.is_completed ? "line-through" : ""}>
                      {task.title}
                    </span>
                    <span
                      className={`ml-auto text-xs ${
                        task.priority === "high"
                          ? "text-red-600"
                          : task.priority === "medium"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 text-xl font-semibold text-gray-700">
            Security Assistant
          </div>
          <div className="mb-4 h-64 overflow-y-auto rounded-lg bg-gray-50 p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.role === "user" ? "text-right" : ""}`}
              >
                <div
                  className={`inline-block rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-[#357AFF] text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {streamingMessage && (
              <div className="mb-4">
                <div className="inline-block rounded-lg bg-gray-200 p-3">
                  {streamingMessage}
                </div>
              </div>
            )}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask a security question..."
              className="flex-1 rounded-lg border border-gray-200 p-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE] disabled:opacity-50"
            >
              {chatLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;