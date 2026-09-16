# Fonts

The `.woff2` files in this directory are the Latin and Latin-Extended subsets of
three typefaces, all released under the **SIL Open Font License, Version 1.1**.
They are self-hosted so the site makes no third-party request on page load.

| Family | Files | Upstream |
| --- | --- | --- |
| Bricolage Grotesque | `bricolage-grotesque-500-*.woff2` (variable, 500–800) | <https://github.com/ateliertriay/bricolage> |
| IBM Plex Mono | `ibm-plex-mono-{400,500,600}-*.woff2` | <https://github.com/IBM/plex> |
| Karla | `karla-400-*.woff2` (variable, 400–700) | <https://github.com/googlefonts/karla> |

The OFL permits redistribution and web embedding of these files, bundled or
sold with other software, provided they are not sold on their own and the
license travels with them. Full license text:
<https://openfontlicense.org/open-font-license-official-text/>

To refresh a subset, take the `latin` and `latin-ext` `@font-face` blocks that
`fonts.googleapis.com/css2` serves for the family and download the `.woff2`
each one points at, then update the matching rules at the top of
`../css/site.css`.
