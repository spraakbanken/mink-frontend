import { onMounted, onUnmounted } from "vue";
import { useToggle } from "@vueuse/core";

export default function useDropToPage(onDrop) {
  const [isDragover, setDragover] = useToggle();

  function myOnDrop(event) {
    event.preventDefault();
    onDrop(event);
    setDragover(false);
  }

  const pageEl = document.querySelector("html");

  // For the dragover event, preventing default action means allowing the drop event.
  function onDragover(event) {
    event.preventDefault();
    setDragover(true);
  }

  function onDragleave() {
    setDragover(false);
  }

  onMounted(() => {
    pageEl.addEventListener("dragover", onDragover);
    pageEl.addEventListener("dragleave", onDragleave);
    pageEl.addEventListener("drop", myOnDrop);
  });
  onUnmounted(() => {
    pageEl.removeEventListener("dragover", onDragover);
    pageEl.removeEventListener("dragleave", onDragleave);
    pageEl.removeEventListener("drop", myOnDrop);
  });

  return {
    isDragover,
  };
}
