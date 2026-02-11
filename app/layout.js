import { Poppins } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    variable: '--font-poppins',
});

export const metadata = {
    title: 'NXRDEN STORE',
    description: 'Premium Robux & Digital Goods Marketplace',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.variable} font-sans bg-white text-slate-900 flex flex-col relative min-h-screen antialiased`}>
                {children}
                <Footer />
            </body>
        </html>
    );
}
