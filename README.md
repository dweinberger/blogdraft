# blogdraft
## Client for writing and posting to WordPress

I'm a total amateur and this code is embarrassing.

I've been fiddling with it for maybe ten years. It does the things I want a blogging editor to do. It does them the way an amateur would get them to work. So here's the basic functionality:

- Edit in raw HTML, with buttons and keyboard shortcuts to make things easier. (There's a markdown translator in it but  I haven't turned it on.)

- WYSIWYG view as you type

- Post to your blog directly from this app. (Can post something as a draft if you want.)

- Remembers the links you've made so it can suggest them when you next try to link some anchor text. E.g., if you've linked the phrase "for instance" to www.example.com, it will suggest that link the next time you try to link "for instance."

- Remembers Twitter handles to which you have linked, and gives one-click insertion of them.

- Google search from within the app, and one-press insertion of the results of that search.

- Likewise for Wikipedia.

- Automatic text expansion

- A clunky UI for adding image links.

- A clunky UI for creating tables

- Saves a copy every 100 characters typed (configurable).

- Automatically saves a copy of everything you post.

- Can save a draft. (Not sure why I added that since you can also save copies.)

- Resizable split between draft and wysiwyg views

- Symbols list

- Color picker that provides a color's hex representation for your copying and pasting pleasure.

There are bunches of other little features, too.

I have an installation of WordPress running on a host. I run BlogDraft from the htdocs directory of the MAMP application that I run on my MacBook. I could run it from that host, but I like to be able to work offline, and it's easier for me to write the BD code locally.

Please let me know if you find bugs. Since I don't expect anyone will ever use this Byzantine pile of code, I'm not promising to fix anything. This is very much offered as-is.

But do let me know.

David Weinberger
david@weinberger.org
August 19, 2015

