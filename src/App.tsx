import { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// Automatically maps metadata targets emitted via AWS during pipeline runs
import outputs from '../amplify_outputs.json';
Amplify.configure(outputs);

interface OperationMemo {
  id: string;
  title: string;
  timestamp: string;
}

export default function App() {
  const [memos, setMemos] = useState<OperationMemo[]>([]);
  const [input, setInput] = useState<string>('');

  const handleCreateMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMemo: OperationMemo = {
      id: Math.random().toString(36).substring(2, 9),
      title: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMemos([...memos, newMemo]);
    setInput('');
  };

  const handleEvictMemo = (id: string) => {
    setMemos(memos.filter(memo => memo.id !== id));
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div style={{
          padding: '40px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          maxWidth: '600px',
          margin: '60px auto',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          border: '1px solid #e1e8ed'
        }}>
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            borderBottom: '2px solid #f5f8fa',
            paddingBottom: '15px'
          }}>
            <h2 style={{ margin: 0, color: '#1c1e21', fontSize: '24px' }}>
              🛡️ FSC Core Operations Portal
            </h2>

            <button
              onClick={signOut}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                transition: 'background-color 0.2s'
              }}
            >
              Terminate Session
            </button>
          </header>

          <div style={{
            backgroundColor: '#e8f4fd',
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '25px'
          }}>
            <p style={{ margin: 0, color: '#1b95e0', fontSize: '15px' }}>
              Authenticated Operator ID:{' '}
              <strong>
                {user?.signInDetails?.loginId || 'Secure System Token'}
              </strong>
            </p>
          </div>

          <form
            onSubmit={handleCreateMemo}
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '30px'
            }}
          >
            <input
              type="text"
              placeholder="Input secure operational audit log..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                borderRadius: '6px',
                border: '1px solid #ccd6dd',
                outline: 'none'
              }}
            />

            <button
              type="submit"
              style={{
                padding: '14px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Commit Log
            </button>
          </form>

          <h3 style={{
            fontSize: '18px',
            color: '#657786',
            marginBottom: '15px'
          }}>
            Active Workspace Records
          </h3>

          <ul style={{
            listStyleType: 'none',
            padding: 0,
            margin: 0
          }}>
            {memos.length === 0 ? (
              <p style={{
                textAlign: 'center',
                color: '#8899a6',
                padding: '20px',
                border: '1px dashed #ccd6dd',
                borderRadius: '8px'
              }}>
                No operations logs committed to memory trace.
              </p>
            ) : (
              memos.map(memo => (
                <li
                  key={memo.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#f8f9fa',
                    marginBottom: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e1e8ed'
                  }}
                >
                  <div>
                    <div style={{
                      color: '#212529',
                      fontWeight: '500'
                    }}>
                      {memo.title}
                    </div>

                    <small style={{
                      color: '#6c757d',
                      fontSize: '12px'
                    }}>
                      Timestamp: {memo.timestamp}
                    </small>
                  </div>

                  <button
                    onClick={() => handleEvictMemo(memo.id)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#dc3545',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      padding: '0 8px'
                    }}
                  >
                    ✕
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </Authenticator>
  );
}