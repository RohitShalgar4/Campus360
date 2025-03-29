import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    // Create a container for the portal if it doesn't exist
    let container = document.getElementById('portal-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'portal-root';
      document.body.appendChild(container);
    }
    setPortalContainer(container);
    setMounted(true);

    return () => {
      // Clean up the container if it's empty
      if (container && container.children.length === 0) {
        document.body.removeChild(container);
      }
    };
  }, []);

  if (!mounted || !portalContainer) {
    return null;
  }

  return createPortal(children, portalContainer);
};

export default Portal; 