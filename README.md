#What does it do and how it works

Lazy Text View widget is intended to display text on a web-page. The key feature is that it does not load whole text in the browser memory, but it displays only fragment (frame) of file. This allows to display large, very large, huge texts. The widget allows to scroll text up and down using arrow keys, PgUp, PgDn, Home, End as well as using mouse. On the left side line numbers are displayed and green indicator, which displays the current view position. Unfortunately, current version supports incremental scrolling only, it doesn't have vertical scrollbar, which could allow to jump to any random view position.

#Requirements

Lazy Text View widget is written using JavaScript and jQuery. So, it is required to include jQuery. Widget was tested with jQuery v. 1.4.1. Also jquery-mousewheel and jquery-toaster plugins are required.

#Architecture

The widget provides user interface for text display and requires server-side data source. You have to implement server-side component yourself, it's logic is quite simple. When the widget needs next chunk of text, it queries server (using POST-method) for the next chunk. The request specifies data source ID, starting number of string and quantity of requested strings. Also request specifies a direction: forward or reverse. So, you have to write program (servlet, controller etc...), which would be able to output some number of text strings starting from specified string in forward or reverse direction. You may use any programming language: Java, PHP, Pyton.... it doesn't matter. Your controller just must accept POST-request and output JSON-data. The widget accepts data in JSON format. 

###More details in README.PDF
