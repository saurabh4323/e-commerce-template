import './globals.css';

export const metadata = {
  title: 'Manish Jewellery | Crafting Timeless Elegance Since 1985',
  description: 'Discover exquisite handcrafted gold and diamond jewellery at Manish Jewellery. Check live gold & silver rates in India. Premium jewellery for every occasion.',
  keywords: 'gold jewellery India, diamond jewellery, gold rate today, silver rate India, Manish Jewellery',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
