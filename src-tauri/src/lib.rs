use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FileNode {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub is_dir: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub children: Option<Vec<FileNode>>,
}

const MAX_DEPTH: usize = 3;

pub fn scan_directory(path: String, depth: usize) -> Result<FileNode, String> {
    if depth > MAX_DEPTH {
        return Err("Maximum depth exceeded".to_string());
    }

    let path_buf = PathBuf::from(&path);

    if !path_buf.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    let name = path_buf
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or(&path)
        .to_string();

    let is_dir = path_buf.is_dir();
    let size = if is_dir {
        calculate_dir_size(&path_buf)
    } else {
        path_buf.metadata().map(|m| m.len()).unwrap_or(0)
    };

    let children = if is_dir && depth < MAX_DEPTH {
        let mut child_nodes = Vec::new();

        if let Ok(entries) = std::fs::read_dir(&path_buf) {
            for entry in entries.flatten() {
                if let Ok(metadata) = entry.metadata() {
                    let file_name = entry
                        .file_name()
                        .to_string_lossy()
                        .to_string();

                    // Skip hidden files and common system folders
                    if file_name.starts_with('.') || should_skip(&file_name) {
                        continue;
                    }

                    let child_path = entry.path();
                    let child_size = if metadata.is_dir() {
                        calculate_dir_size(&child_path)
                    } else {
                        metadata.len()
                    };

                    if child_size > 0 {
                        // Recursively scan subdirectories
                        let child_node = if metadata.is_dir() {
                            match scan_directory(child_path.to_string_lossy().to_string(), depth + 1) {
                                Ok(node) => node,
                                Err(_) => FileNode {
                                    name: file_name,
                                    path: child_path.to_string_lossy().to_string(),
                                    size: child_size,
                                    is_dir: true,
                                    children: None,
                                },
                            }
                        } else {
                            FileNode {
                                name: file_name,
                                path: child_path.to_string_lossy().to_string(),
                                size: child_size,
                                is_dir: false,
                                children: None,
                            }
                        };

                        child_nodes.push(child_node);
                    }
                }
            }
        }

        if !child_nodes.is_empty() {
            Some(child_nodes)
        } else {
            None
        }
    } else {
        None
    };

    Ok(FileNode {
        name,
        path,
        size,
        is_dir,
        children,
    })
}

fn calculate_dir_size(path: &PathBuf) -> u64 {
    std::fs::read_dir(path)
        .into_iter()
        .flatten()
        .filter_map(|entry| entry.ok())
        .filter_map(|entry| entry.metadata().ok())
        .map(|metadata| metadata.len())
        .sum()
}

fn should_skip(name: &str) -> bool {
    matches!(
        name,
        "node_modules" | ".git" | ".DS_Store" | "target" | "dist"
    )
}
