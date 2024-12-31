import Gtk from "gi://Gtk?version=4.0";
import GObject from "gi://GObject";

export class IMainWindow extends Gtk.ApplicationWindow {
  constructor(config: Partial<Gtk.ApplicationWindow.ConstructorProps>) {
    super(config);

    const container = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });
    container.set_margin_bottom(15);
    container.set_margin_top(15);
    container.set_margin_end(15);
    container.set_margin_start(15);

    container.append(new Gtk.Label({ label: "Hello World" }));

    this.set_child(container);

    // Create a Key Event Controller for the window
    const key_controller = new Gtk.EventControllerKey();
    this.add_controller(key_controller);

    key_controller.connect(
      "key-pressed",
      (controller, keyval, keycode, state) => {
        console.debug(`window key pressed : ${keyval}, ${keycode}`);

        return false; // Let other handlers process the event if it's not Escape
      }
    );
  }
}

export const MainWindow = GObject.registerClass(
  {
    GTypeName: "Window",
  },
  IMainWindow
);
