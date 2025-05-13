import React, { useEffect, useState } from "react";

export default function RecentOrders() {
    const [bills, setBills] = useState([]); // State to store bills
    const [page, setPage] = useState(1); // Pagination state
    const [error, setError] = useState(""); // To track error messages
    const [hasMore, setHasMore] = useState(true); // Track if more pages exist
    const limit = 2; // Limit of bills per page

    useEffect(() => {
        setError(""); // Reset error before fetching

        fetch("http://localhost:8080/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                query: `
                    query GetBills($page: Int!, $size: Int!) {
                        getBills(page: $page, size: $size) {
                            bills {
                                billID
                                company
                                createdAt
                                totalAmount
                            }
                        }
                    }
                `,
                variables: { page, size: limit },
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.errors) {
                    setError("Failed to load bills: " + res.errors.map((err) => err.message).join(", "));
                    setBills([]);
                    setHasMore(false);
                    return;
                }

                const fetchedBills = res?.data?.getBills?.bills;

                if (Array.isArray(fetchedBills)) {
                    // Filter out duplicates by billID
                    const uniqueBills = [];
                    const seen = new Set();

                    for (const bill of fetchedBills) {
                        if (!seen.has(bill.billID)) {
                            seen.add(bill.billID);
                            uniqueBills.push(bill);
                        }
                    }

                    setBills(uniqueBills);
                    setHasMore(uniqueBills.length === limit); // Only allow next if we have full page
                } else {
                    setBills([]);
                    setHasMore(false);
                    setError("No bills found on this page.");
                }
            })
            .catch((err) => {
                setError("Failed to load bills: " + err.message);
                setBills([]);
                setHasMore(false);
                console.error("Error loading bills:", err);
            });
    }, [page]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-8">Recent Orders</h3>

            {/* Show error message if there's an error */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="space-y-4">
                {bills.length > 0 ? (
                    bills.map((bill, idx) =>
                        bill && bill.billID ? (
                            <div key={`${bill.billID}-${idx}`} className="flex items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                    <span className="text-indigo-600 font-medium">#{bill.billID}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{bill.company}</p>
                                    <p className="text-xs text-gray-500">
                                        {bill.createdAt ? new Date(bill.createdAt).toLocaleString() : "Invalid date"} — ₹{bill.totalAmount}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div key={`invalid-${idx}`} className="text-red-400 text-sm">Invalid bill data</div>
                        )
                    )
                ) : (
                    !error && <p className="text-gray-500 text-sm">No recent orders found.</p>
                )}
            </div>

            <div className="mt-4 flex justify-between">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800 disabled:text-gray-300"
                >
                    ← Previous
                </button>

                <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={!hasMore}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800 disabled:text-gray-300"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
