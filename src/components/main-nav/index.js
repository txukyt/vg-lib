// /src/js/components/main-nav/index.js
import MainNav from "@/components/main-nav/MainNav.js";

export const init = () => {
    if (__DEV__) console.log('⚙️ Inicializando <nav class="main-nav"> ...');
  new MainNav().mount();
};

