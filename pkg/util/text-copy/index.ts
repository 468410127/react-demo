export default function textCopy(value, success = undefined) {
  const textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  textarea.value = value;
  textarea.select();
  document.execCommand('Copy'); // 执行浏览器复制命令
  document.body.removeChild(textarea);
  success && success();
}
