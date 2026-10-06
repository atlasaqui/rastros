// Coordinates refer to the inspected 1824 x 1361 previews, not inferred cell bounds.
// The renderer removes magenta only; white pixels inside each drawing are preserved.
import apps from '../assets/os-retro/Retro_operating_system_icon_sheet_2K_20261002160250.jpg';
import files from '../assets/os-retro/Create_eight_pixel_icons_2K_20261002161348.jpg';
import controls from '../assets/os-retro/Creating_retro_operating_system_…_2K_20261002161403.jpg';
import people from '../assets/os-retro/Create_pixel_art_avatar_board_2K_20261002162725.jpg';
import messenger from '../assets/os-retro/Creating_messenger_symbol_board_2K_20261002162743.jpg';
import login from '../assets/os-retro/Iwakura_OS_login_screen_design_2K_20261002163741.jpg';
const sprite=(src,rect,extra={})=>({src,rect,...extra});
export const OS_SPRITES = {
 computer:sprite(apps,[35,18,386,428]), documents:sprite(apps,[501,17,365,419]),
 files:sprite(apps,[931,69,420,339]), email:sprite(apps,[1387,98,422,311]),
 chat:sprite(apps,[19,486,420,367]), notes:sprite(files,[535,828,297,411]),
 cases:sprite(apps,[931,483,422,369]), trash:sprite(apps,[1428,470,337,393]),
 disk:sprite(files,[57,142,343,222]), optical:sprite(files,[524,106,310,286]),
 locked:sprite(files,[1436,122,332,310]), file:sprite(files,[80,828,298,412]),
 image:sprite(files,[993,828,296,412]), music:sprite(files,[1448,828,299,412]),
 minimize:sprite(controls,[94,198,270,70]), maximize:sprite(controls,[519,77,330,314]),
 restore:sprite(controls,[963,75,355,316]), close:sprite(controls,[1460,103,295,257]),
 info:sprite(controls,[48,468,361,394]), success:sprite(controls,[505,468,358,393]),
 error:sprite(controls,[963,468,357,393]), warning:sprite(controls,[1416,515,358,332]),
 back:sprite(controls,[63,970,331,317]), forward:sprite(controls,[519,970,332,317]),
 avatar:sprite(login,[463,460,158,159],{opaque:true}),
 avatarMurilo:sprite(people,[158,45,600,628]), avatarGerancio:sprite(people,[1070,89,590,584]),
 avatarPriscila:sprite(people,[177,729,553,632]), avatarRenata:sprite(people,[1088,723,561,638]),
 messengerUser:sprite(messenger,[43,148,372,386]), messengerSmile:sprite(messenger,[511,165,349,347]),
 online:sprite(messenger,[990,188,302,302]), away:sprite(messenger,[1447,164,305,323]),
 offline:sprite(messenger,[76,849,303,290]),
};
