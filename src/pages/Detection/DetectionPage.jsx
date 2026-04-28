import React, { useState, useEffect } from 'react';
import { subscribeToDetections } from '../../lib/database';
import { useAuth } from '../../context/AuthContext';
import { useWarehouse } from '../../context/WarehouseContext'; // Import the warehouse context

const DetectionPage = () => {
  const [detections, setDetections] = useState([]);
  const { user } = useAuth();
  const { selectedWarehouseId } = useWarehouse(); // Get the current warehouse ID

  useEffect(() => {
    // Safety check: Only subscribe if we have a valid warehouse ID
    if (!selectedWarehouseId) return;

    /**
     * Subscribe to real-time detection updates from Firestore
     * filtered by the currently selected warehouse.
     */
    const unsubscribe = subscribeToDetections(selectedWarehouseId, (data) => {
      // Sort detections by latest timestamp
      const sortedData = data.sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      });
      setDetections(sortedData);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [selectedWarehouseId]); // Re-run if the warehouse selection changes

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Pest Detection</h1>
        <p className="text-gray-600">Real-time monitoring for warehouse security and safety.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {detections.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.threatLevel === 'High' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.threatLevel} Priority
                </span>
                <span className="text-gray-400 text-xs">
                  {item.timestamp?.toDate().toLocaleString() || 'Just now'}
                </span>
              </div>
              
              <h3 className="font-bold text-xl text-gray-800 mb-1">{item.pestType} Detected</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Location:</span> Zone {item.zoneId}</p>
                <p><span className="font-medium">Confidence:</span> {(item.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {detections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium text-lg">No detection data available.</p>
          <p className="text-gray-400 text-sm mt-1">Make sure the Python script is pushing data to Firestore for warehouse {selectedWarehouseId}.</p>
        </div>
      )}
    </div>
  );
};

export default DetectionPage;