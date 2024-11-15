import { ITEM_PER_PAGE } from './settings';

export const renderNo = (index: number, page: number) => {
  return (page - 1) * ITEM_PER_PAGE + index + 1;
};
