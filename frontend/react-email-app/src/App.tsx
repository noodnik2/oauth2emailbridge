import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    {/* Add other routes here */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
