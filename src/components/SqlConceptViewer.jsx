import { useState, useEffect } from "react";

const SqlConceptViewer = ({ conceptId }) => {
  const [concept, setConcept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("concepts");

  useEffect(() => {
    if (conceptId) {
      fetchConcept();
    }
  }, [conceptId]);

  const fetchConcept = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/sql-concepts/${conceptId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch concept");
      }
      
      const data = await response.json();
      setConcept(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching concept:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg text-gray-600">Loading concept...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={fetchConcept}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="text-center text-gray-500 py-8">
        No concept found. Please provide a concept ID.
      </div>
    );
  }

  const tabs = [
    { id: "concepts", label: "Concepts", data: concept.conceptsTab },
    { id: "analysis", label: "Analysis", data: concept.analysisTab },
    { id: "code", label: "Code Examples", data: concept.codeTab },
    { id: "demo", label: "Demo", data: concept.demoTab ? [concept.demoTab] : [] },
    { id: "questions", label: "Questions", data: concept.questionsTab },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {concept.icon && <span className="text-3xl">{concept.icon}</span>}
          <h2 className="text-2xl font-bold text-gray-800">{concept.title}</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label} ({tab.data.length})
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "concepts" && (
          <div className="space-y-4">
            {concept.conceptsTab.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {item.icon && <span>{item.icon}</span>}
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">{item.content}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-4">
            {concept.analysisTab.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {item.icon && <span>{item.icon}</span>}
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">{item.content}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "code" && (
          <div className="space-y-4">
            {concept.codeTab.map((example, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">{example.title}</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                  <code>{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        )}

        {activeTab === "demo" && concept.demoTab && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">{concept.demoTab.type}</h3>
            <p className="text-gray-700 mb-4">{concept.demoTab.description}</p>
            
            {concept.demoTab.columns && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Columns:</h4>
                <div className="flex flex-wrap gap-2">
                  {concept.demoTab.columns.map((col, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {concept.demoTab.sampleData && concept.demoTab.sampleData.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Sample Data:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        {Object.keys(concept.demoTab.sampleData[0]).map((key) => (
                          <th key={key} className="border border-gray-300 px-4 py-2 text-left">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {concept.demoTab.sampleData.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((value, valIdx) => (
                            <td key={valIdx} className="border border-gray-300 px-4 py-2">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "questions" && (
          <div className="space-y-4">
            {concept.questionsTab.map((q, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">{q.question}</h3>
                <div className="space-y-2 mb-3">
                  {q.options.map((option, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-3 rounded ${
                        optIdx === q.correctIndex
                          ? "bg-green-100 border-2 border-green-500"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}. {option}
                      {optIdx === q.correctIndex && (
                        <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SqlConceptViewer;
