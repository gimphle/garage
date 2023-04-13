import SelectedLevelProvider from '@/contexts/level-context';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SelectedLevelProvider>
            <Component {...pageProps} />
        </SelectedLevelProvider>
    );
}
