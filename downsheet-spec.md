# Downsheet spec

This file is the start of an attempt to specify downsheet. It's very work in progress because I'm writing the spec and the implementation at the same time as I build and test features.


## Spec
- Downsheet files must be valid TOML 1.0 or higher (must be UTF8)
- Downsheet files should use the `.dsh` extension
- Downsheet files must pass the minimum requirements (see below)
- Downsheet files should be formatted to the formatted requirement (see below)

### Minimum requirements to be valid
- Have a `data` key with and array of arrays
- If there is a formats key
  - It must be a hash of valid formats
- If there is a formulas key
  - It must be a hash of valid spreadsheet formula
  - All keys must refer to valid cells
  - The result of the formula must match the value in the cell

### Formatted requirements
- TODO
