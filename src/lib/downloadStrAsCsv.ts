import forceDownloadStr from '@src/lib/forceDownloadStr';

export default (content: string, name: string) => {
  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += content;

  forceDownloadStr(csvContent, name);
};
