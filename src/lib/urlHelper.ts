/**
 * Récupère l'URL de base dynamique en fonction du domaine/IP actuel
 * Pour localhost ou 127.0.0.1, retourne http://localhost:8000
 * Pour les autres IPs, utilise la même IP avec le port 8000
 */
export const getBaseUrl = (): string => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // Si c'est localhost ou 127.0.0.1, utiliser localhost:8000
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // Sinon, utiliser le même hostname avec le port 8000
  return `${protocol}//${hostname}:8000`;
};
