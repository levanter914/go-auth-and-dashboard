import React, { useEffect, useRef, useState } from "react";

export default function RecentOrders() {
    const [bills, setBills] = useState([]);
    const [page, setPage] = useState(1);
    const [error, setError] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [pdfUrl, setPdfUrl] = useState("");
    const iframeRef = useRef(null);
    const limit = 2;

    useEffect(() => {
        setError("");

        fetch("http://localhost:8080/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query getBills($page: Int!, $size: Int!) {
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

                    const uniqueBills = [];
                    const seen = new Set();

                    for (const bill of fetchedBills) {
                        if (!seen.has(bill.billID)) {
                            seen.add(bill.billID);
                            uniqueBills.push(bill);
                        }
                    }

                    setBills(uniqueBills);
                    setHasMore(uniqueBills.length === limit);
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

    const handleGeneratePDF = async (billID) => {
        try {
            const res = await fetch("http://localhost:8080/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                    mutation GetBillPDF($billID: Int!) {
                        getBillPDF(billID: $billID)
                    }
                `,
                    variables: { billID },
                }),
            });

            const json = await res.json();
            const pdfUrlFromServer = json?.data?.getBillPDF;

            if (!pdfUrlFromServer) {
                throw new Error("PDF URL not returned by server");
            }

            const pdfResponse = await fetch(pdfUrlFromServer);
            if (!pdfResponse.ok) throw new Error("Failed to fetch PDF file");

            const pdfBlob = await pdfResponse.blob();
            const blobUrl = URL.createObjectURL(pdfBlob);

            const newTab = window.open();
            if (!newTab) throw new Error("Pop-up blocked");

            newTab.document.write(`
            <html>
                <head>
                    <title>Bill #${billID}</title>
                    <style>
                        body, html {
                            margin: 0;
                            padding: 0;
                            height: 100%;
                        }
                        iframe {
                            width: 100%;
                            height: 100%;
                            border: none;
                        }
                    </style>
                </head>
                <body>
                    <iframe id="pdfFrame" src="${blobUrl}"></iframe>
                    <script>
                        const iframe = document.getElementById('pdfFrame');
                        iframe.onload = function () {
                            setTimeout(() => {
                                iframe.contentWindow.focus();
                                iframe.contentWindow.print();
                            }, 500); 
                        };
                    </script>
                </body>
            </html>
        `);
            newTab.document.close();

        } catch (err) {
            console.error("Failed to generate or fetch PDF URL:", err);
            alert("Could not fetch the PDF. Please try again.");
        }
    };


    const handlePrint = () => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        }
    };

    useEffect(() => {
        if (pdfUrl) {
            const iframe = iframeRef.current;
            iframe.onload = () => {
                iframe.contentWindow.print();
            };
        }
    }, [pdfUrl]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-8">Recent Orders</h3>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="space-y-4">
                {bills.length > 0 ? (
                    bills.map((bill, idx) =>
                        bill && bill.billID ? (
                            <div
                                key={`${bill.billID}-${idx}`}
                                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                            >
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                        <span className="text-indigo-600 font-medium">#{bill.billID}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{bill.company}</p>
                                        <p className="text-xs text-gray-500">
                                            {bill.createdAt ? new Date(bill.createdAt).toLocaleString() : "Invalid date"} — ₹{bill.totalAmount}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleGeneratePDF(bill.billID)}
                                    className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Print PDF
                                </button>
                            </div>
                        ) : (
                            <div key={`invalid-${idx}`} className="text-red-400 text-sm">
                                Invalid bill data
                            </div>
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

            {/* Hidden iframe that loads the PDF */}
            {pdfUrl && (
                <iframe
                    ref={iframeRef}
                    src={pdfUrl}
                    style={{ display: "none" }}
                    title="pdf-print"
                />
            )}

        </div>
    );
}
