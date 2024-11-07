type WeatherProps = {
    temperature: number;
    weather: string;
    location: string;
  };
  
  export const Weather = ({ temperature, weather, location }: WeatherProps) => {
    return (
      <div className="max-w-sm mx-auto p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold text-center">Weather in {location}</h2>
        <div className="flex flex-col items-center space-y-2">
          <p className="text-xl">Condition: <span className="font-medium">{weather}</span></p>
          <p className="text-3xl font-bold">{temperature}°C</p>
        </div>
      </div>
    );
  };
  