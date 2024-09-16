import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from './ui/scroll-area';
const CodeEditors = ({ socketRef, roomId, initialUsers, initialCode }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(initialCode);
  const [cursors, setCursors] = useState({});
  const [users, setUsers] = useState(initialUsers);

  // Initialize CodeMirror editor and handle real-time code changes
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realtimeEditor'),
        {
          mode: { name: 'javascript', json: true },
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current.on('change', (instance, changes) => {
        const { origin } = changes;
        const newCode = instance.getValue();
        setCode(newCode);

        if (origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code: newCode,
          });
        }
      });

      editorRef.current.on('cursorActivity', () => {
        const cursor = editorRef.current.getCursor();
        socketRef.current.emit(ACTIONS.CURSOR_MOVE, { roomId, cursor });
      });
    }

    init();
  }, [socketRef, roomId]);

  // Listen for changes from other users via socket
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null && code !== editorRef.current.getValue()) {
          editorRef.current.setValue(code);
        }
      });

      socketRef.current.on(ACTIONS.CURSOR_MOVE, ({ userId, cursor }) => {
        setCursors((prevCursors) => ({
          ...prevCursors,
          [userId]: cursor,
        }));
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
      socketRef.current.off(ACTIONS.CURSOR_MOVE);
    };
  }, [socketRef]);

  return (
    <>
      <CardHeader className="py-2">
        <CardTitle>Code Editor</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="relative font-mono text-sm bg-muted p-4">
            <textarea id="realtimeEditor" defaultValue={initialCode}></textarea>
            
            {/* Render User Cursors */}
            {Object.entries(cursors).map(([userId, cursor]) => {
              const user = users.find((u) => u.id === parseInt(userId));
              if (user && cursor) {
                const { line, ch } = cursor;
                const cursorTop = `${line * 20}px`; // Adjust the height of each line
                const cursorLeft = `${ch * 8}px`; // Adjust the width of each character

                return (
                  <div
                    key={userId}
                    className="absolute"
                    style={{
                      top: cursorTop,
                      left: cursorLeft,
                    }}
                  >
                    <div
                      className="w-0.5 h-5"
                      style={{
                        backgroundColor: user.color,
                      }}
                    ></div>
                    <div className="absolute top-5 left-0 bg-background text-foreground text-xs p-1 rounded whitespace-nowrap">
                      {user.name}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </>
  );
};

CodeEditors.propTypes = {
  socketRef: PropTypes.object.isRequired,
  roomId: PropTypes.string.isRequired,
  initialUsers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  initialCode: PropTypes.string.isRequired,
};

CodeEditors.defaultProps = {
  initialUsers: [
    { id: 1, name: 'Alice Johnson', color: '#FF5733' },
    { id: 2, name: 'Bob Smith', color: '#33FF57' },
    { id: 3, name: 'Charlie Brown', color: '#3357FF' },
  ],
  initialCode: 'function example() {\n  console.log("Hello, collaborative coding!");\n}',
};

export default CodeEditors;
