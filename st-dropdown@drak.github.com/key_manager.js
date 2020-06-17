const Lang = imports.lang;
const Main = imports.ui.main;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;

let KeyManager = new Lang.Class({
  Name: 'MyKeyManager',

  _init: function() {
    this.grabbers = new Map();

    global.display.connect(
      'accelerator-activated',
      Lang.bind(this, function(display, action, deviceId, timestamp) {
        //log('Accelerator Activated: [display={}, action={}, deviceId={}, timestamp={}]', display, action, deviceId, timestamp);
        this._onAccelerator(action);
      }))
  },

  listenFor: function(accelerator, callback) {
    //log('Trying to listen for hot key [accelerator={}]', accelerator);
    let action = global.display.grab_accelerator(accelerator);

    if( action == Meta.KeyBindingAction.NONE ) {
      //log('Unable to grab accelerator [binding={}]', accelerator);
    } else {
      //log('Grabbed accelerator [action={}]', action);
      let name = Meta.external_binding_name_for_action(action);
      //log('Received binding name for action [name={}, action={}]',name, action);

      //log('Requesting WM to allow binding [name={}]', name);
      Main.wm.allowKeybinding(name, Shell.ActionMode.ALL);

      this.grabbers.set(action, {
        name: name,
        accelerator: accelerator,
        callback: callback,
        action: action
      });
    }
  },

  _onAccelerator: function(action) {
    let grabber = this.grabbers.get(action);

    if( grabber ) {
      this.grabbers.get(action).callback();
    } else {
      //log('No listeners [action={}]', action);
    }
  }
});
