"use client";

import { useEffect, useState } from "react";

type LogEntry = {
  fileName: string;
  timestamp: string;
  totalFetched: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: { reason: string }[];
};

export default function HomePage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    async function fetchLogs() {
      const res = await fetch("https://job-importer-xltg.onrender.com/api/logs");
      const data = await res.json();
      setLogs(data.reverse());
    }

    fetchLogs();
  }, []);


  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        🗂️ Job Import Logs
      </h1>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full text-sm text-left text-gray-700 border border-gray-300">
          <thead className="text-xs uppercase bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
            <tr>
              <th className="px-5 py-3 border border-gray-300">S.No</th>
              <th className="px-5 py-3 border border-gray-300">File Name</th>
              <th className="px-5 py-3 border border-gray-300">Date & Time</th>
              <th className="px-5 py-3 border border-gray-300 text-green-700">
                Total
              </th>
              <th className="px-5 py-3 border border-gray-300 text-blue-700">
                New
              </th>
              <th className="px-5 py-3 border border-gray-300 text-yellow-700">
                Updated
              </th>
              <th className="px-5 py-3 border border-gray-300 text-red-700">
                Failed
              </th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log, i) => {
              const isExpanded = expandedIndex === i;
              const hasFailures = log.failedJobs?.length > 0;

              return [
                // Main Row
                <tr
                  key={`row-${i}`}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                >
                  <td className="px-5 py-3 border border-gray-300">
                    {(currentPage - 1) * logsPerPage + i + 1}
                  </td>

                  <td className="px-5 py-3 border border-gray-300 max-w-xs truncate text-blue-800 underline">
                    <a
                      href={log.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full truncate"
                    >
                      {log.fileName}
                    </a>
                  </td>
                  <td className="px-5 py-3 border border-gray-300 text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 border border-gray-300 font-medium text-green-700">
                    {log.totalFetched}
                  </td>
                  <td className="px-5 py-3 border border-gray-300 font-medium text-blue-700">
                    {log.newJobs}
                  </td>
                  <td className="px-5 py-3 border border-gray-300 font-medium text-yellow-700">
                    {log.updatedJobs}
                  </td>
                  <td
                    onClick={() =>
                      hasFailures && setExpandedIndex(isExpanded ? null : i)
                    }
                    className={`px-5 py-3 border border-gray-300 font-medium text-red-700 ${
                      hasFailures
                        ? "cursor-pointer flex items-center gap-2"
                        : ""
                    }`}
                  >
                    <span>{log.failedJobs?.length || 0}</span>
                    {hasFailures && (
                      <span
                        className={`transition-transform duration-200 ${
                          isExpanded ? "rotate-90" : "rotate-0"
                        }`}
                      >
                        ▶
                      </span>
                    )}
                  </td>
                </tr>,

                hasFailures && isExpanded ? (
                  <tr key={`details-${i}`} className="bg-red-50">
                    <td
                      colSpan={6}
                      className="border border-t-0 border-gray-300 px-5 py-3 text-sm text-red-700"
                    >
                      <strong>Failure Reasons:</strong>
                      <ul className="list-disc pl-5 mt-1">
                        {log.failedJobs.map((f, idx) => (
                          <li key={idx}>{f.reason}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ) : null,
              ];
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-1 font-medium text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
