// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use file_explorer::{scan_directory, FileNode};

#[tauri::command]
fn hello_world() -> String {
    "Hello from Tauri!".to_string()
}

#[tauri::command]
fn scan_dir(path: String) -> Result<FileNode, String> {
    scan_directory(path, 0)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![hello_world, scan_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
