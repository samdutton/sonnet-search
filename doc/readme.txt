Shakespeare Sonnet Search
-------------------------

Instant search for William Shakespeare's sonnets.


How to use it
-------------

Enter text in the input box at the top of the page to display lines from sonnets containing the text.

Search is not case sensitive. Note that a minimum of two characters must be entered. Line numbers are shown to the right of each line. 

Click any line to display the whole sonnet from which it is taken.

Click on a sonnet to close it.


How does it work?
-----------------

The sonnets are stored in JSON format in json/sonnets.js.

The first time the app is first opened, the JSON is parsed and the sonnets are stored in a Web SQL Database, stored locally.

Whenever query text is entered or altered, the database is queried and any results are formatted and displayed.


Feedback
--------

Please send bug reports, comments or feature requests to samdutton@gmail.com.

For more information, please visit my website samdutton.com or my blog at samdutton.wordpress.com.
