import Gio from "gi://Gio";
import Adw from "gi://Adw?version=1";
import GObject from "gi://GObject";

import { MainWindow } from "./MainWindow.js";

class _Application extends Adw.Application {
  constructor(
    constructProperties = {
      application_id: "com.<user>.<name>",
      flags: Gio.ApplicationFlags.FLAGS_NONE,
    }
  ) {
    super(constructProperties);
  }

  override vfunc_activate() {
    super.vfunc_activate();
    let win = this.active_window;
    if (!win) {
      win = new MainWindow({
        title: "<name>",
        default_width: 800,
        default_height: 800,
        application: this,
      });
    }

    win.present();
  }
}

/** Main Application class */
const Application = GObject.registerClass(
  {
    GTypeName: "Application",
  },
  _Application
);

/** Run the main application */
const main = () => {
  console.debug("Adw.VERSION_S : ", Adw.VERSION_S);
  // The proper way to run a Gtk.Application or Gio.Application is take ARGV and
  // prepend the program name to it, and pass that to run()
  const app = new Application();
  // app.run([System.programInvocationName, ...ARGV]);
  app.run([imports.system.programInvocationName].concat(ARGV));
};

main();
