if (__DEV__) {
  window.VgDev = window.VgDev || {};

  window.VgDev.listCookies = function () {
    if (!document.cookie) {
      console.log("⚠️ No hay cookies visibles desde JS");
      return;
    }
    const cookies = document.cookie.split(";").map(c => c.trim());
    console.group("🍪 Cookies actuales");
    cookies.forEach(c => console.log(c));
    console.groupEnd();
  };

  window.VgDev.clearCookie = function (name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    console.log(`🍪 Cookie "${name}" borrada`);
  };

  window.VgDev.clearAllCookies = function () {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
    console.log("🔥 Todas las cookies borradas");
  };

}
