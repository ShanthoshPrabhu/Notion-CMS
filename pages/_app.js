import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css'

function MyApp({ Component, pageProps:{session,...pageProps} }) {
  return (
    <>
      
     <SessionProvider>
     <Component {...pageProps} />
     </SessionProvider>
    </>
  );
}
export default MyApp
