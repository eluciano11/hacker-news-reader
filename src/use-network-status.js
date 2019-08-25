import { useEffect, useState } from 'react';

/**
 * Higher ordered component that will verify the network state of the
 * system. When the network state changes the WrappedComponent will re-render and
 * will receive an isOnline flag.
 *
 * @param {Object} WrappedComponent - Component to decorate.
 */
function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const toggleNetworkState = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', toggleNetworkState);
    window.addEventListener('offline', toggleNetworkState);

    return () => {
      window.removeEventListener('online', toggleNetworkState);
      window.removeEventListener('offline', toggleNetworkState);
    };
  }, []);

  return { isOnline };
}

export default useNetworkStatus;
