import { Block } from '../BlocksContainer/types';
import { RichText } from '../components/Editors';

export const AUTHORS: Block<string> = {
  Icon: () => <div>Authors</div>,
  initialValue: '',
  convertString: (html: string) => {
    var div = document.createElement('div');
    div.innerHTML = html;
    const text = div.innerText;
    return `<div>${text}</div>`;
  },
  View: RichText([])
};
