import GObject from "gi://GObject";
import Gtk from "gi://Gtk?version=4.0";
import Adw from "gi://Adw";

export const style_manager = Adw.StyleManager.get_default();

export class ThemeSelector extends Gtk.Widget {
  static {
    GObject.registerClass(
      {
        GTypeName: "ThemeSelector",
        Template: "resource:///com/vixalien/sticky/ui/theme-selector.ui",
        CssName: "themeselector",
        InternalChildren: ["follow"],
        Properties: {
          theme: GObject.param_spec_string(
            "theme",
            "Theme",
            "Theme",
            null,
            GObject.ParamFlags.READWRITE,
          ),
        },
      },
      this,
    );

    this.set_layout_manager_type(Gtk.BinLayout.$gtype);
  }

  theme: string;
  _follow!: Gtk.CheckButton;

  constructor(params = {}) {
    super(params);

    style_manager.connect(
      "notify::system-supports-color-schemes",
      this._on_notify_system_supports_color_schemes.bind(this),
    );
    this._on_notify_system_supports_color_schemes();

    const dark = style_manager.get_dark();
    this.theme = dark ? "dark" : "light";

    style_manager.connect("notify::dark", this._on_notify_dark.bind(this));
    this._on_notify_dark();
  }

  _on_notify_system_supports_color_schemes() {
    this._follow.set_visible(style_manager.get_system_supports_color_schemes());
  }

  _on_notify_dark() {
    if (style_manager.get_dark()) this.add_css_class("dark");
    else this.remove_css_class("dark");
  }
}
