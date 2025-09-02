import { toggleButtonProto } from "@/components/buttons/tooglePrototype.js";

function toggleButtonFactory(btn) {
  const instance = Object.create(toggleButtonProto);
  instance.init(btn);
  return instance;
}

export function init(root = document, className) {
  const toggleButtons = root.querySelectorAll(className);
  toggleButtons.forEach((btn) => {
    toggleButtonFactory(btn);
  });
}