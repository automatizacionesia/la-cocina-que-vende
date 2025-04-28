import React from 'react';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import ExportWizard from './components/ExportWizard';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <div className="min-h-screen bg-cream">
          <ExportWizard />
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;