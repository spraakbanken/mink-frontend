export { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
// Find icons at https://fontawesome.com/search
// Use them as in https://fontawesome.com/docs/web/use-with/vue/add-icons
import {
  faFile,
  faFileCode,
  faFileLines,
  faFileZipper,
  faFloppyDisk,
  faSquarePlus,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import {
  faGears,
  faPen,
  faPersonRunning,
  faRightToBracket,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faFile,
  faFileCode,
  faFileLines,
  faFileZipper,
  faFloppyDisk,
  faGears,
  faPen,
  faPersonRunning,
  faRightToBracket,
  faSquarePlus,
  faTrashCan,
  faUserPlus
);
