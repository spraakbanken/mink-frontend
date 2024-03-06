export { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
// Find icons at https://fontawesome.com/search
// Use them as in https://fontawesome.com/docs/web/use-with/vue/add-icons
import {
  faFile,
  faLightbulb,
  faSquareMinus,
  faSquarePlus,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import {
  faCircleInfo,
  faDownload,
  faGears,
  faPen,
  faPersonRunning,
  faRightToBracket,
  faRotate,
  faTriangleExclamation,
  faUserPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faCircleInfo,
  faDownload,
  faFile,
  faGears,
  faLightbulb,
  faPen,
  faPersonRunning,
  faRightToBracket,
  faRotate,
  faSquareMinus,
  faSquarePlus,
  faTrashCan,
  faTriangleExclamation,
  faUserPlus,
  faXmark,
);
