import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function useProgress() {
  NProgress.configure({ showSpinner: false, trickleSpeed: 100 });
  const showPg = ref(false);
  function startPg() {
    setTimeout(() => {
      if (!showPg.value) NProgress.start();
    }, 1000);
  }
  function donePg() {
    showPg.value = true;
    NProgress.done();
  }

  return {
    showPg,
    startPg,
    donePg,
  };
}
