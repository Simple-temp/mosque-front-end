import React from "react";

const DashBoardWelcomePage = () => {
  const userData = JSON.parse(localStorage.getItem("adminUser"));
  const userName = userData?.name || "User";
  const userRole = userData?.role || "guest";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-green-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 w-full max-w-[900px] text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          👋 Welcome, <span className="text-green-600">{userName}</span>!
        </h1>
        <p className="text-lg text-gray-600 capitalize mb-2">
          You are logged in as a <span className="font-semibold text-gray-800">{userRole}</span> 🛡️ user
        </p>
        <div className="mt-6 space-y-4 text-gray-700 text-base leading-relaxed">
          <p>
            🚀 This is your central hub for monitoring and managing daily activities.
            From here, you can track collections, manage users, and stay on top of important metrics.
          </p>
          <p>
            🧭 Use the sidebar to navigate between different sections tailored to your role.
          </p>
          <p>
            📊 Everything you need is just a few clicks away — enjoy a seamless and intuitive experience.
          </p>
          <p>
            🔒 Your access and features are secured and personalized based on your role.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashBoardWelcomePage;
