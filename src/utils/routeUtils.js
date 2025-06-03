  export function beforeRouteEnter(to, from, next) {
    document.title = `C8 Vortex - ${to.meta.title || ''}`;
    next();
  }

  export function beforeRouteUpdate(to, from, next) {
    document.title = `C8 Vortex - ${to.meta.title || ''}`;
    next();
  }