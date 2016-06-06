# Bemark

Tool for static sites generation based on Markdown and [bem-xjst](https://github.com/bem/bem-xjst). Motivation is possibility to build static sites with simple markdown files, themes based on `bem-xjst` extandable templates, add CSS with [PostCSS](https://github.com/postcss/postcss) and transform compiled markdown with [PostHTML](https://github.com/posthtml/posthtml).

## Installation

> npm i --save-dev bemark

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

Second way to build your site is the dev-server wich based on [browser-sync](browsersync.io).

> bemark server -i static

Point your browser to [http://localhost:3000](http://localhost:3000). Now you can edit your content, templates and configs with live-reloading ;)

## Content

To generate static pages put markdown files into `content/*` with lang suffixes (e.g. `index.en.md`).
You may use yaml header to set title and tags like this:

```
---
title: Post title
tags:
    - tag1
    - tag2
    - tag3
---

# Markdown content
```

Every markdown page will be wrapped in layout wich based on [bemhtml](https://en.bem.info/technology/bemhtml/v2/intro) templates for [bem-xjst](https://github.com/bem/bem-xjst) engine. 

## Layouts

When you put your pages into `content/**/*` each of them get layout name based on folder name where they stay. For example file in `content/artciles/index.en.md` has `article` layout. If file stay in the root of `content` folder so it has `root` layout ;) What does it mean for you? It's an unlimited number of possibilities for content customization. For example put template below to `static/themes/<project-name>/page/_layout/page_layout_article.bemhtml.js`:

``` js
block('page').mod('layout', 'article')(
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

It's folder where you can collect your components for layouts. Component is the folder for entity with `*.bemhtml.js`, `*.css` and `*.js` implementation. For example you can write component for header. Put template below to `static/themes/<project-name>/header/header.bemhtml.js`:

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
And rewrite layout for `article`:

``` js
block('page').mod('layout', 'article')(
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

Run `bemark server -i static` to watch result at the same time.

You can use many themes in one project. If you want do this you should make number of folders eq themes number in `themes` folder and talk about this to Bemark by `config.js`.

## Config

Config is the simple commonJs module:

``` js
module.exports = {
  langs: ['en', 'ru'],
  themes: ['<project-name>', ...], // all sub folders names from `themes` folder
  output: './dist',
  minify: true // minify css and js by default
};
```

You can use this data in your temomplates without any problem. 

## Helpers

When write components or layouts you may want extra information about your markdown, project, other files, languages, paginations and etc. Bemark know this problem ;)

You can get information below in any place of your templates by call `this._*`, ex `this._name`, `this._config`:

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

Also for better layouts in any place of your tamplates available [bem-grid](https://github.com/bem-contrib/bem-grid) - modular grid system based on [Lost](https://github.com/peterramsing/lost).

## i18n

i18n is the simple commonJs module:

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

## Assets

You can write CSS for [PostCSS](https://github.com/postcss/postcss). List of available plugins:

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
