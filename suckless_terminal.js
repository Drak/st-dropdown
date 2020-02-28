const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const GLib = imports.gi.GLib;
const Wnck = imports.gi.Wnck;

const previousMinimizeWindowAnimationTime = imports.ui.windowManager.MINIMIZE_WINDOW_ANIMATION_TIME;

class SucklessTerminal {

  constructor() {
    this.toggleST();
  }

  debugLog(msg) {
    log('----------------------------------------------------------------------------------------------');
    log(msg);
    log('----------------------------------------------------------------------------------------------');
  }

  initializeST() {
    this.stName = `st-${Date.now()}`;
    this.window = null;
    this.stPid = null;
    this.previousPosition = null;
    this.width = this.getPixels(90, Main.layoutManager.primaryMonitor.width);
    this.height = this.getPixels(90, Main.layoutManager.primaryMonitor.height);
    this.runST();
    this.isUp = false;
    this.minimizeWindowAnimationTime = 0;
  }

  restartMinimizeWindowAnimationTime() {
    imports.ui.windowManager.MINIMIZE_WINDOW_ANIMATION_TIME = previousMinimizeWindowAnimationTime;
  }

  setMinimizeWindowAnimationTime() {
    imports.ui.windowManager.MINIMIZE_WINDOW_ANIMATION_TIME = this.minimizeWindowAnimationTime;
  }

  getPixels(percentage, total) {
    return Math.round(total * percentage / 100 );
  }

  getWindow() {
    if( this.window === null )
      this.window = global.get_window_actors()
        .filter( w => w.get_meta_window().get_pid().toString() === this.getSTPid() )[0];
    return this.window;
  }

  checkSTPid() {
    let [, out, , status] = GLib.spawn_command_line_sync(`pgrep -f ${this.stName}`);
    return ( status === 0 )? out.toString().split('\n')[0]: null;
  }

  getSTPid() {
    if( this.stPid === null  ) {
      let [, out, , status] = GLib.spawn_command_line_sync(`pgrep -f ${this.stName}`);
      if( status === 0 ) this.stPid = out.toString().split('\n')[0];
    }
    return this.stPid;
  }

  getWindowID(pid) {
    let [, windowID] = GLib.spawn_command_line_sync(`xdotool search --sync --pid ${pid}`);
    return windowID.toString().split('\n')[0];
  }

  getPreviousPosition() {
    if( this.previousPosition === null )
      this.previousPosition = {x: Math.round(this.getWindow().get_transformed_position()[0]), y: Math.round(this.getWindow().get_transformed_position()[1])} ;
    return this.previousPosition;
  }

  runST() {
    GLib.spawn_command_line_async(`st -n ${this.stName} -e tmux`);
    let pid = this.getSTPid();
    if( pid ) {
      let windowID = this.getWindowID(pid);
      GLib.spawn_command_line_async(`
      xprop \
        -id ${windowID} \
        -f _MOTIF_WM_HINTS 32c \
        -set _MOTIF_WM_HINTS "0x2, 0x0, 0x0, 0x0, 0x0"`);
      GLib.spawn_command_line_async(`xdotool windowmove ${windowID} ${this.getPixels(5, Main.layoutManager.primaryMonitor.width)} 0`);
      GLib.spawn_command_line_async(`xdotool windowsize ${windowID} ${this.width} ${this.height}`);
      GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
        const wnckScreen = Wnck.Screen.get_default();
        wnckScreen.force_update();
        let windows = Wnck.Screen.get_default().get_windows().filter( w => w.get_pid().toString() === pid );
        if( windows.length > 0 ) {
          windows[0].set_skip_tasklist(true);
        }
        return false;
      });
    }
  }

  dropUp() {
    this.isUp = true;
    Tweener.addTween(this.getWindow(), {
      y: -this.getWindow().get_height(),
      time: .3,
      transition: 'easeOutSine',
      onComplete: () => {
        this.getWindow().hide();
        this.getWindow().get_meta_window().minimize();
      } });
  }

  dropDown() {
    this.isUp = false;
    this.setMinimizeWindowAnimationTime();
    this.getWindow().get_meta_window().activate(0);
    this.restartMinimizeWindowAnimationTime();
    this.getWindow().set_y(-this.getWindow().get_height());
    this.getWindow().get_meta_window().move_to_monitor(global.screen.get_current_monitor());
    Tweener.addTween(this.getWindow(), {
      y: this.getPreviousPosition().y,
      time: .3,
      transition: 'easeOutSine',
      onComplete: () => {
      } });
  }

  toggleST() {
    if( this.checkSTPid() === null ) this.initializeST();
    else {
      this.getPreviousPosition();
      let stWindowID = this.getWindowID(this.getSTPid());
      let [, activeWindowID] = GLib.spawn_command_line_sync(`xdotool getactivewindow`);
      activeWindowID = activeWindowID.toString().split('\n')[0];
      if( this.isUp ) this.dropDown();
      else if( stWindowID === activeWindowID ) this.dropUp();
      else this.dropDown();
    }
  }
}
