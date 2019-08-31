export default (content: string, name: string) => {
  const encodedUri = encodeURI(content);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', name);
  link.innerHTML = '';
  document.body.appendChild(link);

  link.click();
};
