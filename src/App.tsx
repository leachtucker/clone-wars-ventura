import GlobalStyles from './shared/GlobalStyling';
import Desktop from './Desktop';
import GlobalServicesProvider from './shared/providers/GlobalServicesProvider';

function App() {
  return (
    <>
      <GlobalStyles />
      <GlobalServicesProvider>
        <Desktop />
      </GlobalServicesProvider>
    </>
  );
}

export default App;
