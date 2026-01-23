export const init = async () => {
  if (document.body.classList.contains('entorno-www')) {
    const { default: NetworksManager } = await import('@/components/networks/NetworksManager');
    new NetworksManager();
  }
};