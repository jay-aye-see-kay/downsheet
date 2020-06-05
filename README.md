# Downsheet

Downsheet is a plain text spreadsheet format, it aims to be to spreadsheets what CommonMark markdown has become to documents. A simple and easy to read text format that can also be read by rich text editors and rendered to html and styled semantically. Downsheet is a strict subset of toml 1.0rc1 (toml 0.5 was not suitable as it does not support heterogeneous arrays).

This repo contains a work-in-progress implementation of `dsc`, the Downsheet Calculator. And the work in progress attempted unambiguous specification (downsheet-spec.md).


## Example
```toml
[formula]
B4 = "B1+B2+B3"
# OR using sum() function
B4 = "sum(B1:B3)"

data = [
  # A                B           C
  [ "first weight",  5,          "kg", ], # 1
  [ "second weight", 1.5,        "kg", ], # 2
  [ "second weight", 1.0,        "kg", ], # 3
  [ "total weight",  7.5,        "kg", ], # 4
  [ "",              "",         "",   ], # 5
  [ "date measured", 2020-04-27, "",   ], # 6
]
```


## Goals
- Be unambiguous to human and machine
- Generate meaningful diffs when used with version control
- Support a bare minimum of spreadsheet features to be useful (see below for details)
- Support data types commonly used for programming (without type coercion)
- Be parseable by any programming language
- Be suitable as a general purpose data source and sink for reasonable amounts of tabular data (less than 10,000 cells)
- Be able to be displayed and edited in a traditional spreadsheet GUI
- Encourage multiple implementations to support different types of users
- Be familiar where possible, well known conventions should not be broken without a good reason


## Non goals
- Matching the feature set of any existing spreadsheet software
- Performance (there is enough performant software for processing tabular data, this is about a user experience)
- Built in charts or graphics


## Minimum feature set
- Have simple semantic text formatting (i.e. this range should be emphasised)
- Have simple data formatting (i.e. display floats to 2 dp, or dates should be dd/mm/yyyy)
- Support simple calculated values (i.e. `SUM(A:A)` or `A2+B2`)


## Create with the following uses in mind
- Managing a personal or project budget
- Planning a holiday itinerary
- Keeping a plain text record of transactions


## Decisions/plans still to be made
- The syntax and functions available in formula
- If other coordinates are available in formula (relative, 0 indexed, fixed with a $)
- The syntax of formatting rules


## Requirements before hitting version 1.0
There should be implementations of all intended ways to use this file format to likely hit all edge cases and resolve any poor decisions. Once this file format hits version 1 there should never need to be a version 2.
- A standard calculator `dsc` must be implemented and stable
- Multiple implementations as a GUI (preferably one TUI and one HTML based)
- Multiple editor plugins


## File format options considered
A subset of an existing format was chosen as I wanted it to be parseable by most languages out of the box. A custom file format was considered but offered too few benefits to justify losing parseability.

### JSON
- PRO: Easily read by nearly any programming language
- CON: Not so easily read or written by humans
- CON: Does not support comments
- CON: Does not have a date datatype

### YAML
- PRO: More human readable than JSON (in my opinion)
- PRO: Supports comments
- CON: Ambiguous https://github.com/cblp/yaml-sucks
- CON: Complex and difficult to implement correctly

### XML
- PRO: Well supported and well known
- CON: Verbose and unpleasant to write by hand
- CON: Complex and difficult to implement correctly

### TOML (winner)
- PRO: Simple and easier to implement
- PRO: Supports all the data types I want
- PRO: Has been around long enough that most languages have some support (which seems to be growing)
- CON: New, less tested than other options, less well known
