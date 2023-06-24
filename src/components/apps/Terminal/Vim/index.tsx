import React from 'react';

import ReactCodeMirror from '@uiw/react-codemirror';
import { basicSetup } from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { vim, Vim as VimExtension } from '@replit/codemirror-vim';

type VimProps = {
  initialValue?: string;
  onQuit?: (value: string) => void;
  onWriteQuit?: (value: string) => void;
};

function Vim(props: VimProps) {
  const [value, setValue] = React.useState(props.initialValue ?? '');

  React.useEffect(() => {
    if (props.onQuit) {
      VimExtension.defineEx('quit', 'q', () => props.onQuit?.(value));
    }

    if (props.onWriteQuit) {
      VimExtension.defineEx('wq', 'wq', () =>
        props.onWriteQuit?.(value)
      );
    }
  });

  return (
    <ReactCodeMirror
      height="100%"
      width="100%"
      value={value}
      onChange={setValue}
      style={{ height: '100%', fontSize: '1.1rem' }}
      theme={vscodeDark}
      extensions={[vim(), basicSetup()]}
      autoFocus
    />
  );
}

export default Vim;
