import { onMounted, onUnmounted } from "vue";
import { useToggle } from "@vueuse/core";

type EventHandler = (event: DragEvent) => void;

export default function useDropToPage(onDrop: EventHandler) {
  const [isDragover, setDragover] = useToggle();

  function myOnDrop(event: DragEvent) {
    event.preventDefault();
    onDrop(event);
    setDragover(false);
  }

  const pageEl: HTMLElement = document.querySelector("html")!;

  // For the dragover event, preventing default action means allowing the drop event.
  function onDragover(event: DragEvent) {
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
