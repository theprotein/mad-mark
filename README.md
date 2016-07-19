# Mad Mark

Static site generator based on Markdown and [bem-xjst](https://github.com/bem/bem-xjst).
Motivation is easy modular component based way to build static sites from simple markdown files.
Like Max but Mark ;)

To match this needs Mad Mark uses:
* extendable [`bemhtml`](https://github.com/bem/bem-xjst/blob/master/docs/en/5-templates-syntax.md) templates provided by `bem-xjst`;
* [`PostCSS`](https://github.com/postcss/postcss) for css transformations;
* [`PostHTML`](https://github.com/posthtml/posthtml) to transform compiled markdown into tree of blocks passed to `bem-xjst`;
* [Filesystem organisation](https://en.bem.info/methodology/filesystem/#file-system-organization-of-a-bem-project).

Watch __examples__ [here](https://github.com/awinogradov/bemark-examples).

## Installation

> npm i --save-dev mad-mark

## Usage

Mad Mark can work standalone and in existing project like cli-tool for static content generation. Documentation for any project will be the best example. Mad Mark can help to build local and online documentation in easy way. Also you can write blog, articles and anything from your mind ;)

## Init

You should choose cwd directory for your content in Markdown, output directory for generated content and languages for i18n. Mad Mark support i18n as well. First language will be used as default.

> mark init

After that Mad Mark generate base project structure:

```
├── config.js
├── content
│   ├── articles
│   │   └── index.en.md
│   └── index.en.md
├── i18n.js
├── package.json
└── themes
    └── <project-name>
```

## Build

You can build all content in two ways. Firstly, it's simple command:

> mark build

After that you can open generated content as html files `open dist/index.html`.
You can see generated folder structure below:

```
├── dist
│   ├── articles
│   │   └── index.html
│   ├── css
│   │   └── styles.min.css
│   ├── .nojekyll
│   ├── index.html
│   └── js
│       └── scripts.min.js
```

Second way to build your site is the dev-server which based on [browser-sync](browsersync.io).

> mark serve

Point your browser to [http://localhost:3000](http://localhost:3000). Now you can edit your content, templates and configs with live-reloading ;)

## Content

To generate static pages put markdown files into `content/*` with lang suffixes (e.g. `index.en.md`).
You may use `yaml` header to set title and tags like this:

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

You can collect your components for layouts in `static/themes/<theme-name>`. One default theme with your project name was created for you by `mark init` command.
Theme folders follows [filesystem organization for BEM projects](https://en.bem.info/methodology/filesystem/#file-system-organization-of-a-bem-project).
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
});
```

Run `mark serve` to watch result at the same time.

You can use many themes in one project. Make sure your themes is defined in [config](#config). All of them is active in the same time and used as [redefinition levels](https://en.bem.info/methodology/key-concepts/#redefinition-level).

## Config

`config.js` is the simple commonJs module:

``` js
module.exports = {
  debug: false, // false by default
  langs: ['en', 'ru'],
  themes: ['<theme-name>', ...], // all sub folders names from `themes` folder
  output: './dist',
  server: { // will be passed as options for Browser Sync
    tunnel: true, // https://www.browsersync.io/docs/options
    open: false
  }
};
```

Config data is exposed to your templates as `this._config` helper.

## Template helpers

### Meta

Components or layouts may require extra information about your markdown, project, other files, languages, paginations and etc. Mad Mark know this problem ;)

You can get information below in body of your templates by call `this._*`, ex `this._name`, `this._config`:

``` js
{
  _tags, // Array - parsed tags for all pages from meta in yml
  _pagination, // Object - data for pagination
  _paginatable, // Boolean - need pagination
  _config, // Object - project config
  _data, // Object - compiled data by current lang
  _multilang, // undefined || Array - contains `{ lang: String, url: String, current: Boolean, default: Boolean }` objects if there is more then 1 lang in config
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

You can use this information in your templates in this manner:

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

By default Mad Mark transform Markdown to posthtml-tree and apply plugins for semantic
and bemjson content. You can use custom posthtml-plugins by config:

``` js
module.exports = {
  ...
  posthtmlPlugins: [].concat(
    require('mad-mark').posthtmlPlugins,
    require('custom-posthtml-plugin')
  )
};
```

Browse [PostHTML plugins directory](https://github.com/posthtml/posthtml#plugins) to find them all ;)

## CSS transform

You can write CSS for [PostCSS](https://github.com/postcss/postcss) and use any plugins for it by config:

``` js
module.exports = {
  ...
  postcssPlugins: [
    require('postcss-import'),
    require('sharps').postcss(),
    require('postcss-nested'),
    require('postcss-font-magician'),
    require('postcss-browser-reporter'),
    require('postcss-reporter')
  ]
};
```

Browse [PostCSS plugins directory](http://postcss.parts) to find them all ;)

## Vendors

You can connect any external styles and scripts for any layout or for all of them. For example you can connect Bootstrap in your templates:

``` js
block('page').mod('layout', 'any')(
  def()(function () {
    this.ctx.vendors.css = [
      {
        elem: 'css',
        url: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css'
      }
    ];

    this.ctx.vendors.js = [
      {
        elem: 'js',
        url: '//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js'
      },
      {
        elem: 'js',
        url: '//cdnjs.cloudflare.com/ajax/libs/tether/1.3.1/js/tether.min.js'
      },
      {
        elem: 'js',
        url: '//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js'
      }
    ];

    return applyNext();
  })
);
```

All styles will be added to head of your pages and all of scripts will be added to
the end of `body` tag of your pages.

### License MIT
