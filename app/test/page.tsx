"use client";

import { useEffect, useState } from 'react';
import apiClient from '../../lib/api';

export default function TestPage() {
  const [status, setStatus] = useState<string>('Testing...');
  const [error, setError] = useState<string>('');
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Testing backend connection...');
        
        // Test health endpoint
        const healthResponse = await apiClient.healthCheck();
        setHealthData(healthResponse.data);
        setStatus('✅ Backend connection successful!');
        
        console.log('Health check response:', healthResponse);
        
      } catch (err: any) {
        console.error('Connection test failed:', err);
        setError(err.message || 'Unknown error');
        setStatus('❌ Backend connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Backend Connection Test
          </h1>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Status:</p>
              <p className={`text-sm ${status.includes('✅') ? 'text-green-600' : status.includes('❌') ? 'text-red-600' : 'text-yellow-600'}`}>
                {status}
              </p>
            </div>

            {error && (
              <div>
                <p className="text-sm font-medium text-gray-700">Error:</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {healthData && (
              <div>
                <p className="text-sm font-medium text-gray-700">Backend Health:</p>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(healthData, null, 2)}
                </pre>
              </div>
            )}

            <div className="pt-4">
              <a 
                href="/"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
