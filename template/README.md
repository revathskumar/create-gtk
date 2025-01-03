## <project.name>

## Setup

### Install dependencies

* libgtk4
* libadwaita
* gjs

```sh
sudo apt install libgtk-4-1 libgtk-4-dev libadwaita-1-dev
```

### Build

```sh
npm i
npm run build
```

## Usage

```sh
gjs -m dist/main.js
```

or

```sh
./bin/<project.name>
```

#### with debug logs

```sh
G_MESSAGES_DEBUG=all gjs -m dist/main.js
```

## Meson build

```sh
npm run build
meson setup --prefix=***/path/to/<project.name>/run/ builddir/
meson compile -C builddir/
meson install -C builddir/
```

## Usage

```sh
./run/bin/com.<user>.<project.name>
```

## License

[MIT]

[MIT]: /LICENSE
