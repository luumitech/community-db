# Function to escape special characters for use in sed regular expressions
#
# Usage: escape_for_sed <string>
#
# Arguments:
#   $1 (string): The string to escape for use in sed regular expressions.
#
# Outputs:
#   Escaped string to STDOUT.
#
# Return Value:
#   0 on success.
#
escape_for_sed() {
  printf '%s' "$1" | sed -e 's/[.[\*^$/&{}|+?\\-]/\\&/g'
}


# Replace inline using sed (cross-platform)
#
# Usage: x_platform_sed <sed_expr> <input_file>
#
# Arguments:
#   $1 (sed_expr): The sed command/expression to execute.
#   $2 (input_file): The file to modify.
#
# Outputs:
#   Modifies the specified file in-place.
#
# Return Value:
#   0 on success, non-zero on failure.
#
x_platform_sed() {
  local sed_expr="$1"
  local input_file="$2"

  if sed --version >/dev/null 2>&1; then
    # GNU sed
    sed -i -e "$sed_expr" "$input_file"
  else
    # BSD/macOS sed
    sed -i '' "$sed_expr" "$input_file"
  fi
}
