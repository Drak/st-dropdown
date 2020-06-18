# ST Drop-down
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE.md)

ST Drop-down is an awesome extension for Gnome Shell
that provides drop-down functionality to [ST - Simple Terminal](https://st.suckless.org/). 

### Features

* Drop-down.

![Feature 1](./resources/feature1.gif "Feature 1")

* Multiple monitors.

![Feature 2](./resources/feature2.gif "Feature 2")

* Smooth transition effects.

* Elegant presentation with 90% of width and 90% of height.

* Compatible with any linux distribution which has GNOME desktop environment.
  
### Manual install

#### From graphical interface

* Download the files corresponding to the repository.
* Decompress and copy the directory `st-dropdown@drak.github.com` to gnome shell extension directory `.local/share/gnome-shell/extensions`.
* Reload `gnome-shell` by pressing <kbd>Alt</kbd> + <kbd>F2</kbd> and entering <kbd>r</kbd>.
* Enable the extension using [GNOME Tweaks](https://wiki.gnome.org/Apps/Tweaks).

#### From terminal
```bash
    # Clone repository
    git clone https://github.com/drak/st-dropdown.git

    # Enter cloned directory
    cd st-dropdown

    # Copy to extensions directory
    cp -r st-dropdown@drak.github.com -t ~/.local/share/gnome-shell/extensions

    # Activate
    gnome-shell-extension-tool -e st-dropdown@drak.github.com
```

Finally, reload GNOME Shell by pressing <kbd>Alt</kbd> + <kbd>F2</kbd> and entering <kbd>r</kbd> .

### Dependencies

ST Drop-down depends on:

* [ST - Simple Terminal](https://st.suckless.org/)
* [GNOME Tweaks](https://wiki.gnome.org/Apps/Tweaks)
* xdotool

### Usage

Press <kbd>F12</kbd> to drop down and up ST. 

### LICENSE
[GNU GPL v3](LICENSE.md)
