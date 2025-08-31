'use client';


export default function Home() {
  const { state } = useApp();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Main Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Job Application Enhancer
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                All tools to create tailored job application kit aligned with your job description
                and your unique skills.
              </p>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
