'use strict';

module.exports = function semantize(tree) {

  tree
    .match({ tag: 'a', attrs: { class: false } }, node => {
      node.block = 'link';
      return node;
    })
    .match({ tag: 'ul' }, node => {
      node.block = 'list';
      return node;
    })
    .match({ tag: 'ol' }, node => {
      node.block = 'list';
      node.mods = { type: 'ordered' };
      return node;
    })
    .match({ tag: 'li' }, node => {
      node.block = 'list';
      node.elem = 'item';
      return node;
    })
    .match({ tag: 'p' }, node => {
      node.block = 'paragraph';
      return node;
    })
    .match({ tag: /^h\d$/ }, node => {
      node.block = 'heading';
      node.mods = { lvl: node.tag.charAt(1) };
      return node;
    })
    .match({ tag: 'table' }, node => {
      node.block = 'table';
      return node;
    })
    .match({ tag: 'img' }, node => {
      node.block = 'image';
      return node;
    })
    .match({ tag: 'code' }, node => {
      node.block = 'code';
      return node;
    })
    .match({ tag: 'blockquote' }, node => {
      node.block = 'blockquote';
      return node;
    })
    .match({ tag: 'input', attrs: { type: 'checkbox' } }, node => {
      node.block = 'checkbox';
      return node;
    })
    .match({ attrs: { disabled: true } }, node => {
      node.mods = { disabled: true };
      return node;
    });

  return tree;
};
