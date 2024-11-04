

import Link from 'next/link';

export default function Page() {
  return (
    <>
      <h1>Welcome to the App!</h1>
      <Link href="/dashboard">Go to Dashboard</Link>
      <br />
      <Link href="/second">Go to Second Page</Link>
    </>
  );
}
