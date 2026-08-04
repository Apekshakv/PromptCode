import React from "react";

const LoginLeft = () => {
  return (
    <div className="hidden lg:flex lg:w-2/5 min-h-screen bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat flex-col justify-between p-12">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/logo.svg"
          alt="Logo"
          className="w-10 h-10"
        />
        <span className="text-3xl font-semibold text-white">
          Builder AI
        </span>
      </div>

      {/* Content */}
      <div>
        <h2 className="text-4xl text-white font-medium leading-snug mb-4 tracking-tight">
          Build your presence on web
        </h2>

        <p className="text-zinc-300 text-lg leading-7 max-w-md">
          Describe what you need, preview instantly, and customize your site
          in real-time. React with clean JSX, verified layouts, and instant
          code exports.
        </p>

        <p className="text-zinc-400 text-sm mt-12">
          © {new Date().getFullYear()} Builder AI
        </p>
      </div>
    </div>
  );
};

export default LoginLeft;