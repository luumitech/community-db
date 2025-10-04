#
# Update README.md
#
# Process the table in the "🛠️ Tech Stack" section and update the node package version
# by scanning the yarn.lock file
#

source "$(dirname "$0")/sed-util.sh"
README_FILE="README.md"

echo "Checking $README_FILE for potential updates.."

# Use a symbol that is not used in the Tech Stack table
sed_delimiter="~"
in_tech_stack=0
modify_count=0

while IFS= read -r line; do
  # Detect start of Tech Stack section
  if echo "$line" | grep -q '^## 🛠️ Tech Stack'; then
    in_tech_stack=1
    continue
  fi

  # Detect start of a new section — stop processing
  if [ "$in_tech_stack" -eq 1 ] && echo "$line" | grep -q '^## '; then
    in_tech_stack=0
    break
  fi

  # Only process lines inside the Tech Stack section
  if [ "$in_tech_stack" -eq 1 ]; then
    # Skip separator row (dashes)
    if echo "$line" | grep -Eq '^\|[-| ]+\|$'; then
      continue
    fi

    # Skip header row (column titles)
    if echo "$line" | grep -iqE '\|.*category.*\|.*technology.*\|.*package.*\|.*version.*\|'; then
      continue
    fi

    # Only process lines with 4 columns
    num_columns=$(echo "$line" | awk -F '|' '{
      count = 0;
      for (i = 1; i <= NF; i++) {
        if ($i ~ /[^[:space:]]/) count++;
      }
      print count
    }')
    if [ "$num_columns" -ne 4 ]; then
      continue
    fi

    # Extract package name from column 3 (4th field)
    package=$(echo "$line" | awk -F '|' '{gsub(/^[ \t]+|[ \t]+$/, "", $4); print $4}')

    # Skip empty or header rows
    if [ -z "$package" ] || [ "$package" = "Package" ]; then
      continue
    fi

    # Get latest version from yarn
    version=$(yarn info "$package" -A --json | jq -r '.children.Version')

    if [ -z "$version" ]; then
      echo "⚠️  Warning: Could not get version for package: $package"
      continue
    fi

    # Rebuild line with new version (column 4)
    new_line=$(echo "$line" | awk -F '|' -v version="$version" '{
      for (i = 1; i <= NF; i++) {
        gsub(/^[ \t]+|[ \t]+$/, "", $i)
      }
      printf("| %s | %s | %s | %s |", $2, $3, $4, version)
    }')

    if [ "$line" = "$new_line" ]; then
      continue
    fi

    echo "✅ Updating $package to version $version"

    # Generate sed expression and perform replacement inline
    escaped_old=$(escape_for_sed "$line")
    escaped_new=$(escape_for_sed "$new_line")
    sed_expr="s${sed_delimiter}${escaped_old}${sed_delimiter}${escaped_new}${sed_delimiter}g"
    x_platform_sed "$sed_expr" "$README_FILE"
    modify_count=$((modify_count + 1))
  fi

done < "$README_FILE"

if [ "$modify_count" -eq 0 ]; then
  echo "No updates were made to $README_FILE."
else
  echo "🎯 Updated $modify_count entries in tech stack table."
fi

