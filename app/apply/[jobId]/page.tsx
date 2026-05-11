import Link from "next/link";

export default function MockApplyPage({ params }: { params: { jobId: string } }) {
  // We can parse the slug to get some info, e.g., company-title-index
  const slugParts = params.jobId.split("-");
  const isFallback = params.jobId.includes("fallback");
  
  // Basic formatting to make it look nice
  const title = slugParts.slice(1, -1).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
  const company = slugParts[0]?.charAt(0).toUpperCase() + slugParts[0]?.slice(1) || "Company";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Apply for {title || "Role"}</h1>
          <p className="text-blue-100 text-lg">at {company}</p>
        </div>
        
        <div className="p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-amber-800 text-sm">
            <strong>Note:</strong> This is a simulated application page. Since no live API keys were provided, the system is using fallback demo data. In a production environment with real keys, this would link directly to the company's actual career portal.
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="john@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume / CV</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" />
                    </label>
                    <p className="pl-1 inline">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOCX up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Link href="/" className="text-gray-500 hover:text-gray-700 font-medium">
                &larr; Back to Search
              </Link>
              <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow transition-colors">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
