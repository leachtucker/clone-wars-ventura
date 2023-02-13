import * as Ramda from 'ramda';

export const isNotEmpty = Ramda.compose(Ramda.not, Ramda.isEmpty);
