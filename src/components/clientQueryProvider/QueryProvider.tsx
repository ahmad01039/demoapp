// components/ClientQueryClientProvider.tsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// const ClientQueryClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [queryClient] = useState(new QueryClient()); 

//   if (!queryClient) return null; 

//   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
// };

// export default ClientQueryClientProvider;
// components/ClientQueryClientProvider.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const ClientQueryClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize a single instance of QueryClient
  const [queryClient] = useState(new QueryClient());

  if (!queryClient) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Add React Query Devtools here */}
      <ReactQueryDevtools initialIsOpen={false}  />
    </QueryClientProvider>
  );
};

export default ClientQueryClientProvider;
