// File: app/page.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token from environment variable
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

// Type definitions
interface Employee {
  id: number;
  address: string;
  name: string;
  coordinates?: [number, number];
  lat?: number;
  lng?: number;
}

interface CommuteData extends Employee {
  walkingDuration: number | null;
  walkingDistance: number | null;
  drivingDuration: number | null;
  drivingDistance: number | null;
}

const OfficeLocationPlanner: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const officeMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const employeesRef = useRef<Employee[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [officeLocation, setOfficeLocation] = useState<[number, number]>([151.2093, -33.8688]); // Sydney CBD
  const [commuteData, setCommuteData] = useState<CommuteData[]>([]);
  const [averageWalkingCommute, setAverageWalkingCommute] = useState<number>(0);
  const [averageDrivingCommute, setAverageDrivingCommute] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [officeAddress, setOfficeAddress] = useState<string>('');
  const [isSearchingOffice, setIsSearchingOffice] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // Define calculateCommuteTimes with useCallback to avoid dependency issues
  const calculateCommuteTimes = useCallback(async (
    office: [number, number], 
    employeeList: Employee[] = employees
  ): Promise<void> => {
    console.log('calculateCommuteTimes called with office:', office);
    console.log('employeeList received:', employeeList);
    console.log('employeeList length:', employeeList.length);
    
    if (!employeeList.length) {
      console.log('Early return - no employees');
      return;
    }
    
    setIsLoading(true);
    setLoadingMessage('Calculating commute times...');
    
    // Check if employees have coordinates
    const employeesWithCoords = employeeList.filter(e => e.lng !== undefined && e.lat !== undefined);
    console.log('Employees with coordinates:', employeesWithCoords.length);
    console.log('First few employees:', employeesWithCoords.slice(0, 3));
    
    const commutePromises = employeesWithCoords.map(async (employee, index): Promise<CommuteData> => {
      setLoadingMessage(`Calculating commute ${index + 1}/${employeesWithCoords.length}...`);
      
      // Initialize result with employee data and null commute values
      const result: CommuteData = {
        ...employee,
        walkingDuration: null,
        walkingDistance: null,
        drivingDuration: null,
        drivingDistance: null
      };
      
      try {
        // Calculate walking route
        setLoadingMessage(`Calculating walking route for ${employee.name}...`);
        const walkingResponse = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/walking/${employee.lng},${employee.lat};${office[0]},${office[1]}?access_token=${mapboxgl.accessToken}&geometries=geojson&overview=full`
        );
        
        const walkingData = await walkingResponse.json();
        
        if (walkingData.routes && walkingData.routes.length > 0) {
          const walkingDuration = walkingData.routes[0].duration / 60; // Convert to minutes
          const walkingDistance = walkingData.routes[0].distance / 1000; // Convert to km
          
          result.walkingDuration = Math.round(walkingDuration);
          result.walkingDistance = Math.round(walkingDistance * 10) / 10;
        }
        
        // Rate limiting between API calls
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Calculate driving route
        setLoadingMessage(`Calculating driving route for ${employee.name}...`);
        const drivingResponse = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${employee.lng},${employee.lat};${office[0]},${office[1]}?access_token=${mapboxgl.accessToken}&geometries=geojson&overview=full`
        );
        
        const drivingData = await drivingResponse.json();
        
        if (drivingData.routes && drivingData.routes.length > 0) {
          const drivingDuration = drivingData.routes[0].duration / 60; // Convert to minutes
          const drivingDistance = drivingData.routes[0].distance / 1000; // Convert to km
          
          result.drivingDuration = Math.round(drivingDuration);
          result.drivingDistance = Math.round(drivingDistance * 10) / 10;
        }
        
        // Rate limiting between employees
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error('Routing error for employee:', employee.id, error);
      }
      
      return result;
    });

    const results: CommuteData[] = [];
    for (const promise of commutePromises) {
      const result = await promise;
      results.push(result);
    }

    console.log('Setting commuteData with results:', results.length);
    setCommuteData(results);
    
    // Calculate average walking commute time
    const validWalkingCommutes = results.filter(r => r.walkingDuration !== null);
    console.log('Valid walking commutes for average calculation:', validWalkingCommutes.length);
    const walkingAverage = validWalkingCommutes.length > 0 
      ? validWalkingCommutes.reduce((sum, r) => sum + (r.walkingDuration || 0), 0) / validWalkingCommutes.length 
      : 0;
    console.log('Calculated walking average:', walkingAverage);
    setAverageWalkingCommute(Math.round(walkingAverage));
    
    // Calculate average driving commute time
    const validDrivingCommutes = results.filter(r => r.drivingDuration !== null);
    console.log('Valid driving commutes for average calculation:', validDrivingCommutes.length);
    const drivingAverage = validDrivingCommutes.length > 0 
      ? validDrivingCommutes.reduce((sum, r) => sum + (r.drivingDuration || 0), 0) / validDrivingCommutes.length 
      : 0;
    console.log('Calculated driving average:', drivingAverage);
    setAverageDrivingCommute(Math.round(drivingAverage));
    
    setIsLoading(false);
  }, [employees]);

  // Update the ref whenever employees state changes
  useEffect(() => {
    employeesRef.current = employees;
    console.log('Employees state updated, ref now has:', employeesRef.current.length, 'employees');
  }, [employees]);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: officeLocation,
      zoom: 11
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add office marker
      const officeMarker = new mapboxgl.Marker({
        color: '#ff0000',
        draggable: true
      })
        .setLngLat(officeLocation)
        .addTo(map.current);

      officeMarkerRef.current = officeMarker;

      officeMarker.on('dragend', () => {
        const newLocation = officeMarker.getLngLat();
        const newLocationArray: [number, number] = [newLocation.lng, newLocation.lat];
        console.log('Drag ended, new office location:', newLocationArray);
        setOfficeLocation(newLocationArray);
        // Use employeesRef instead of employees to get current state
        console.log('Current employees state (from ref):', employeesRef.current);
        console.log('Employees length (from ref):', employeesRef.current.length);
        if (employeesRef.current.length > 0) {
          console.log('Calling calculateCommuteTimes with new office location');
          calculateCommuteTimes(newLocationArray, employeesRef.current);
        } else {
          console.log('Not calling calculateCommuteTimes - no employees');
        }
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [officeLocation, calculateCommuteTimes]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        
        const employeeData: Employee[] = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            const values = line.split(',');
            return {
              id: index,
              address: values[0]?.trim() || '',
              name: values[1]?.trim() || `Employee ${index + 1}`
            };
          });
        
        setEmployees(employeeData);
        geocodeEmployees(employeeData);
      };
      reader.readAsText(file);
    }
  };

  const geocodeEmployees = async (employeeData: Employee[]): Promise<void> => {
    setIsLoading(true);
    setLoadingMessage('Geocoding employee addresses...');
    
    const geocodedEmployees: Employee[] = [];
    
    // Clear existing employee markers
    const existingMarkers = document.querySelectorAll('.employee-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    for (let i = 0; i < employeeData.length; i++) {
      const employee = employeeData[i];
      setLoadingMessage(`Geocoding ${i + 1}/${employeeData.length}: ${employee.address.substring(0, 30)}...`);
      
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            employee.address + ', Sydney, Australia'
          )}.json?access_token=${mapboxgl.accessToken}&limit=1`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const coordinates: [number, number] = data.features[0].center;
          const geocodedEmployee: Employee = {
            ...employee,
            coordinates: coordinates,
            lat: coordinates[1],
            lng: coordinates[0]
          };
          geocodedEmployees.push(geocodedEmployee);
          
          // Add employee marker to map
          if (map.current) {
            // Use the marker but don't assign it to a variable since we don't need it later
            new mapboxgl.Marker({ 
              color: '#0080ff',
              className: 'employee-marker'
            })
              .setLngLat(coordinates)
              .setPopup(new mapboxgl.Popup().setHTML(`
                <div class="p-2">
                  <strong>${employee.name}</strong><br/>
                  <span class="text-sm text-gray-600">${employee.address}</span>
                </div>
              `))
              .addTo(map.current);
          }
        }
        
        // Rate limiting - wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    }
    
    console.log('Geocoding complete. Geocoded employees:', geocodedEmployees);
    setEmployees(geocodedEmployees);
    setLoadingMessage('Calculating commute times...');
    await calculateCommuteTimes(officeLocation, geocodedEmployees);
    setIsLoading(false);
  };

  const searchOfficeAddress = async (): Promise<void> => {
    if (!officeAddress.trim()) return;
    
    setIsSearchingOffice(true);
    setLoadingMessage('Searching for office address...');
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          officeAddress + ', Sydney, Australia'
        )}.json?access_token=${mapboxgl.accessToken}&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const coordinates: [number, number] = data.features[0].center;
        
        // Update office location state
        setOfficeLocation(coordinates);
        
        // Move the office marker
        if (officeMarkerRef.current && map.current) {
          officeMarkerRef.current.setLngLat(coordinates);
          map.current.flyTo({
            center: coordinates,
            zoom: 14,
            essential: true
          });
        }
        
        // Recalculate commute times if we have employees
        if (employeesRef.current.length > 0) {
          await calculateCommuteTimes(coordinates, employeesRef.current);
        }
      } else {
        alert('Address not found. Please try a different address.');
      }
    } catch (error) {
      console.error('Error searching for office address:', error);
      alert('Error searching for address. Please try again.');
    }
    
    setIsSearchingOffice(false);
  };

  const handleOfficeAddressKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchOfficeAddress();
    }
  };

  const calculateOptimalLocation = async (): Promise<void> => {
    if (employeesRef.current.length === 0) {
      alert('Please upload employee data first.');
      return;
    }
    
    setIsOptimizing(true);
    setLoadingMessage('Calculating optimal office location...');
    
    try {
      // Filter employees that have coordinates
      const employeesWithCoords = employeesRef.current.filter(
        e => e.lat !== undefined && e.lng !== undefined
      );
      
      if (employeesWithCoords.length === 0) {
        alert('No employee coordinates available. Please upload valid addresses.');
        setIsOptimizing(false);
        return;
      }
      
      // Calculate the centroid (average lat/lng)
      let sumLat = 0;
      let sumLng = 0;
      
      employeesWithCoords.forEach(employee => {
        if (employee.lat && employee.lng) {
          sumLat += employee.lat;
          sumLng += employee.lng;
        }
      });
      
      const avgLat = sumLat / employeesWithCoords.length;
      const avgLng = sumLng / employeesWithCoords.length;
      
      const optimalLocation: [number, number] = [avgLng, avgLat];
      
      // Update office location state
      setOfficeLocation(optimalLocation);
      
      // Move the office marker with animation
      if (officeMarkerRef.current && map.current) {
        officeMarkerRef.current.setLngLat(optimalLocation);
        map.current.flyTo({
          center: optimalLocation,
          zoom: 13,
          essential: true,
          duration: 2000 // 2 second animation
        });
      }
      
      // Calculate new commute times with the optimal location
      await calculateCommuteTimes(optimalLocation, employeesRef.current);
      
      // Show success message
      alert('Optimal office location calculated based on employee distribution.');
      
    } catch (error) {
      console.error('Error calculating optimal location:', error);
      alert('Error calculating optimal location. Please try again.');
    }
    
    setIsOptimizing(false);
  };

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Missing Mapbox Token</h2>
          <p className="text-gray-600 mb-4">
            Please add your Mapbox access token to the .env.local file:
          </p>
          <code className="bg-gray-100 p-2 rounded block text-sm">
            NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
          </code>
          <p className="text-sm text-gray-500 mt-4">
            Get your token from <a href="https://mapbox.com" className="text-blue-600 underline">mapbox.com</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Control Panel */}
      <div className="w-1/3 p-4 bg-gray-100 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">🏢 Office Location Planner</h1>
        
        {/* Office Address Search */}
        <div className="mb-6 max-w-md">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Office Location
          </label>
          <div className="flex">
            <input
              type="text"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
              onKeyDown={handleOfficeAddressKeyDown}
              placeholder="Enter office address..."
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              disabled={isLoading || isSearchingOffice}
            />
            <button
              onClick={searchOfficeAddress}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading || isSearchingOffice || !officeAddress.trim()}
            >
              {isSearchingOffice ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  Searching...
                </span>
              ) : (
                'Search'
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter address or drag the red marker on the map
          </p>
        </div>
        
        {/* Optimize Location Button */}
        <div className="mb-6">
          <button
            onClick={calculateOptimalLocation}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading || isSearchingOffice || isOptimizing || employees.length === 0}
          >
            {isOptimizing ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Optimizing...
              </span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Optimize Office Location
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Find the optimal office location based on employee distribution
          </p>
        </div>
        
        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Upload Employee Addresses (CSV)
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            CSV format: address, name (optional)
          </p>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-sm text-blue-800">{loadingMessage}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        {commuteData.length > 0 && !isLoading && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold mb-2 text-gray-800">📊 Commute Statistics</h3>
            <div className="space-y-1 text-sm text-black">
              <p><span className="font-medium">Total Employees:</span> {employees.length}</p>
              <p><span className="font-medium">Average Walking Time:</span> {averageWalkingCommute} minutes</p>
              <p><span className="font-medium">Average Driving Time:</span> {averageDrivingCommute} minutes</p>
              <p><span className="font-medium">Office Location:</span></p>
              <p className="text-xs text-black ml-2">
                Lat: {officeLocation[1].toFixed(4)}, Lng: {officeLocation[0].toFixed(4)}
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        {employees.length === 0 && !isLoading && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-2 text-blue-800">📝 How to get started:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Enter an office address or drag the red marker</li>
              <li>2. Create a CSV file with employee addresses</li>
              <li>3. Upload the file using the button above</li>
              <li>4. Wait for geocoding and commute calculations</li>
              <li>5. Click "Optimize Office Location" for best placement</li>
            </ol>
            
            <div className="mt-4">
              <p className="text-sm font-medium text-blue-800 mb-2">CSV Example:</p>
              <pre className="text-xs bg-blue-100 p-2 rounded">
{`123 George Street Sydney,John Doe
456 Pitt Street Sydney,Jane Smith
789 Elizabeth Street Sydney,Bob Wilson`}
              </pre>
            </div>
          </div>
        )}

        {/* Employee List */}
        {commuteData.length > 0 && !isLoading && (
          <div className="bg-white rounded-lg shadow">
            <h3 className="font-semibold p-4 border-b text-gray-800">👥 Employee Commutes</h3>
            <div className="max-h-96 overflow-y-auto">
              {commuteData
                .sort((a, b) => (b.walkingDuration || 0) - (a.walkingDuration || 0))
                .map((employee) => (
                  <div key={employee.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                    <div className="font-medium text-gray-800">{employee.name}</div>
                    <div className="text-sm text-gray-600 mb-1">{employee.address}</div>
                    <div className="flex flex-col space-y-1">
                      {employee.walkingDuration && (
                        <div className="text-sm">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            employee.walkingDuration > 45 ? 'bg-red-100 text-red-800' :
                            employee.walkingDuration > 30 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            🚶 {employee.walkingDuration} min walk • {employee.walkingDistance} km
                          </span>
                        </div>
                      )}
                      {employee.drivingDuration && (
                        <div className="text-sm">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            employee.drivingDuration > 20 ? 'bg-red-100 text-red-800' :
                            employee.drivingDuration > 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            🚗 {employee.drivingDuration} min drive • {employee.drivingDistance} km
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="w-2/3 relative">
        <div ref={mapContainer} className="w-full h-full" />
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <div className="text-sm space-y-3 text-black">
            <h4 className="font-medium mb-2">Map Legend</h4>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
              <span className="font-medium">Office Location (draggable)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
              <span className="font-medium">Employee Locations</span>
            </div>
            <div className="mt-3 space-y-1">
              <div className="font-medium mb-1">Commute Times:</div>
              <div className="ml-2">🚶 Walking: 🟢 ≤30 min • 🟡 30-45 min • 🔴 &gt;45 min</div>
              <div className="ml-2">🚗 Driving: 🟢 ≤10 min • 🟡 10-20 min • 🔴 &gt;20 min</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeLocationPlanner;