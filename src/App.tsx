import GlobalStyles from './shared/GlobalStyling';
import Desktop from './Desktop';
import GlobalServicesProvider from './shared/providers/GlobalServicesProvider';
import ThemeProvider from './shared/providers/ThemeProvider';

function App() {
  return (
    <>
      <GlobalStyles />
      <GlobalServicesProvider>
        <ThemeProvider>
          <Desktop />
        </ThemeProvider>
      </GlobalServicesProvider>
    </>
  );
}

export default App;
