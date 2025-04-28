import React from 'react';
import { AppProvider } from './context/AppContext';
import ExportWizard from './components/ExportWizard';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-cream">
        <ExportWizard />
      </div>
    </AppProvider>
  );
}

export default App;