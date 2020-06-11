# What is it?

Alphabetically sorts the keys in _selected_ JSON objects.

> **Please take care using this** - I've tried to ensure it won't invalidate your JSON. But, as it has to parse > sort > stringify, there is a chance it'll lose something. It should be fine for plain JSON.

> Disclaimer:

![](https://raw.githubusercontent.com/richie5um/vscode-sort-json/master/resources/WorksOnMyMachine.png)

# Install

* Install via VSCode extensions install

# Usage

* Select a JSON object (note, it uses full lines so ensure the selected lines are a valid JSON object)
* Run the extension (Cmd+Shift+P => Sort JSON)

# Updates

* 1.18.0: Allow disabling of context comments - thanks 'jdxcode'
* 1.17.0: Sort by type (experimental code).
* 1.16.0: Sort by values (experimental code).
* 1.15.0: Change algorithm to better cope with JSON quirks.
* 1.14.0: Sortable alphanumerically (a2 < a10).
* 1.13.0: Sortable by key length.
* 1.12.0: Improvements to JSONC comment detecion - thanks 'reporter123'.
* 1.11.0: Tries to use normal JSON outputter for some known JSON issues.
* 1.10.1: Removes (simple) comment lines from JSON before sorting.
* 1.9.2:  Now sorts the whole file if there is no selected text.
* 1.9.0:  Now sorts selected JSON text, even if that is embedded in a JSON object - note, doesn't preserve indents.
* 1.8.0:  Sorts objects within arrays.

# Example

![Example](https://github.com/richie5um/vscode-sort-json/raw/master/resources/usage.gif)

# Settings

* You can override the sort order (note: this applies to all levels and overrides reverse sort too). Add this to your preferences (settings.json):
    * `"sortJSON.orderOverride": ["name", "version", "description"]`
* You can underride the sort order (note: this applies to all levels and underrides reverse sort too). Add this to your preferences (settings.json):
    * `"sortJSON.orderUnderride": ["dependencies", "devDependencies"]`
