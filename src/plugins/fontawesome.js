// https://docs.fontawesome.com/web/use-with/vue/add-icons

// set "fa" as shorthand for fontawesome icon
/*
  Example:
    <fa icon="fa-thin fa-house" />
    <fa icon="fa-light fa-house" />
    <fa icon="fa-regular fa-house" />
    <fa icon="fa-solid fa-house" />
    <fa icon="fa-duotone fa-house" />
    or
    <fa :icon="[ 'fat', 'house' ]" />
    <fa :icon="[ 'fal', 'house' ]" />
    <fa :icon="[ 'far', 'house' ]" />
    <fa :icon="[ 'fas', 'house' ]" />
    <fa :icon="[ 'fad', 'house' ]" />
*/

// Import FontAwesome core
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
  faUser, faHome, faEnvelope, faEnvelopeOpenText, faProjectDiagram, faChartLine,
  faLink, faQrcode, faEye, faDownload, faPlus, faCopy, faTimes,
  faCheck, faExclamationTriangle, faInfo, faArrowRight, faBars,
  faSearch, faCog, faSignOutAlt, faCode, faLaptopCode, faBolt,
  faDatabase, faServer, faCube, faCloud, faLeaf, faToolbox,
  faRobot, faShieldAlt, faFolderOpen, faRocket, faLayerGroup,
  faLock, faIcons, faSun, faMoon, faStickyNote, faChevronRight,
  faMapMarkerAlt, faGlobe, faStar, faSync, faRedo, faChevronUp, faChevronDown,
  faWandMagicSparkles, faMagic, faClose, faTrash, faGem, faHeart, faCrown
} from '@fortawesome/free-solid-svg-icons';
// brands

import {
  faGithub, faTwitter, faLinkedin, faVuejs, faJs, faCss3Alt,
  faSass, faCloudflare, faNodeJs, faGitAlt, faGoogle, faKaggle, faCodepen, faBehance
} from '@fortawesome/free-brands-svg-icons';

// Add icons to library
library.add(
  faUser, faHome, faEnvelope, faEnvelopeOpenText, faProjectDiagram, faChartLine,
  faLink, faQrcode, faEye, faDownload, faPlus, faCopy, faTimes,
  faCheck, faExclamationTriangle, faInfo, faArrowRight, faBars,
  faSearch, faCog, faSignOutAlt, faCode, faLaptopCode, faBolt,
  faDatabase, faServer, faCube, faCloud, faLeaf, faToolbox,
  faRobot, faShieldAlt, faFolderOpen, faRocket, faLayerGroup,
  faLock, faIcons, faSun, faMoon, faStickyNote, faChevronRight,
  faMapMarkerAlt, faGlobe, faStar, faSync, faRedo, faChevronUp, faChevronDown,
  faWandMagicSparkles, faMagic, faClose, faTrash, faGem, faHeart, faCrown,
  faGithub, faTwitter, faLinkedin, faVuejs, faJs, faCss3Alt,
  faSass, faCloudflare, faNodeJs, faGitAlt, faGoogle, faKaggle, faCodepen, faBehance
);

export default FontAwesomeIcon;
