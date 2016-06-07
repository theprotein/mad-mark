# Bemark

Static site generator based on Markdown and [bem-xjst](https://github.com/bem/bem-xjst). Motivation is easy modular component based way to build static sites from simple markdown files.

To match this needs Bemark uses:
* extendable [`bemhtml`](https://github.com/bem/bem-xjst/blob/master/docs/en/5-templates-syntax.md) templates provided by `bem-xjst`;
* [`bem-components`](https://github.com/bem/bem-xjst) as rich library of ready ui blocks;
* [`PostCSS`](https://github.com/postcss/postcss) for css transformations;
* [`PostHTML`](https://github.com/posthtml/posthtml) to transform compiled markdown into tree of blocks passed to `bem-xjst`;
* [Filesystem organisation for BEM projects](https://en.bem.info/methodology/filesystem/#file-system-organization-of-a-bem-project).

## Installation

> npm i -g --save-dev bemark

## Usage

Bemark can work standalone and in existing project like cli-tool for static content generation. Documentation for any project will be the best example. Bemark can help to build local and online documentation in easy way. Also you can write blog, artciles and anything from your mind ;)

## Init

You should choose cwd directory for your content in Markdown, output directory for generated content and languages for i18n. Bemark support i18n as well. First language will be used as default.

> bemark init -i static -o dist -l en,ru

After that Bemark generate base project structure in `static` folder:

```
- static
  - content
    - articles
      - index.en.md
      - index.ru.md
    - index.en.md
    - index.ru.md
  - themes
    - <project-name>
      - .gitkeep
  - config.js
  - i18n.js
```

## Build

_You need globally installed [enb](https://www.npmjs.com/package/enb) for right build._
You can build all content in two ways. Firstly, it's simple command:

> bemark build -i static

After that you can open generated content as html files `open dist/index.html`.
You can see generated folder structure below:

```
- dist
  - artciles
    - index.html
    - index.ru.html
  - css
    - styles.min.css
  - js
    - scripts.min.js
  - .nojekyll
  - index.html
  - index.ru.html
```

Second way to build your site is the dev-server which based on [browser-sync](browsersync.io).

> bemark server -i static

Point your browser to [http://localhost:3000](http://localhost:3000). Now you can edit your content, templates and configs with live-reloading ;)

## Content

To generate static pages put markdown files into `content/*` with lang suffixes (e.g. `index.en.md`).
You may use yaml header to set title and tags like this:

```md
---
title: Post title
tags:
    - tag1
    - tag2
    - tag3
---

# Markdown content
```

Every markdown page will be wrapped in layout which is based on [bemhtml](https://en.bem.info/technology/bemhtml/v2/intro) templates for [bem-xjst](https://github.com/bem/bem-xjst) engine.

## Layouts

When you put your pages into `content/**/*` each of them get layout name based on folder name where they stay. For example file in `content/artiсles/index.en.md` has `articles` layout. If file stay in the root of `content` folder so it has `root` layout ;) What does it mean for you? It's an unlimited number of possibilities for content customization. For example put template below to `static/themes/<theme-name>/page/_layout/page_layout_articles.bemhtml.js`:

``` js
block('page').mod('layout', 'articles')(
  content()(function() {
    return [
      {
        elem: 'header',
        content: {
          block: 'header',
          content: [
          	{
              tag: 'h1',
              content: 'Article layout'
            },
            {
	          tag: 'h2',
              content: `It's name: ${this._name}`
            }
          ]
        }
      },
      {
        elem: 'content',
        content: this.ctx.content
      },
      {
        elem: 'footer',
        content: {
          block: 'footer',
          content: 'Copyright by Superhero!'
        }
      },
      this.ctx.scripts
    ];
  })
);

```

## Themes

You can collect your components for layouts in `static/themes/<theme-name>`. One default theme with your project name was created for you by `bemark init` command.
Theme folders follows [Filesystem organisation for BEM projects](https://en.bem.info/methodology/filesystem/#file-system-organization-of-a-bem-project).
Component is the subfolder of theme for entity with `*.bemhtml.js`, `*.css` and `*.js` implementation. For example you can write component for header. Put template below to `static/themes/<theme-name>/header/header.bemhtml.js`:

``` js
block('header')(
  content()(function() {
    return [
      {
        tag: 'h1',
    	content: 'Article layout'
      },
      {
        tag: 'h2',
        content: `It's name: ${this._name}`
      }
    ];
  })
);
```
Rewrite layout for `articles` to use `header` component:

``` js
block('page').mod('layout', 'articles')(
  content()(function() {
    return [
      {
        elem: 'header',
        content: {
          block: 'header'
        }
      },
      {
        elem: 'content',
        content: this.ctx.content
      },
      {
        elem: 'footer',
        content: {
          block: 'footer',
          content: 'Copyright by Superhero!'
        }
      },
      this.ctx.scripts
    ];
  })
);
```
[Describe dependency](https://en.bem.info/technology/deps/about/#depsjs-syntax) in `static/themes/<theme-name>/page/page.deps.js`:
```js
({
  shouldDeps: { block: 'header' }
})
```

Run `bemark server -i static` to watch result at the same time.

You can use many themes in one project. Make sure your themes is defined in [config](#config). All of them is active in the same time and used as [redefinition levels](https://en.bem.info/methodology/key-concepts/#redefinition-level).

## Config

`config.js` is the simple commonJs module:

``` js
module.exports = {
  langs: ['en', 'ru'],
  themes: ['<theme-name>', ...], // all sub folders names from `themes` folder
  output: './dist',
  minify: true // minify css and js by default
};
```

Config data is exposed to your templates as `this._config` helper.

## Template helpers

### Grid Layout

For better content layout use `blocks` provided by [bem-grid](https://github.com/bem-contrib/bem-grid#easy-example) - modular grid system based on [Lost](https://github.com/peterramsing/lost).
Describe dependencies in `static/themes/<theme-name>/page/page.deps.js` to make it available in your layout templates:
```js
({
  shouldDeps: [
    // from previous example
    { block: 'header' },
    // provided by `bem-grid`
    { block: 'row' },
    { block: 'mq' }
  ]
})
```

### Ready components

Use rich set of ready components, provided by [`bem-components`](https://github.com/bem/bem-components) library.
You should also describe corresponded dependncies in your components `*.deps.js` files to make it available in templates.

### Meta

Components or layouts may require extra information about your markdown, project, other files, languages, paginations and etc. Bemark know this problem ;)

You can get information below in body of your templates by call `this._*`, ex `this._name`, `this._config`:

``` js
{
  _tags, // Array - parsed tags for all pages from meta in yml
  _pagination, // Object - data for pagination
  _paginatable, // Boolean - need pagination
  _config, // Object - project config
  _multilang, // Boolean - many langs
  _name, // String - page name
  _meta, // Object - parsed meta from yml in Markdown file
  _layout, // String - layout name
  _i18n, // Object - i18n translations
  _lang, // String - page lang
  _mods // Object - layout modificators
}
```

### i18n meta

`i18n.js` is the simple commonJs module:

``` js
module.exports = {
  en: {
    title: 'Title in english',
    subtitle: 'Subtitile in en'
  },
  ru: {
    title: 'Title in russian',
    subtitle: 'Subtitile in ru'
  },
  ...
};
```

You can use this information in your templates in this maner:

``` js
// static/themes/<project-name>/header/header.bemhtml.js
block('header')(
  content()(function() {
    const i18n = this._i18n[this._lang];
    return [
      {
        tag: 'h1',
    	content: i18n.title
      },
      {
        tag: 'h2',
        content: i18n.subtitle
      }
    ];
  })
);
```

## Markdown transform

By default Bemark transform Markdown to posthtml-tree and apply plugins for semantic
and bemjson content. You can use custom posthtml-plugins by config:

``` js
module.exports = {
  ...
  posthtmlPlugins: [].concat(
    require('bemark').posthtmlPlugins,
    require('custom-posthtml-plugin')
  )
};
```

Browse [PostHTML plugins directory](https://github.com/posthtml/posthtml#plugins) to find them all ;)

## CSS transform

You can write CSS for [PostCSS](https://github.com/postcss/postcss). List of used plugins:

``` js
[
  'postcss-import',
  'postcss-mixins',
  'postcss-each',
  'postcss-simple-vars',
  'lost',
  'postcss-cssnext',
  'postcss-nested',
  'postcss-url',
  'postcss-font-magician',
  'postcss-browser-reporter',
  'postcss-reporter'
]
```

### License MIT
