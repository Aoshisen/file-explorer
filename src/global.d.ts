/// <reference types="@tauri-apps/api" />
//允许导入.css 文件
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

