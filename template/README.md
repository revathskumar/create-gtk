## <name>

## Setup

### Install dependencies

* libgtk4
* libadwaita
* gjs

```sh
sudo apt install libgtk-4-1 libgtk-4-dev libadwaita-1-dev
```

```sh
npm i
npm run build
```

## Usage

```sh
gjs -m dist/index.js
```

#### with debug logs

```sh
G_MESSAGES_DEBUG=all gjs -m dist/index.js
```

## License

[MIT]

[MIT]: /LICENSE
