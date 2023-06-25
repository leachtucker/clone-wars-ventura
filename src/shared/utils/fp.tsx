import * as Ramda from 'ramda';

export const isNotEmpty = Ramda.compose(Ramda.not, Ramda.isEmpty);

export const capitalize = Ramda.replace(/\b\w/g, (subStr) =>
  subStr.toUpperCase()
);
