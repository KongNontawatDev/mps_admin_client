import { useEffect } from "react";

export const convertOrderCondition = (order:string) => {
  const result = order == 'ascend' ? 'asc' : (order == 'descend' ? 'desc' : "")
  return result
}

export const DownloadWindow = ({ fileUrl }:any) => {
  if(fileUrl=='') {
    return null
  }
  useEffect(() => {
    const downloadWindow = window.open(fileUrl, '_blank');

    const closeWindow = () => {
      if (downloadWindow) {
        downloadWindow.close();
      }
    };

    // Listen for the window being closed by the user
    window.addEventListener('beforeunload', closeWindow);

    // Listen for the download to be complete
    downloadWindow?.addEventListener('load', closeWindow);

    return () => {
      // Clean up event listeners
      window.removeEventListener('beforeunload', closeWindow);
      downloadWindow?.removeEventListener('load', closeWindow);
    };
  }, [fileUrl]);

  return null;
};

export function ellipsis(input: string|number): string {
  let str: string;

  if (typeof input === 'number') {
    str = input.toString();
  } else {
    str = input;
  }

  if (str.length <= 3) {
    return str;
  } else {
    return '...' + str.slice(-3);
  }
}