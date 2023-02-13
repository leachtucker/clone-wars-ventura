import { createMachine, assign } from 'xstate';
import * as Ramda from 'ramda';

export type MachineContext = {
  password: string;
};

const initialContext = {
  password: '',
} as const;

export type Event =
  | { type: 'submit' }
  | { type: 'PASSWORD.CHANGE'; payload: string };

export const loginMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBsD2UCWA7AdBiyYAxLAK4BGAthgC4DaADALqKgAOqstGqWrIAD0QBGACzCANCACeIhgFYcAdlEBOVQA4AzKIBMq3duGqAvialpMufIRIVq9YSyQgOXGjz4uhCMZJmIugxaymqaOvqGWrpmFujYeFgAbgCGyPhEArA0KTRgOCkAZnkATgAU8gwMAJRElgnYqekQjM7snNy8-D66WsLKwcK68lKyvvIAbDi6Ydp6BtoxsSBYqBBw-PVe7e6e3YgAtBOjh1NVVVpaGqIT8qKiChPLW3gEYPxunduCiHonvqoQloVOF5lElnErDgmvgPh0PF1vIgtBMlModMCRgEEBp+mFQZEjKZzCAXo00rCXJ8Ed8fGp+ndblpJqolHdxFp-oYNNMlCjhJUBVdAWYzEA */
  createMachine(
    {
      id: 'login',
      tsTypes: {} as import('./login.machine.typegen').Typegen0,
      schema: {
        context: {} as MachineContext,
        events: {} as Event,
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            submit: [
              {
                target: 'valid',
                cond: 'valid',
              },
              {
                target: 'invalid',
              },
            ],
          },
        },
        valid: {
          type: 'final',
          entry: ['sendToLoggedInView'],
        },
        invalid: {
          after: {
            '500': {
              target: '#login.idle',
              actions: [],
              internal: false,
            },
          },
        },
      },
      on: {
        'PASSWORD.CHANGE': {
          actions: ['updatePassword'],
        },
      },

      context: initialContext,
      predictableActionArguments: true,
      preserveActionOrder: true,
    },
    {
      actions: {
        sendToLoggedInView: () => {
          console.log('Logged in!');
        },
        updatePassword: assign((ctx, event) => {
          return {
            password: event.payload,
          };
        }),
      },
      guards: {
        valid: Ramda.propSatisfies(Ramda.equals('root'), 'password'),
      },
    }
  );
