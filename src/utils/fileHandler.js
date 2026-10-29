export const getRelativePath = (href, basePath) => {
  if (!href) return null;
  const cleanPath = href.replace(/^\.\//, '');
  return basePath + '/' + cleanPath;
};

// blob URL -> path relative to the export folder, used by the static HTML export.
export const blobRelativePaths = new Map();

export const findFileInFolder = async (files, path) => {
  if (!path) return null;
  const normalizedPath = path.replace(/\\/g, '/').replace(/^\.\//, '');
  for (const file of files) {
    const relativePath = (file.webkitRelativePath || file.name).replace(/\\/g, '/');
    if (relativePath === path || relativePath.endsWith(`/${normalizedPath}`) || relativePath === normalizedPath) {
      const url = URL.createObjectURL(file);
      blobRelativePaths.set(url, relativePath.split('/').slice(file.webkitRelativePath ? 1 : 0).join('/'));
      return url;
    }
  }
  return null;
};

export const parseHTML = (htmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(htmlString, 'text/html');
};
