---
id: 62
title: Filing Cabinet Initial Release
postDate: 2013-03-25 18:43:34
original: https://ninedof.wordpress.com/2013/03/25/filing-cabinet-release-v0-1/
---

Just for laughs, here is a release for the Filing Cabinet. Its pretty basic software, but I've been using it to organize notes that were previously fragmented between Google Tasks, Windows 7 Sticky Note gadget and a plain text file. For me, having these notes all in one place seems like a good idea, and doing it myself helps me learn in the process. Without further ado,  [here is the link](https://www.dropbox.com/s/fn2z12rfd21qkcw/FilingCabinet%20release%200.1.zip).

If you're Java literate enough to read the source files you may want to figure out how it works for yourself, but if not, here is a brief summary:
<ol>
	- <span style="line-height:12px;">All 'notes' are an Entry. These have three fields: ID, Label and Content, all represented as strings. These fields are saved in a '.entry' file.</span>
	- All 'drawers' in the Filing Cabinet are Drawers. These can have any number (though at the moment set to 100) of Entries, and manage creating, listing and deleting individual Entries. These are identified in the respective folder via a '.drawer' file.
	- The 'Filing Cabinet' itself manages the drawers (currently six) in the same manner as mentioned above. After each create or delete operation, all entries and drawers are saved to disk in the path specified. The path can be changed using 'change path'. If the path is changed, the existing files are reloaded from disk straight away from the new location.
</ol>
There are quite a few bugs, so please let me know what you find. I'm still adding features, and if it proves useful to me I'll probably make a GUI for it.

Enjoy!
