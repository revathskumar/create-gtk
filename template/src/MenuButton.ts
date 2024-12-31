import Gtk from "gi://Gtk?version=4.0";
import GObject from "gi://GObject";
import Gio from "gi://Gio";

const APP_MENU = `
<?xml version="1.0" encoding="UTF-8"?>
<interface>
<menu id='app-menu'>
  <section>
    <item>
      <attribute name='label' translatable='yes'>_About</attribute>
      <attribute name='action'>win.about</attribute>
    </item>
    <item>
      <attribute name='label' translatable='yes'>_Quit</attribute>
      <attribute name='action'>win.quit</attribute>
    </item>
  </section>
</menu>
</interface>
`;

/**
 * Wrapper class for at Gtk.Menubutton with a menu defined
 * in a Gtk.Builder xml string
 */
export class IMenuButton extends Gtk.MenuButton {
  constructor(config: Partial<Gtk.MenuButton.ConstructorProps> = {}) {
    super(config);
    const xml = APP_MENU;
    const name = "app-menu";
    const icon_name = "open-menu-symbolic";

    const builder = new Gtk.Builder();
    builder.add_from_string(xml, xml.length);
    const menu = builder.get_object(name) as Gio.MenuModel; // TODO: ts-for-gir: Use Generics here
    this.set_menu_model(menu);
    this.set_icon_name(icon_name);
  }
}

export const MenuButton = GObject.registerClass(
  {
    GTypeName: "MenuButton",
  },
  IMenuButton
);
