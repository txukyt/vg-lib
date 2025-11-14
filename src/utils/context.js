export function getVgContext() {
  if (window.vgLibConfig?.context) return window.vgLibConfig.context;

  const attrContext = document.currentScript?.dataset.vgContext
    || document.body?.dataset?.vgContext;

  if (attrContext) return attrContext;

  const host = window.location.hostname;
  if (host.includes('dintra')) return 'intranet';
  if (host.includes('dcomunicaciones')) return 'comunicaciones';
  if (host.includes('dblog')) return 'blog';

  return 'www'; // valor por defecto
};
