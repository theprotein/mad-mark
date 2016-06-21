'use strict';

module.exports = function semantize(tree) {

  tree.match({ tag: 'a', attrs: { class: false } }, node => {
    node.block = 'link';
    return node;
  });

  tree.match({ tag: 'ul' }, node => {
    node.block = 'list';
    return node;
  });

  tree.match({ tag: 'ol' }, node => {
    node.block = 'list';
    node.mods = { type: 'ordered' };
    return node;
  });

  tree.match({ tag: 'li' }, node => {
    node.block = 'list';
    node.elem = 'item';
    return node;
  });

  tree.match({ tag: 'p' }, node => {
    node.block = 'paragraph';
    return node;
  });

  tree.match({ tag: /^h\d$/ }, node => {
    node.block = 'heading';
    node.mods = { lvl: node.tag.charAt(1) };
    return node;
  });

  tree.match({ tag: 'table' }, node => {
    node.block = 'table';
    return node;
  });

  tree.match({ tag: 'img' }, node => {
    node.block = 'image';
    return node;
  });

  tree.match({ tag: 'code' }, node => {
    node.block = 'code';
    return node;
  });

  tree.match({ tag: 'blockquote' }, node => {
    node.block = 'blockquote';
    return node;
  });

  tree.match({ tag: 'input', attrs: { type: 'checkbox' } }, node => {
    node.block = 'checkbox';
    return node;
  });

  tree.match({ attrs: { disabled: true } }, node => {
    node.mods = { disabled: true };
    return node;
  });

  return tree;
};
