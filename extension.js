const Main = imports.ui.main;
const Shell = imports.gi.Shell;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const SucklessTerminal = Me.imports.suckless_terminal.SucklessTerminal;
const KeyManager = Me.imports.key_manager.KeyManager;

let st, keyManager;

function init() {
  st = new SucklessTerminal();
  keyManager = new KeyManager();
}

function enable() {
  keyManager.listenFor("f12", function() {
    st.toggleST();
  })
}

function disable() {
  for(let it of keyManager.grabbers) {
    global.display.ungrab_accelerator(it[1].action);
    Main.wm.allowKeybinding(it[1].name, Shell.ActionMode.NONE);
  }
}