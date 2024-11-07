import { tool as createTool } from 'ai';
import { z } from 'zod';
export const flightDetailsTool = createTool({
    description: 'Display flight details for a specified city',
    parameters: z.object({
      city: z.string(),
    }),
    execute: async function ({ city }) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        city,
        flights: [
          {
            flightNumber: 'PK301',
            airline: 'Pakistan International Airlines',
            departureTime: '10:00 AM',
            arrivalTime: '12:00 PM',
            status: 'On Time'
          },
          {
            flightNumber: 'EK612',
            airline: 'Emirates',
            departureTime: '2:00 PM',
            arrivalTime: '4:30 PM',
            status: 'Delayed'
          },
          {
            flightNumber: 'QR632',
            airline: 'Qatar Airways',
            departureTime: '6:00 PM',
            arrivalTime: '8:30 PM',
            status: 'On Time'
          }
        ]
      };
    }
  });
export const weatherTool = createTool({
  description: 'Display the weather for a location',
  parameters: z.object({
    location: z.string(),
  }),
  execute: async function ({ location }) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { weather: 'Sunny', temperature: 30, location };
  },
});

export const tools = {
  displayWeather: weatherTool,
  displayFlightDetails: flightDetailsTool,
};