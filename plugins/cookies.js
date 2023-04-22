function setCookie(name, value) {
   const projectName = process.env.PROJECT_NAME; // or you can retrieve this dynamically
   document.cookie = `${projectName}_${name}=${value}; path=/`;
}

function getCookie(name) {
   const projectName = process.env.PROJECT_NAME; // or you can retrieve this dynamically
   const cookieName = `${projectName}_${name}=`;
   const decodedCookie = decodeURIComponent(document.cookie);
   const cookieArray = decodedCookie.split(';');
   for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
         cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
         return cookie.substring(cookieName.length, cookie.length);
      }
   }
   return '';
}

function setLocalStorage(name, value) {
   const projectName = process.env.PROJECT_NAME; // or you can retrieve this dynamically
   localStorage.setItem(`${projectName}_${name}`, value);
}

function getLocalStorage(name) {
   const projectName = process.env.PROJECT_NAME; // or you can retrieve this dynamically
   return localStorage.getItem(`${projectName}_${name}`);
}

export default { setCookie, getCookie, setLocalStorage, getLocalStorage }