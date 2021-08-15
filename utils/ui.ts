import Vue from "vue";

export function alert(message: string) {
  Vue.prototype.$msgbox({
    title: "錯誤",
    message: message,
    center: true,
    showClose: false,
    confirmButtonText: "確定"
  });
}
