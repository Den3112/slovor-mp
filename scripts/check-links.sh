#!/usr/bin/env bash

# check-links.sh
# Script to audit links in markdown files

PROJECT_ROOT=$(pwd)

echo "Auditing links in markdown files..."

# Find all markdown files
find . -name "*.md" -not -path "*/node_modules/*" | while read -r md_file; do
    echo "Processing $md_file..."
    
    # Extract links: [text](link)
    # This regex is simple and might miss some complex cases, but it's a good start.
    grep -oP '\[.*?\]\(\K.*?(?=\))' "$md_file" | while read -r link; do
        # Ignore external links for now
        if [[ $link == http* ]]; then
            # Optional: check if reachable
            # echo "  [EXTERNAL] $link"
            continue
        fi
        
        # Check file:// links
        if [[ $link == file://* ]]; then
            path=${link#file://}
            if [ ! -e "$path" ]; then
                echo "  [BROKEN] $link (File not found: $path)"
            fi
            continue
        fi
        
        # Check relative paths
        # Handle anchors: path/to/file#anchor
        base_path=${link%%#*}
        if [[ -z $base_path ]]; then
            # Anchor in the same file
            continue
        fi
        
        dir=$(dirname "$md_file")
        if [ ! -e "$dir/$base_path" ]; then
            echo "  [BROKEN] $link (Relative path not found: $dir/$base_path)"
        fi
    done
done
