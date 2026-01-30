import { useState } from 'react';
import { Bot, Send, Sparkles, Stethoscope, FileText, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const AIHealthAssistant = () => {
  const [activeTab, setActiveTab] = useState<'advice' | 'recommendation' | 'tips' | 'analyze'>('advice');
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [reportText, setReportText] = useState('');
  const [category, setCategory] = useState('general wellness');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  

  const getHealthAdvice = async () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/ai/health-advice', {
        symptoms,
        medicalHistory: medicalHistory || undefined,
      });
      setResponse(data.advice);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get advice');
    } finally {
      setLoading(false);
    }
  };

  const getDoctorRecommendation = async () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/ai/doctor-recommendation', { symptoms });
      setResponse(data.recommendation);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get recommendation');
    } finally {
      setLoading(false);
    }
  };


 

  const getHealthTips = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/ai/health-tips?category=${category}`);
      setResponse(data.tips);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get tips');
    } finally {
      setLoading(false);
    }
  };

  const analyzeReport = async () => {
    if (!reportText.trim()) {
      toast.error('Please enter report text');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/ai/analyze-report', { reportText });
      setResponse(data.analysis);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to analyze report');
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    if (activeTab === 'tips') {
      getHealthTips();
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Bot className="h-12 w-12 text-primary-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">AI Health Assistant</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Get instant health advice powered by advanced AI
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('advice')}
              className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 ${
                activeTab === 'advice'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Sparkles className="h-5 w-5" />
              <span>Health Advice</span>
            </button>
            <button
              onClick={() => setActiveTab('recommendation')}
              className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 ${
                activeTab === 'recommendation'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Stethoscope className="h-5 w-5" />
              <span>Doctor Recommendation</span>
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 ${
                activeTab === 'tips'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Heart className="h-5 w-5" />
              <span>Health Tips</span>
            </button>
            <button
              onClick={() => setActiveTab('analyze')}
              className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 ${
                activeTab === 'analyze'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Analyze Report</span>
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'advice' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your symptoms *
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="E.g., I have a headache and fever for 2 days..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical history (optional)
                  </label>
                  <textarea
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Any relevant medical conditions, allergies, medications..."
                  />
                </div>
                <button
                  onClick={getHealthAdvice}
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Get Health Advice</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === 'recommendation' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your symptoms *
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="E.g., Chest pain, shortness of breath..."
                  />
                </div>
                <button
                  onClick={getDoctorRecommendation}
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Get Recommendation</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="general wellness">General Wellness</option>
                    <option value="heart health">Heart Health</option>
                    <option value="mental health">Mental Health</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="exercise">Exercise</option>
                    <option value="sleep">Sleep</option>
                    <option value="stress management">Stress Management</option>
                  </select>
                </div>
                <button
                  onClick={getHealthTips}
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Get Health Tips</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === 'analyze' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste your medical report text *
                  </label>
                  <textarea
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Paste lab results, test reports, or medical documents..."
                  />
                </div>
                <button
                  onClick={analyzeReport}
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Analyze Report</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {response && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center mb-4">
                  <Bot className="h-6 w-6 text-primary-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">AI Response</h3>
                </div>
                <div className="prose prose-blue max-w-none">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ This is AI-generated advice. Always consult with a healthcare professional for proper diagnosis and treatment.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHealthAssistant;
