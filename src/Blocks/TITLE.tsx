import React from 'react';
import { Block } from '../BlocksContainer/types';
import { RichText } from '../components/Editors';

export const TITLE: Block<string> = {
  Icon: () => <div>Title</div>,
  initialValue: '<h1>This is your title<h1/>',
  convertString: (html: string) => {
    var div = document.createElement('div');
    div.innerHTML = html;
    const text = div.innerText;
    return `<h1>${text}</h1>`;
  },
  View: RichText(['Bold', 'Italic', 'Strike', 'Underline', 'redo', 'undo', 'Highlight'])
};
