const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-2xl shadow p-8 border border-gray-100">
        <h1 className="text-4xl font-bold text-agri-dark mb-6">About the Project</h1>
        <div className="prose prose-green lg:prose-lg text-gray-600">
          <p>
            The Smart Agriculture Assistant is an intelligent platform designed to help 
            farmers manage their crops, detect diseases early, and optimize their yields 
            using modern technology and AI.
          </p>
          <p>
            Currently in <strong>Phase 1: Project Foundation</strong>, we are building 
            a robust architecture that will support advanced features in upcoming phases.
          </p>
          <h3>Upcoming Features (Future Phases)</h3>
          <ul>
            <li>Plant disease and pest detection via Image Recognition (AI).</li>
            <li>Real-time weather tracking and forecasting.</li>
            <li>Crop and fertilizer recommendation engines.</li>
            <li>Market price tracking and agricultural alerts.</li>
            <li>Multilingual support (English, Gujarati, Hindi).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
