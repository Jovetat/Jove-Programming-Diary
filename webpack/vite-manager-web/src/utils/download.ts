/**
 * 下载文件工具函数
 */

/**
 * 下载 Blob 文件
 * @param blob Blob 对象
 * @param fileName 文件名
 */
export const downloadBlob = (blob: Blob, fileName: string) => {
  // 创建下载链接
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  // 触发下载
  document.body.appendChild(link);
  link.click();

  // 清理
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * 下载文件流
 * @param data 文件流数据
 * @param fileName 文件名
 * @param mimeType MIME 类型
 */
export const downloadFile = (
  data: BlobPart,
  fileName: string,
  mimeType = 'application/octet-stream',
) => {
  const blob = new Blob([data], { type: mimeType });
  downloadBlob(blob, fileName);
};

/**
 * 下载 Excel 文件
 * @param data 文件流数据
 * @param fileName 文件名(不含扩展名)
 */
export const downloadExcel = (data: BlobPart, fileName: string) => {
  const fullFileName = fileName.endsWith('.xlsx')
    ? fileName
    : `${fileName}.xlsx`;
  downloadFile(
    data,
    fullFileName,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
};

/**
 * 下载 TXT 文件
 * @param data 文件流数据
 * @param fileName 文件名(不含扩展名)
 */
export const downloadTxt = (data: BlobPart, fileName: string) => {
  const fullFileName = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
  downloadFile(data, fullFileName, 'text/plain');
};

/**
 * 下载音频文件
 * @param data 文件流数据
 * @param fileName 文件名(不含扩展名)
 */
export const downloadAudio = (data: BlobPart, fileName: string) => {
  const fullFileName = fileName.endsWith('.mp3') ? fileName : `${fileName}.mp3`;
  downloadFile(data, fullFileName, 'audio/mpeg');
};

/**
 * 从URL下载音频文件
 * @param url 音频文件URL
 * @param fileName 文件名(可选,默认从URL提取)
 * @returns Promise<void>
 */
export const downloadAudioFromUrl = async (
  url: string,
  fileName?: string,
): Promise<void> => {
  if (!url) {
    throw new Error('音频URL不能为空');
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`下载失败: ${response.statusText}`);
  }

  const blob = await response.blob();

  let finalFileName = fileName;
  if (!finalFileName) {
    finalFileName = `recording_${Date.now()}.mp3`;
  }

  downloadBlob(blob, finalFileName);
};
