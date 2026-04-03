"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md dark:hover:border-slate-700 transition-all duration-300">
      <div className="absolute top-6 right-6 text-red-500">
        <Icon className="w-5 h-5" />
      </div>

      <p className="text-sm text-gray-500 dark:text-slate-400">{title}</p>

      <h2 className="mt-4 text-4xl font-semibold text-gray-900 dark:text-white transition-colors">
        {value}
      </h2>

      {description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}
