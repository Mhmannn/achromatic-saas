import * as React from 'react';

export default function RootLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
