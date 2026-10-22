# VAANew

Vasantha Ads & Arts website (static HTML + SCSS).

## Styles

`assets/css/main.css` is **compiled from `assets/scss/`** - edit the SCSS, not the CSS.

```
npx sass --style=expanded assets/scss/main.scss assets/css/main.css
```

(or use the VS Code "Live Sass Compiler" extension on `assets/scss/main.scss`).

## Themes

Six themes share one set of colour tokens, defined in `assets/scss/utils/_colors.scss`. The button at the
bottom right opens a picker; the choice is stored in `localStorage['vaa-theme']` and applied before first
paint by the inline snippet in each page's `<head>`.

| Theme | `data-theme` | Look |
| --- | --- | --- |
| Ink & Lime (default) | `light` | white pages, charcoal type, lime accent |
| Midnight Lime | `dark` | charcoal pages, cream type, lime accent |
| Sand & Ember | `ember` | warm cream pages, brown type, peach accent |
| Ocean Mist | `ocean` | cool white pages, navy type, sky accent |
| Violet Dusk | `dusk` | deep violet pages, lavender-white type, lavender accent |
| Forest Mint | `forest` | deep green pages, mint-white type, mint accent |

- `$palette` - the original brand colours. Same in every theme.
- `$themes` - role tokens per theme (`paper`, `fg`, `accent`, `line`, ...). **Retune a theme here.**
- `$islands` - optional tint for the fixed bands (see below) per theme.
- Components never hard-code colours; they use the `--vaa-*` roles or the legacy `--rr-*` aliases.
- `assets/scss/theme/_themes.scss` decides where a theme applies. The `$fixed-surfaces` list holds the
  areas that keep their own background in every theme (accent hero, charcoal footer / breadcrumb bands...).
  Add a selector there if a new section has a fixed background.
- Accents must be light enough to carry dark text - the hero and highlights put `fg` text on them.

To add a theme: copy a map in `$themes` (add an `$islands` entry if its bands should be tinted), then add
`{ id, label }` to `THEMES` in `assets/js/components/theme-switcher.js`. The CSS and picker swatch are generated.

## Shared layout (web components)

Every page uses the same two custom elements, defined in `assets/js/components/`:

```html
<header><site-header variant="dark" active="about"></site-header></header>
...
<footer><site-footer></site-footer></footer>
```

- `<site-header>` (`site-header.js`) renders the off-canvas drawer, the header bar and the search popup.
  `variant`: `home` (lime hero, search icon), `dark` (over a charcoal banner, "Let's Talk" button),
  `light` (over a light page). `active`: `home | about | services | works | contact` highlights the nav link.
  Edit the nav in `NAV_LINKS` at the top of the file.
- `<site-footer>` (`site-footer.js`) renders the closing banner, footer links and back-to-top. Edit its links in `MENU_LINKS`.

Both scripts are loaded in each page's `<head>`, so the markup exists before `main.js` binds its handlers.
