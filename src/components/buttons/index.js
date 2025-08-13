import { toggleButtonProto } from "@/components/buttons/tooglePrototype.js";

function toggleButtonFactory(btn) {
  const instance = Object.create(toggleButtonProto);
  instance.init(btn);
  return instance;
}

export function init() {
  const toggleButtons = document.querySelectorAll(".nav-link-toggle");
  toggleButtons.forEach((btn) => {
    toggleButtonFactory(btn);
  });
}