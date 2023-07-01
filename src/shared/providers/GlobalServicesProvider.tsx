import { useInterpret } from '@xstate/react';
import React from 'react';
import { DesktopMachine, desktopMachine } from '../../machines/desktop.machine';
import { InterpreterFrom } from 'xstate';
// import { inspect } from '@xstate/inspect';

if (import.meta.env.DEV) {
  // * Launch XState Browser Dev Tool
  // inspect({
  //   iframe: false, // open in new window
  // });
}

type Context = {
  desktopService: InterpreterFrom<DesktopMachine>;
};

const GlobalStateContext = React.createContext<Context | null>(null);

function GlobalServicesProvider({ children }: React.PropsWithChildren) {
  const desktopService = useInterpret(desktopMachine, { devTools: true });

  React.useEffect(() => {
    // * for debugging purposes (manually sending events)
    window.desktopService = desktopService;
  }, []);

  return (
    <GlobalStateContext.Provider value={{ desktopService }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export default GlobalServicesProvider;

export function useGlobalServices() {
  const globalServices = React.useContext(GlobalStateContext);

  if (globalServices == null) {
    throw new Error(
      `${useGlobalServices.name} must be used within a ${GlobalServicesProvider.name}`
    );
  }

  return globalServices;
}
