// Tailwind class for component
export const containerClass =
  "flex justify-center items-center fixed top-0 left-0 h-screen w-screen overflow-hidden bg-gray-100";

export const signUpContainer = (signinIn) =>
  `absolute top-0 h-full transition-all duration-[600ms] ease-in-out left-0 w-1/2 opacity-0 z-[1] ${
    !signinIn ? "translate-x-full opacity-100 z-[5]" : ""
  }`;

export const signInContainer = (signinIn) =>
  `absolute top-0 h-full transition-all duration-[600ms] ease-in-out left-0 w-1/2 z-[2] ${
    !signinIn ? "translate-x-full" : ""
  }`;

export const formClass =
  "bg-white flex items-center justify-center flex-col px-[50px] h-full text-center";

export const titleClass = "font-bold text-6xl mb-12 m-0";

export const inputClass =
  "bg-gray-200 border-none py-3 px-4 my-2 w-full";

export const buttonClass =
  "rounded-[40px] border border-[#ff4b2b] bg-[#ff4b2b] text-white text-xs font-bold py-3 px-[45px] tracking-wider uppercase transition-transform duration-75 active:scale-95 focus:outline-none";

export const ghostButtonClass =
  "rounded-[40px] border border-white bg-transparent text-white text-xl font-bold py-3 px-[45px] tracking-wider uppercase transition-transform duration-75 active:scale-95 focus:outline-none";

export const overlayContainer = (signinIn) =>
  `absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-[600ms] ease-in-out z-[100] ${
    !signinIn ? "-translate-x-full" : ""
  }`;

export const overlay = (signinIn) =>
  `bg-gradient-to-r from-[#6a11cb] via-[#2575fc] to-[#00b3b3] bg-no-repeat bg-cover bg-center text-white relative left-[-100%] h-full w-[200%] transform transition-transform duration-[600ms] ease-in-out ${
    !signinIn ? "translate-x-1/2" : ""
  }`;

export const overlayPanel =
  "absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transition-transform duration-[600ms] ease-in-out";

export const leftOverlayPanel = (signinIn) =>
  `${overlayPanel} -translate-x-[20%] ${!signinIn ? "translate-x-0" : ""}`;

export const rightOverlayPanel = (signinIn) =>
  `${overlayPanel} right-0 ${!signinIn ? "translate-x-[20%]" : ""}`;

export const paragraphClass =
  "text-xl  leading-5 tracking-wide mb-16";
