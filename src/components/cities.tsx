import React from 'react';
import { FaPlaneDeparture } from 'react-icons/fa'; 
type Flight = {
  flightNumber: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
};

type FlightDetailsProps = {
  city: string;
  flights: Flight[];
};
const FlightDetails: React.FC<FlightDetailsProps> = ({ city, flights }) => {
  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        <FaPlaneDeparture className="inline-block text-blue-600 mr-2" /> 
        Flight Details for {city}
      </h2>
      <div className="space-y-4">
        {flights.map((flight, index) => (
          <div
            key={index}
            className="flex flex-col space-y-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 shadow-md transition-transform transform hover:scale-105"
          >
            <div className="flex items-center space-x-2 text-lg font-semibold text-blue-800">
              <FaPlaneDeparture className="text-blue-600" />
              <span>{flight.airline} - Flight {flight.flightNumber}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <div>
                <span className="font-semibold">Departure:</span> {flight.departureTime}
              </div>
              <div>
                <span className="font-semibold">Arrival:</span> {flight.arrivalTime}
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-center font-medium ${
                flight.status === 'On Time'
                  ? 'bg-green-100 text-green-800'
                  : flight.status === 'Delayed'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              Status: {flight.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightDetails;

