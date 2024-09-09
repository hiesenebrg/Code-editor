import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import Login from './pages/Login';
import CollaborativeCodeEditor from './components/collaborative-code-editor';

function App() {
    return (
        <>
            <div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        success: {
                            theme: {
                                primary: '#4aed88',
                            },
                        },
                    }}
                ></Toaster>
            </div>
            
                <Routes>
                <Route path="/login" element={<Login/>}></Route>

                    <Route path="/" element={<Home />}></Route>
                    <Route
                        path="/editor/:roomId"
                        element={<CollaborativeCodeEditor />}
                    ></Route>
                    <Route
                        path="/collabcode"
                        element={<CollaborativeCodeEditor/>}
                    ></Route>
                </Routes>
        </>
    );
}

export default App;
