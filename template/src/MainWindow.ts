import Gtk from "gi://Gtk?version=4.0";
import GObject from "gi://GObject";
import Gio from "gi://Gio";
import GLib from "gi://GLib";
import Adw from "gi://Adw?version=1";

import pkg from "../package.json" with { type: "json" };

import { MenuButton } from "./MenuButton.js";

export class IMainWindow extends Gtk.ApplicationWindow {
  constructor(config: Partial<Gtk.ApplicationWindow.ConstructorProps>) {
    super(config);

    const menu = new MenuButton();

    this.createAction("about", this.#menuHandler.bind(this));
    this.createAction("quit", this.#menuHandler.bind(this));
    const headerBar = new Gtk.HeaderBar();
    headerBar.pack_end(menu);
    this.set_titlebar(headerBar);

    const container = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });
    container.set_margin_bottom(15);
    container.set_margin_top(15);
    container.set_margin_end(15);
    container.set_margin_start(15);

    container.append(new Gtk.Label({ label: "Hello World" }));

    const toastOverlay = new Adw.ToastOverlay();
    const toastBtn = new Gtk.Button({label: 'Click to Toast'});

    toastBtn.connect('clicked', () => {
      toastOverlay.add_toast(Adw.Toast.new("Hello"));
    })
    container.append(toastBtn);

    container.append(toastOverlay);

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

  /** Callback for  menu actions */
  #menuHandler(action: Gio.SimpleAction) {
    const name = action.get_name();
    console.debug(`active ${name}`);
    if (name === "quit") {
      this.close();
    }
    if (name === "about") {
      let aboutParams = {
        transient_for: this,
        application_name: "<project.name>",
        application_icon: "com.<user>.<project.name>",
        developer_name: "<user>",
        version: pkg.version,
        developers: ["<user>"],
        copyright: "© <year> <user>",
      };
      const aboutWindow = new Adw.AboutWindow(aboutParams);
      aboutWindow.present();
    }
  }

  /** Add an Action and connect to a callback */
  public createAction(
    name: string,
    callback: (
      $obj: Gio.SimpleAction,
      parameter?: GLib.Variant | null | undefined
    ) => void
  ) {
    const action = Gio.SimpleAction.new(name, null);
    action.connect("activate", callback);
    this.add_action(action);
  }
}

export const MainWindow = GObject.registerClass(
  {
    GTypeName: "Window",
  },
  IMainWindow
);
