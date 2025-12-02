import{r as o}from"./index-0e60331d.js";const r=o(!1),n=o(""),a=o("success"),i=(s,e="success",t=3e3)=>{n.value=s,a.value=e,r.value=!0,setTimeout(()=>{r.value=!1},t)},c=s=>`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 transition-all duration-300 ${{success:"bg-green-500 text-white",error:"bg-red-500 text-white",warning:"bg-yellow-500 text-white",info:"bg-blue-500 text-white"}[s]}`,h=s=>({success:`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>`,error:`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>`,warning:`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
    </svg>`,info:`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`})[s];export{h as a,n as b,i as c,c as g,a as m,r as s};
